export const norm = a => (a % 360 + 360) % 360;
export const logAngle = v => norm(360 * Math.log10(v));
export const isaTemperature = feet => 288.15 - .0019812 * feet;
export function pressure(feet) {
  if (!Number.isFinite(feet) || feet < -2000 || feet > 50000) throw new RangeError('Pressure altitude must be −2000 to 50000 ft.');
  return feet <= 36089.24 ? (isaTemperature(feet) / 288.15) ** 5.25588 : .22336087 * Math.exp(-(feet - 36089.24) * .3048 / 6341.62);
}
export function density(feet, celsius) { return pressure(feet) * 288.15 / (celsius + 273.15); }
export const airRotation = (feet, celsius) => -180 * Math.log10(density(feet,celsius));
export const soundSpeed = celsius => Math.sqrt(1.4 * 287.05287 * (celsius + 273.15)) / .514444444;
export function densityAltitude(sigma) {
  if (!(sigma > 0)) throw new RangeError('Density must be positive.');
  // Invert the same ISA model used by pressure(), including the isothermal layer.
  const tropSigma = .22336087 * 288.15 / 216.65;
  return sigma >= tropSigma ? (1 - sigma ** (1 / 4.25588)) * 288.15 / .0019812 : 36089.24 - Math.log(sigma/tropSigma)*6341.62/.3048;
}
export const trueAltitudeRotation = (feet, celsius) => 360 * Math.log10((celsius + 273.15) / isaTemperature(feet));
export function airData(feet,celsius,cas) {
  if (!Number.isFinite(celsius) || celsius < -80 || celsius > 60) throw new RangeError('COAT must be −80 to +60 °C.');
  if (!Number.isFinite(cas) || cas <= 0 || cas > 700) throw new RangeError('CAS must be greater than 0 and no more than 700 kt.');
  const p=pressure(feet), sigma=density(feet,celsius), qc=(1+.2*(cas/661.4788)**2)**3.5-1;
  const mach=Math.sqrt(5*((1+qc/p)**(2/7)-1));
  if(mach>=1)throw new RangeError('This airspeed model is subsonic; reduce CAS or altitude.');
  return {initial:cas/Math.sqrt(sigma),tas:mach*soundSpeed(celsius),mach,da:densityAltitude(sigma),rotation:airRotation(feet,celsius)};
}
// Temperature-rise scale uses recovery factor .8, matching the CRP-5 handbook's 297 kt / 9 °C example.
export const temperatureRise = tas => .8 * (tas * .514444444)**2 / (2 * 1004.685);
export const units = [
  {v:10,label:'KM · M · LTR'}, {v:10/1.852,label:'NAUT M'}, {v:10/1.609344,label:'STAT M'},
  {v:10/.9144,label:'YARDS'}, {v:10/.3048,label:'FEET'},
  {v:10/4.54609,label:'IMP GAL'}, {v:10/3.785411784,label:'US GAL'}
];
export function windRead(heading,tas,from,speed) {
  const r=Math.PI/180, x=-speed*Math.sin((from-heading)*r), y=speed*Math.cos((from-heading)*r);
  const drift=Math.atan2(x,tas-y)/r;
  return {gs:Math.hypot(x,tas-y),drift,track:norm(heading+drift)};
}
