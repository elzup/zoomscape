import { describe, expect, it } from "vitest"
import { outscape } from "../index.js"

const min = 60 * 1000
const hour = 60 * min
const min5 = 5 * min
const min10 = 10 * min
const min30 = 30 * min

const units = [min, min5, min10, min30, hour]

describe("outscape (core behavior)", () => {
  it("full enough — every tier visible", () => {
    expect(outscape(units, 8 * hour, 10000, 10)).toStrictEqual({
      visibles: [true, true, true, true, true],
    })
  })

  it("fadeout min", () => {
    expect(outscape(units, 8 * hour, 1000, 10)).toStrictEqual({
      visibles: [false, true, true, true, true],
    })
  })

  it("fadeout min5", () => {
    expect(outscape(units, 8 * hour, 500, 10)).toStrictEqual({
      visibles: [false, false, true, true, true],
    })
  })

  it("all hidden when the view is tiny", () => {
    expect(outscape(units, 8 * hour, 1, 10)).toStrictEqual({
      visibles: [false, false, false, false, false],
    })
  })
})

describe("outscape (boundaries)", () => {
  it("is strictly greater-than — exactly viewMinWidth stays hidden", () => {
    // unit * (viewWidth / range) === viewMinWidth -> hidden
    expect(outscape([10], 100, 100, 10)).toStrictEqual({ visibles: [false] })
  })

  it("just above the threshold is visible", () => {
    expect(outscape([10.0001], 100, 100, 10)).toStrictEqual({
      visibles: [true],
    })
  })

  it("viewMinWidth of 0 shows every positive unit", () => {
    expect(outscape([1, 2, 3], 100, 100, 0)).toStrictEqual({
      visibles: [true, true, true],
    })
  })

  it("a zero-sized unit is never visible", () => {
    expect(outscape([0, 1], 100, 100, 0)).toStrictEqual({
      visibles: [false, true],
    })
  })

  it("a single unit can be visible", () => {
    expect(outscape([hour], 8 * hour, 1000, 10)).toStrictEqual({
      visibles: [true],
    })
  })

  it("empty units yields empty visibles", () => {
    expect(outscape([], 100, 100, 10)).toStrictEqual({ visibles: [] })
  })
})

describe("outscape (generic pixel ruler, not time)", () => {
  const ticks = [1, 5, 10, 25, 100]

  it("hides the finest ticks on a 100-unit range across 300px", () => {
    // threshold unit > viewMinWidth * range / viewWidth = 8 * 100 / 300 ≈ 2.67
    expect(outscape(ticks, 100, 300, 8)).toStrictEqual({
      visibles: [false, true, true, true, true],
    })
  })

  it("shows every tick when the view is wide enough", () => {
    expect(outscape(ticks, 100, 2000, 8)).toStrictEqual({
      visibles: [true, true, true, true, true],
    })
  })
})
