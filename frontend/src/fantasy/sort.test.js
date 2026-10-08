import { describe, expect, it } from 'vitest'
import { sortRows } from './sort'

const rows = [
  { name: 'Casey', gap: null },
  { name: 'avery', gap: 2 },
  { name: 'Blake', gap: -1 },
]
const names = (sorted) => sorted.map((row) => row.name)

describe('Sorting the board', () => {
  it('sorts numbers either way and keeps missing values last both times', () => {
    expect(names(sortRows(rows, 'gap', 1))).toEqual(['Blake', 'avery', 'Casey'])
    expect(names(sortRows(rows, 'gap', -1))).toEqual(['avery', 'Blake', 'Casey'])
  })

  it('sorts text alphabetically, ignoring case', () => {
    expect(names(sortRows(rows, 'name', 1))).toEqual(['avery', 'Blake', 'Casey'])
    expect(names(sortRows(rows, 'name', -1))).toEqual(['Casey', 'Blake', 'avery'])
  })

  it('leaves the rows it was given untouched', () => {
    sortRows(rows, 'gap', 1)

    expect(names(rows)).toEqual(['Casey', 'avery', 'Blake'])
  })
})
