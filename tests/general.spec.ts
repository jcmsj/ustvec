// sum.test.js
import { expect, test } from 'vitest'
import { sum } from './sum'

test('Accepts or Rejects based on Reasons', () => {
  expect(sum(1, 2)).toBe(3)
})
