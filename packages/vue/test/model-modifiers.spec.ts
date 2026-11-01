import { describe, expect, it } from 'vitest'

import { toEmptyModelValue } from '@/utils/modelModifiers'

describe('toEmptyModelValue', () => {
  it('nullable turns empty text, whitespace-only text and undefined into null', () => {
    expect(toEmptyModelValue('', { nullable: true })).toBeNull()
    expect(toEmptyModelValue('   ', { nullable: true })).toBeNull()
    expect(toEmptyModelValue(undefined, { nullable: true })).toBeNull()
  })

  it('optional turns empty text, whitespace-only text and null into undefined', () => {
    expect(toEmptyModelValue('', { optional: true })).toBeUndefined()
    expect(toEmptyModelValue('   ', { optional: true })).toBeUndefined()
    expect(toEmptyModelValue(null, { optional: true })).toBeUndefined()
  })

  it('nullable takes precedence over optional', () => {
    expect(toEmptyModelValue('', { nullable: true, optional: true })).toBeNull()
  })

  it('passes non-empty values through, including 0 and text with surrounding whitespace', () => {
    expect(toEmptyModelValue(0, { nullable: true })).toBe(0)
    expect(toEmptyModelValue(' Ada ', { nullable: true })).toBe(' Ada ')
  })

  it('keeps an empty value as it is without nullable or optional', () => {
    expect(toEmptyModelValue('', {})).toBe('')
    expect(toEmptyModelValue('  ', { trim: true })).toBe('  ')
  })
})
