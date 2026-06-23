import { bench, describe } from "vitest"
import { outscape } from "../src/index.js"

const min = 60 * 1000
const hour = 60 * min
const day = 24 * hour

const small = [min, 5 * min, 10 * min, 30 * min, hour]
const large = Array.from({ length: 1000 }, (_, i) => (i + 1) * min)

describe("outscape", () => {
  bench("5 units", () => {
    outscape(small, 8 * hour, 1000, 10)
  })

  bench("1000 units", () => {
    outscape(large, day, 1200, 8)
  })
})
