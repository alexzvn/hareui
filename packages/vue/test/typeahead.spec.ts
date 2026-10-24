import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'

import type { TypeaheadOptions } from '../src/components/list-box/useTypeahead'
import { useTypeahead } from '../src/components/list-box/useTypeahead'

interface Item {
  label: string
  disabled?: boolean
}
const item = (label: string, disabled?: boolean): Item => ({ label, disabled })

// A list whose current item follows the typeahead, as the Select trigger and ListBox use it
function setup(options: TypeaheadOptions, items: Item[], initial?: Item) {
  const scope = effectScope()
  const typeahead = scope.run(() => useTypeahead(options))!
  let current = initial
  const select = vi.fn((match: Item) => {
    current = match
  })
  const type = (key: string, init: KeyboardEventInit = {}) =>
    typeahead.onKeydown(
      new KeyboardEvent('keydown', { key, ...init }),
      () => ({
        items,
        text: (i) => i.label,
        disabled: (i) => !!i.disabled,
        isCurrent: (i) => i === current,
      }),
      select,
    )
  return { type, select, scope, current: () => current }
}

beforeEach(() => {
  vi.useFakeTimers()
})
afterEach(() => {
  vi.useRealTimers()
})

describe('useTypeahead start rule', () => {
  const alpha = item('Alpha')
  const bravo1 = item('Bravo one')
  const bravo2 = item('Bravo two')
  const charlie = item('Charlie')
  const items = [alpha, bravo1, bravo2, charlie]

  it('`current` searches from the current item inclusive, so a repeated character stays put', () => {
    const t = setup({ start: 'current' }, items, bravo1)
    expect(t.type('b')).toBe(true)
    expect(t.current()).toBe(bravo1)
    vi.advanceTimersByTime(1000)
    t.type('b')
    expect(t.current()).toBe(bravo1)
  })

  it('`next` searches after the current item, so a repeated character cycles and wraps', () => {
    const t = setup({ start: 'next' }, items, bravo1)
    t.type('b')
    expect(t.current()).toBe(bravo2)
    vi.advanceTimersByTime(1000)
    t.type('b')
    expect(t.current()).toBe(bravo1)
  })

  it('wraps to the top when nothing after the start matches', () => {
    const t = setup({ start: 'current' }, items, charlie)
    t.type('a')
    expect(t.current()).toBe(alpha)
  })

  it('searches from the top without a current item', () => {
    for (const start of ['current', 'next'] as const) {
      const t = setup({ start }, items)
      t.type('b')
      expect(t.current()).toBe(bravo1)
    }
  })

  it('`next` restarts a multi-character search at the top; `current` keeps the current item', () => {
    const abc = item('Abc')
    const abd = item('Abd')
    const abc2 = item('Abc 2')
    const list = [abc, abd, abc2]

    const next = setup({ start: 'next' }, list, abd)
    next.type('a')
    expect(next.current()).toBe(abc2)
    next.type('b')
    expect(next.current()).toBe(abc)

    const inclusive = setup({ start: 'current' }, list, abd)
    inclusive.type('a')
    expect(inclusive.current()).toBe(abd)
    inclusive.type('b')
    expect(inclusive.current()).toBe(abd)
  })
})

describe('useTypeahead buffer', () => {
  const alpha = item('Alpha')
  const bravo = item('Bravo')
  const bonus = item('Bonus')
  const items = [alpha, bravo, bonus]

  it('accumulates characters typed within 1000 ms, case-insensitively', () => {
    const t = setup({ start: 'current' }, items)
    t.type('B', { shiftKey: true })
    expect(t.current()).toBe(bravo)
    vi.advanceTimersByTime(999)
    t.type('O', { shiftKey: true })
    expect(t.current()).toBe(bonus)
  })

  it('resets 1000 ms after the last key', () => {
    const t = setup({ start: 'current' }, items)
    t.type('b')
    vi.advanceTimersByTime(600)
    t.type('o')
    vi.advanceTimersByTime(600) // 1200 ms after the first key, but the second restarted the timer
    t.type('a') // "boa": no match; a reset buffer would have found Alpha
    expect(t.current()).toBe(bonus)
    vi.advanceTimersByTime(1000)
    t.type('a')
    expect(t.current()).toBe(alpha)
  })

  it('no match leaves the current item alone but still consumes the key and extends the buffer', () => {
    const t = setup({ start: 'current' }, items, bravo)
    expect(t.type('x')).toBe(true)
    expect(t.select).not.toHaveBeenCalled()
    expect(t.current()).toBe(bravo)
    // "xa" still matches nothing: the buffer was kept
    t.type('a')
    expect(t.select).not.toHaveBeenCalled()
  })

  it('clears the reset timer when its scope is disposed', () => {
    const t = setup({ start: 'current' }, items)
    t.type('a')
    expect(vi.getTimerCount()).toBe(1)
    t.scope.stop()
    expect(vi.getTimerCount()).toBe(0)
  })
})

describe('useTypeahead items', () => {
  it('never matches disabled items', () => {
    const bingo = item('Bingo')
    const t = setup({ start: 'current' }, [item('Alpha'), item('Beta', true), bingo])
    t.type('b')
    expect(t.current()).toBe(bingo)
  })

  it('a disabled current item does not anchor the search', () => {
    const bingo = item('Bingo')
    const beta = item('Beta', true)
    const t = setup({ start: 'next' }, [bingo, beta, item('Bongo')], beta)
    t.type('b')
    expect(t.current()).toBe(bingo)
  })

  it('finds nothing in an empty list', () => {
    const t = setup({ start: 'next' }, [])
    expect(t.type('a')).toBe(true)
    expect(t.select).not.toHaveBeenCalled()
  })
})

describe('useTypeahead keys', () => {
  const newark = item('Newark')
  const newYork = item('New York')
  const items = [newark, newYork]

  it('ignores ctrl / meta / alt combinations and named keys, leaving the buffer untouched', () => {
    const t = setup({ start: 'current' }, items)
    for (const init of [{ ctrlKey: true }, { metaKey: true }, { altKey: true }])
      expect(t.type('n', init)).toBe(false)
    for (const key of ['ArrowDown', 'Enter', 'Shift', 'Backspace', 'F1'])
      expect(t.type(key)).toBe(false)
    expect(t.select).not.toHaveBeenCalled()
    // Nothing was buffered, otherwise this would search "nnnn"
    t.type('n')
    expect(t.current()).toBe(newark)
  })

  it('accepts a single astral character', () => {
    const t = setup({ start: 'current' }, [item('😀 smile')])
    expect(t.type('😀')).toBe(true)
    expect(t.select).toHaveBeenCalledOnce()
  })

  it('with `space`, Space extends a search in progress but never starts one', () => {
    const t = setup({ start: 'current', space: true }, items)
    expect(t.type(' ')).toBe(false)
    for (const key of 'new') t.type(key)
    expect(t.current()).toBe(newark)
    expect(t.type(' ')).toBe(true)
    expect(t.current()).toBe(newYork)
    vi.advanceTimersByTime(1000)
    expect(t.type(' ')).toBe(false)
  })

  it('without `space`, Space is never a typeahead key', () => {
    const t = setup({ start: 'current' }, items)
    for (const key of 'new') t.type(key)
    expect(t.type(' ')).toBe(false)
    // The buffer is still "new": "y" makes "newy", which matches nothing
    t.type('y')
    expect(t.current()).toBe(newark)
  })
})
