# Crap-5

[Open the simulator](https://xpdr.aero/crap-5/)

An independent, interactive flight computer based on the functions described in the [Pooleys CRP-5 handbook](https://www.pooleys.com/media/7870/crp-5-booklet-2017.pdf). No installation or external libraries required: open `index.html` in a browser. Works offline after saving the file.

## Calculation side

- Two logarithmic scales and a separate movable cursor: ratios, multiplication, division, speed/distance/time and fuel flow/endurance.
- Rate index and minutes-to-hours scale.
- Airspeed window: rotating pressure-altitude ticks aligned with fixed COAT temperature ticks. Density-altitude window follows the same disc setting.
- Mach index and local speed of sound.
- True-altitude temperature/pressure-altitude alignment window using the handbook's instructional temperature-ratio approximation.
- Compressibility correction with initial/corrected TAS. The simulator applies an exact subsonic pitot-pressure calculation, rather than reproducing the physical device's approximate divisions scale.
- Corrected distance, length and volume conversion datums; kg/lb specific-gravity scales for fuel conversions.
- Temperature-rise scale (0.8 recovery factor) and Celsius/Fahrenheit conversion.

## Wind side

- Rotating compass disc with heading, drift and variation indices.
- L (40–300 kt), H (150–1050 kt) and runway-component grids.
- Click to pencil a cross; drag inside to slide the grid; drag the compass ring to rotate. Explicit tool buttons lock an action.
- Pencil lines support drift-line intersections for wind checks at turning points. All marks rotate with the disc. Changing the velocity scale clears them.
- Slide-edge mm/inch and 1:250,000 / 1:500,000 chart rulers, plus chart-distance conversion. Virtual ruler markings are not physically calibrated to your monitor.
- Undo/clear marks, magnification/panning and precision numeric controls.

Use **Set the scales** to snap to a pressure/temperature setting or load a handbook example. The rendered windows and main scales move together. Conversions and ratio controls likewise position the instrument rather than only displaying an unrelated answer.

## Accuracy and scope

This is a functional simulator with redrawn scale geometry, not an exact artwork reproduction or an affiliated Pooleys product. Compressibility uses the exact subsonic model; the manual's rounded examples will differ slightly. Density/pressure use ISA with an isothermal layer above the tropopause. True-altitude correction is instructional, not an operational terrain-clearance calculation. Temperature-rise recovery depends on the aircraft/probe; the drawn scale uses 0.8 to match the handbook example. For training, not operational navigation.

## Development

- `python3 build.py` rebuilds the self-contained page from `src/instrument.html` and the shared numerical model.
- `node --test tests/flight-math.test.mjs` runs handbook examples, physics consistency, conversions and input limits.
- `node tests/browser.cjs` runs browser interactions with Playwright (install Playwright and adjust the Chrome executable path for your system).

The page uses local browser storage to remember the instrument setting. It does not send data to a server.
