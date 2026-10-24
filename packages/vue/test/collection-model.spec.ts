import type { ListBoxEntry, ListBoxItem } from '@/components/list-box/ListBox.vue'
import type { CollectionModelOptions, CollectionValue } from '@/components/list-box/useCollectionModel'
import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useCollectionModel } from '@/components/list-box/useCollectionModel'

const items: ListBoxEntry[] = [
  { value: 'a', label: 'Apple' },
  { type: 'section', label: 'More', items: [{ value: 'b', label: 'Banana', textValue: 'Yellow banana' }] },
  { type: 'separator' },
  { value: 3 },
]

type Setup = Partial<Omit<CollectionModelOptions<ListBoxItem>, 'model' | 'isMultiple'>> & {
  model?: CollectionValue
  isMultiple?: boolean
}

// A bound `v-model` starts with a value; an unbound one stays `undefined`
const setup = ({ model: initial, isMultiple = false, ...rest }: Setup = {}) => {
  const model = ref<CollectionValue | undefined>(initial)
  const collection = useCollectionModel({
    items: () => items,
    defaultValue: () => undefined,
    placeholder: () => 'Pick one',
    model,
    isMultiple: () => isMultiple,
    ...rest,
  })
  return { model, collection }
}

describe('useCollectionModel', () => {
  it('flattens sections and drops separators', () => {
    const { collection } = setup()
    expect(collection.options.value.map((item) => item.value)).toEqual(['a', 'b', 3])
    expect(collection.itemByValue.value.get('b')?.label).toBe('Banana')
  })

  it('shows the placeholder while nothing is selected', () => {
    const { collection } = setup()
    expect(collection.selection.value).toBeNull()
    expect(collection.selectedItems.value).toEqual([])
    expect(collection.isPlaceholder.value).toBe(true)
    expect(collection.valueText.value).toBe('Pick one')
  })

  it('falls back to an empty text without a placeholder', () => {
    const { collection } = setup({ placeholder: () => undefined })
    expect(collection.valueText.value).toBe('')
  })

  it('reads a single selection with its option text', () => {
    const { collection } = setup({ model: 'b' })
    expect(collection.selectedKey.value).toBe('b')
    expect(collection.selectedValues.value).toEqual(['b'])
    expect(collection.isPlaceholder.value).toBe(false)
    expect(collection.valueText.value).toBe('Yellow banana')
    expect(collection.isSelected('b')).toBe(true)
    expect(collection.isSelected('a')).toBe(false)
  })

  it('uses the stringified value as the text of an unlabeled option', () => {
    const { collection } = setup({ model: 3 })
    expect(collection.valueText.value).toBe('3')
  })

  it('formats a multiple selection as a list in selection order by default', () => {
    const { collection } = setup({ isMultiple: true, model: [3, 'a'] })
    expect(collection.selectedKey.value).toBeNull()
    expect(collection.selectedItems.value.map((item) => item.value)).toEqual([3, 'a'])
    expect(collection.valueText.value).toBe(
      new Intl.ListFormat(undefined, { type: 'conjunction' }).format(['3', 'Apple']),
    )
  })

  it('orders a multiple selection by the collection when asked', () => {
    const { collection } = setup({ isMultiple: true, model: [3, 'a'], order: 'collection' })
    expect(collection.selectedItems.value.map((item) => item.value)).toEqual(['a', 3])
  })

  it('skips selected values without an option and is a placeholder when none has one', () => {
    const { collection } = setup({ isMultiple: true, model: ['missing', 'a'] })
    expect(collection.selectedItems.value.map((item) => item.value)).toEqual(['a'])

    const { collection: missing } = setup({ model: 'missing' })
    expect(missing.selectedKey.value).toBe('missing')
    expect(missing.selectedItems.value).toEqual([])
    expect(missing.isPlaceholder.value).toBe(true)
    expect(missing.valueText.value).toBe('Pick one')
  })

  it('resolves option text by value, empty for null or a missing value', () => {
    const { collection } = setup()
    expect(collection.resolveItemText('a')).toBe('Apple')
    expect(collection.resolveItemText(null)).toBe('')
    expect(collection.resolveItemText('missing')).toBe('')
  })

  it('seeds the uncontrolled selection from defaultValue and keeps writes local', () => {
    const { model, collection } = setup({ defaultValue: () => 'a' })
    expect(collection.selection.value).toBe('a')
    collection.selection.value = 'b'
    expect(collection.selection.value).toBe('b')
    expect(model.value).toBe('b')
  })

  it('reads a bound v-model over the local selection', () => {
    const { model, collection } = setup({ model: 'a', defaultValue: () => 'b' })
    expect(collection.selection.value).toBe('a')
    model.value = 3
    expect(collection.valueText.value).toBe('3')
  })

  it('stores the empty selection of the mode when cleared or written nullish', () => {
    const single = setup({ model: 'a' })
    single.collection.clear()
    expect(single.model.value).toBeNull()

    const multiple = setup({ isMultiple: true, model: ['a'] })
    multiple.collection.selection.value = undefined
    expect(multiple.model.value).toEqual([])
  })

  it('resets to defaultValue, or the empty selection, and returns it', () => {
    const withDefault = setup({ isMultiple: true, model: ['b'], defaultValue: () => ['a'] })
    expect(withDefault.collection.reset()).toEqual(['a'])
    expect(withDefault.model.value).toEqual(['a'])

    const withoutDefault = setup({ model: 'b' })
    expect(withoutDefault.collection.reset()).toBeNull()
    expect(withoutDefault.model.value).toBeNull()
  })
})
