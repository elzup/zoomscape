import { describe, expect, it } from "vitest"
import { outscape } from "../index.js"

const min = 60 * 1000
const hour = 60 * min
const min5 = 5 * min
const min10 = 10 * min
const min30 = 30 * min

const units = [min, min5, min10, min30, hour]

describe("outscape", () => {
  it("full enough", () => {
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

  it("all hidden when view is tiny", () => {
    expect(outscape(units, 8 * hour, 1, 10)).toStrictEqual({
      visibles: [false, false, false, false, false],
    })
  })

  it("empty units yields empty visibles", () => {
    expect(outscape([], 100, 100, 10)).toStrictEqual({ visibles: [] })
  })
})
