import { describe, expect, it, vi } from 'vitest'
import { computed, ref } from 'vue'

import type { ListBoxValue } from '@/components/list-box/ListBox.types'
import { splitInputAttrs } from '@/components/text-field/context'
import { isFocusListener, splitFocusListeners, withChangeEvent } from '@/utils/formControlEvents'

type Selection = ListBoxValue | ListBoxValue[] | null

const createSelection = (initial: Selection) => {
  const model = ref<Selection>(initial)
  const source = computed<Selection, Selection | undefined>({
    get: () => model.value,
    set: (value) => {
      model.value = value ?? null
    },
  })

  const onChange = vi.fn<(event: Event) => void>()

  return { source, onChange, selection: withChangeEvent(source, onChange) }
}

describe('withChangeEvent', () => {
  it('writes through and calls onChange with a change Event when the selection changes', () => {
    const { source, onChange, selection } = createSelection('cat')
    selection.value = 'dog'
    expect(source.value).toBe('dog')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0]![0].type).toBe('change')
  })

  it('skips onChange for a write of the same value', () => {
    const { onChange, selection } = createSelection('cat')
    selection.value = 'cat'
    expect(onChange).not.toHaveBeenCalled()
  })

  it('skips onChange for an array with the same items', () => {
    const { onChange, selection } = createSelection(['cat', 'dog'])
    selection.value = ['cat', 'dog']
    expect(onChange).not.toHaveBeenCalled()
  })

  it('treats null and an empty array as the same empty selection', () => {
    const { onChange, selection } = createSelection(null)
    selection.value = []
    selection.value = null
    expect(onChange).not.toHaveBeenCalled()
  })

  it('skips onChange for writes made on the source, such as a form reset', () => {
    const { source, onChange, selection } = createSelection('cat')
    source.value = 'dog'
    expect(selection.value).toBe('dog')
    expect(onChange).not.toHaveBeenCalled()
  })
})

describe('isFocusListener', () => {
  it('matches @focus / @blur listeners with any modifier, in any case', () => {
    const keys = [
      'onFocus',
      'onBlur',
      'onfocus',
      'onFocusOnce',
      'onBlurCapture',
      'onFocusOncePassive',
    ]

    expect(keys.filter(isFocusListener)).toEqual(keys)
  })

  it('does not match focusin / focusout or other listeners', () => {
    expect(['onFocusin', 'onFocusout', 'onInput', 'focus'].filter(isFocusListener)).toEqual([])
  })
})

describe('splitFocusListeners', () => {
  it('moves @focus / @blur listeners out of the rest', () => {
    const onFocusOnce = () => {}
    const onClick = () => {}
    expect(splitFocusListeners({ onFocusOnce, onClick, id: 'x' })).toEqual({
      focus: { onFocusOnce },
      rest: { onClick, id: 'x' },
    })
  })
})

describe('splitInputAttrs', () => {
  it('sends @focus / @blur listeners with modifiers to the input, like splitFocusListeners', () => {
    const onFocusOnce = () => {}
    const onBlurCapture = () => {}
    const { input, root } = splitInputAttrs({ onFocusOnce, onBlurCapture, class: 'field' })
    expect(input).toEqual({ onFocusOnce, onBlurCapture })
    expect(root).toEqual({ class: 'field' })
  })
})
