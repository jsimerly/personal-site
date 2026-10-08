import { describe, expect, it } from 'vitest'
import { backendName, number, percent, signed } from './format'

describe('Fantasy number formats', () => {
  it('shows numbers to a fixed number of places, with thousands separators', () => {
    expect(number(6.469, 2)).toBe('6.47')
    expect(number(1234.5)).toBe('1,235')
    expect(number(0, 1)).toBe('0.0')
  })

  it('shows a missing value as an en dash', () => {
    expect([number(null), number(undefined), signed(null), percent(null)]).toEqual(['–', '–', '–', '–'])
  })

  it('signs a number with a plus or a true minus, and leaves zero bare', () => {
    expect([signed(3), signed(-3), signed(0), signed(-0.004, 2), signed(13.451, 1)]).toEqual(['+3', '−3', '0', '0.00', '+13.5'])
  })

  it('shows a share as a signed whole percent', () => {
    expect([percent(0.047), percent(-0.302), percent(0), percent(1.4)]).toEqual(['+5%', '−30%', '0%', '+140%'])
  })

  it('names the career model for people', () => {
    expect(backendName('tabpfn(model_version=v2)')).toBe('TabPFN v2')
    expect(backendName('tabpfn')).toBe('TabPFN')
    expect(backendName('xgb')).toBe('gradient-boosted trees')
    expect(backendName(null)).toBe('gradient-boosted trees')
    expect(backendName('blend(xgb,tabpfn)')).toBe('trees and TabPFN, blended')
    expect(backendName('mystery')).toBe('mystery')
  })
})
