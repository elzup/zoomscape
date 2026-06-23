import { describe, expect, it } from "vitest"
import { outscape } from "../index.js"

describe("outscape (invariants)", () => {
  it("returns one flag per input unit, in order", () => {
    const units = [3, 1, 9, 2, 7]
    const { visibles } = outscape(units, 100, 100, 2)
    expect(visibles).toHaveLength(units.length)
  })

  it("does not mutate the input units", () => {
    const units = [1, 2, 3]
    const snapshot = [...units]
    outscape(units, 100, 100, 1)
    expect(units).toStrictEqual(snapshot)
  })

  it("returns a fresh array, not the input reference", () => {
    const units = [1, 2, 3]
    const { visibles } = outscape(units, 100, 100, 1)
    expect(visibles).not.toBe(units as unknown as boolean[])
  })

  it("preserves input order (does not sort)", () => {
    // 50 is visible, 1 is not -> flags follow the unsorted input
    expect(outscape([50, 1, 50, 1], 100, 100, 10).visibles).toStrictEqual([
      true,
      false,
      true,
      false,
    ])
  })

  it("is monotonic: for ascending units, visibility never turns back off", () => {
    const ascending = [1, 5, 10, 30, 60, 120]
    const { visibles } = ascending
      ? outscape(ascending, 480, 1000, 10)
      : { visibles: [] }
    const firstVisible = visibles.indexOf(true)
    if (firstVisible !== -1) {
      expect(visibles.slice(firstVisible).every(Boolean)).toBe(true)
    }
  })

  it("matches the closed-form threshold v > viewMinWidth * range / viewWidth", () => {
    const units = [1, 4, 7, 12, 40, 99]
    const range = 240
    const viewWidth = 600
    const viewMinWidth = 10
    const threshold = (viewMinWidth * range) / viewWidth
    const expected = units.map((v) => v > threshold)
    expect(
      outscape(units, range, viewWidth, viewMinWidth).visibles
    ).toStrictEqual(expected)
  })
})

describe("outscape (threshold table)", () => {
  // range 100, viewWidth 100 -> rate 1, so a unit is visible iff unit > viewMinWidth
  it.each([
    { unit: 9, viewMinWidth: 10, visible: false },
    { unit: 10, viewMinWidth: 10, visible: false },
    { unit: 11, viewMinWidth: 10, visible: true },
    { unit: 1, viewMinWidth: 0, visible: true },
    { unit: 0, viewMinWidth: 0, visible: false },
  ])("unit=$unit viewMinWidth=$viewMinWidth -> $visible", ({
    unit,
    viewMinWidth,
    visible,
  }) => {
    expect(outscape([unit], 100, 100, viewMinWidth).visibles).toStrictEqual([
      visible,
    ])
  })
})
