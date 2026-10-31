import { describe, expect, it } from 'vitest'

import { resolveCloseButton } from '@/utils/closeButton'

describe('resolveCloseButton', () => {
  it('yields no options for true, false and undefined', () => {
    expect(resolveCloseButton(true)).toEqual({})
    expect(resolveCloseButton(false)).toEqual({})
    expect(resolveCloseButton(undefined)).toEqual({})
  })

  it('yields the options object as given', () => {
    const options = { label: 'Dismiss', icon: 'i-lucide-x' }

    expect(resolveCloseButton(options)).toBe(options)
  })
})
