import { describe, expect, it, vi } from 'vitest'

import type {
  ListViewItem,
  ListViewProps,
  ListViewValue,
} from '@/components/list-view/ListView.types'
import type {
  ListViewSelectionMode,
  SelectionModifiers,
} from '@/components/list-view/useListViewSelection'
import { useListViewSelection } from '@/components/list-view/useListViewSelection'

const files: ListViewItem[] = [
  { value: 'docs', label: 'Documents' },
  { value: 'photos', label: 'Photos' },
  { value: 'archive', label: 'Archive.zip', disabled: true },
  { value: 'readme', label: 'README.md' },
  { value: 'pkg', label: 'package.json' },
]

const plain: SelectionModifiers = { shiftKey: false, ctrlKey: false, metaKey: false }
const shift: SelectionModifiers = { ...plain, shiftKey: true }
const ctrl: SelectionModifiers = { ...plain, ctrlKey: true }
const meta: SelectionModifiers = { ...plain, metaKey: true }

type SetupOptions = {
  mode?: ListViewSelectionMode
  props?: Partial<Pick<ListViewProps, 'selectionBehavior' | 'modelValue' | 'defaultValue'>>
}

const setup = ({ mode = 'multiple', props = {} }: SetupOptions = {}) => {
  const onUpdate = vi.fn<(value: ListViewValue | ListViewValue[] | null) => void>()

  const selection = useListViewSelection({
    props: { selectionBehavior: 'toggle', ...props },
    mode: () => mode,
    items: () => files,
    onUpdate,
  })

  return { selection, onUpdate }
}

describe('useListViewSelection', () => {
  it('starts from defaultValue', () => {
    const { selection } = setup({ props: { defaultValue: ['photos'] } })

    expect(selection.selectedValues.value).toEqual(['photos'])
    expect(selection.isSelected('photos')).toBe(true)
    expect(selection.isSelected('docs')).toBe(false)
  })

  it('reads a controlled modelValue instead of its own state', () => {
    const { selection, onUpdate } = setup({ props: { modelValue: ['docs'] } })

    selection.select('photos', plain)

    expect(onUpdate).toHaveBeenLastCalledWith(['docs', 'photos'])
    expect(selection.selectedValues.value).toEqual(['docs'])
  })

  it('selects nothing in mode none', () => {
    const { selection, onUpdate } = setup({ mode: 'none' })

    selection.select('docs', plain)
    selection.onFocusMove({ to: 'photos', from: 'docs', modifiers: shift })

    expect(onUpdate).not.toHaveBeenCalled()
    expect(selection.isSelectable.value).toBe(false)
  })

  it('single mode selects the row alone, then clears it', () => {
    const { selection, onUpdate } = setup({ mode: 'single' })

    selection.select('docs', plain)
    expect(onUpdate).toHaveBeenLastCalledWith('docs')

    selection.select('photos', ctrl)
    expect(onUpdate).toHaveBeenLastCalledWith('photos')

    selection.select('photos', plain)
    expect(onUpdate).toHaveBeenLastCalledWith(null)
  })

  it('toggle behaviour adds and removes rows without modifiers', () => {
    const { selection, onUpdate } = setup()

    selection.select('docs', plain)
    selection.select('readme', plain)
    expect(onUpdate).toHaveBeenLastCalledWith(['docs', 'readme'])

    selection.select('docs', plain)
    expect(onUpdate).toHaveBeenLastCalledWith(['readme'])
  })

  it('Shift extends a range from the anchor over enabled rows only', () => {
    const { selection, onUpdate } = setup()

    selection.select('docs', plain)
    selection.select('readme', shift)

    expect(onUpdate).toHaveBeenLastCalledWith(['docs', 'photos', 'readme'])
  })

  it('replace behaviour selects the row alone and Ctrl or Cmd toggles it', () => {
    const { selection, onUpdate } = setup({ props: { selectionBehavior: 'replace' } })

    selection.select('docs', plain)
    selection.select('photos', plain)
    expect(onUpdate).toHaveBeenLastCalledWith(['photos'])

    selection.select('readme', ctrl)
    expect(onUpdate).toHaveBeenLastCalledWith(['photos', 'readme'])

    selection.select('photos', meta)
    expect(onUpdate).toHaveBeenLastCalledWith(['readme'])
  })

  it('replace behaviour: Shift extends from the row selected alone', () => {
    const { selection, onUpdate } = setup({ props: { selectionBehavior: 'replace' } })

    selection.select('pkg', plain)
    selection.select('photos', shift)

    expect(onUpdate).toHaveBeenLastCalledWith(['photos', 'readme', 'pkg'])
  })

  it('replace behaviour: the selection follows focus unless Ctrl or Cmd is held', () => {
    const { selection, onUpdate } = setup({ props: { selectionBehavior: 'replace' } })

    selection.onFocusMove({ to: 'photos', from: 'docs', modifiers: plain })
    expect(onUpdate).toHaveBeenLastCalledWith(['photos'])

    selection.onFocusMove({ to: 'readme', from: 'photos', modifiers: ctrl })
    expect(onUpdate).toHaveBeenCalledTimes(1)
  })

  it('toggle behaviour: moving focus keeps the selection, Shift extends it', () => {
    const { selection, onUpdate } = setup()

    selection.onFocusMove({ to: 'photos', from: 'docs', modifiers: plain })
    expect(onUpdate).not.toHaveBeenCalled()

    selection.onFocusMove({ to: 'photos', from: 'docs', modifiers: shift })
    expect(onUpdate).toHaveBeenLastCalledWith(['docs', 'photos'])
  })
})
