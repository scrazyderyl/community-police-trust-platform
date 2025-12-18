import * as d3 from "d3";

export function pixelAlignedTicks(
  scale: d3.ScaleLinear<number, number>,
  minPixelStep: number,
  height: number
): number[] {
  const [min, max] = scale.domain();
  const range = max - min;

  // maximum number of ticks allowed by the minimum tick spacing
  const maxTicks = Math.floor(height / minPixelStep);

  // numeric step that fills the space as much as possible
  const step = Math.ceil(range / maxTicks);

  return d3.range(min, max + step, step);
}
