import { describe, expect, it } from "vitest"
import { outscape } from "../index.js"

const min = 60 * 1000
const hour = 60 * min

// [1min, 5min, 15min, hour] — the tiers drawn in assets/outscape.svg
const tiers = [min, 5 * min, 15 * min, hour]
const VIEW_WIDTH = 600
const VIEW_MIN = 10

describe("outscape (README / SVG zoom levels)", () => {
  it("zoom 1× (range 6h): only 15min and hour survive", () => {
    expect(
      outscape(tiers, 6 * hour, VIEW_WIDTH, VIEW_MIN).visibles
    ).toStrictEqual([false, false, true, true])
  })

  it("zoom 3× (range 2h): 5min appears", () => {
    expect(
      outscape(tiers, 2 * hour, VIEW_WIDTH, VIEW_MIN).visibles
    ).toStrictEqual([false, true, true, true])
  })

  it("zoom 12× (range 30m): even 1min is legible", () => {
    expect(
      outscape(tiers, 30 * min, VIEW_WIDTH, VIEW_MIN).visibles
    ).toStrictEqual([true, true, true, true])
  })

  it("zooming in only ever reveals more tiers, never fewer", () => {
    const ranges = [8 * hour, 4 * hour, 2 * hour, hour, 30 * min, 10 * min]
    const counts = ranges.map(
      (range) =>
        outscape(tiers, range, VIEW_WIDTH, VIEW_MIN).visibles.filter(Boolean)
          .length
    )
    const sortedAscending = [...counts].sort((a, b) => a - b)
    expect(counts).toStrictEqual(sortedAscending)
  })
})

describe("outscape (README usage examples)", () => {
  const units = [min, 5 * min, 10 * min, 30 * min, hour]

  it("8h across 1000px hides the minute tier", () => {
    expect(outscape(units, 8 * hour, 1000, 10).visibles).toStrictEqual([
      false,
      true,
      true,
      true,
      true,
    ])
  })

  it("8h across 500px also hides the 5-minute tier", () => {
    expect(outscape(units, 8 * hour, 500, 10).visibles).toStrictEqual([
      false,
      false,
      true,
      true,
      true,
    ])
  })

  it("8h across 10000px shows everything", () => {
    expect(outscape(units, 8 * hour, 10000, 10).visibles).toStrictEqual([
      true,
      true,
      true,
      true,
      true,
    ])
  })
})
