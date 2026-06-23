export type OutscapeResult = {
  /** Per-unit visibility flags, aligned with the input `units` array. */
  visibles: boolean[]
}

/**
 * Decide which scale-ruler units stay visible at a given zoom level.
 *
 * Given a list of unit sizes (in value-space, e.g. milliseconds for a time
 * ruler) and the value range currently mapped across `viewWidth` pixels, a unit
 * is considered visible when one of its ticks spans at least `viewMinWidth`
 * pixels. Smaller units fade out first as you zoom out.
 *
 * @param units ruler unit sizes in value-space (e.g. `[min, hour, day]`)
 * @param range total value range covered by the view
 * @param viewWidth view width in pixels
 * @param viewMinWidth minimum pixels a unit must span to stay visible
 * @returns `{ visibles }` — a boolean per unit, in the same order as `units`
 *
 * @example
 * const min = 60_000
 * const hour = 60 * min
 * outscape([min, 5 * min, hour], 8 * hour, 1000, 10)
 * // => { visibles: [false, true, true] }
 */
export const outscape = (
  units: number[],
  range: number,
  viewWidth: number,
  viewMinWidth: number
): OutscapeResult => {
  const rate = viewWidth / range
  const visibles = units.map((v) => v * rate > viewMinWidth)

  return { visibles }
}
