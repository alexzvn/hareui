import { computed, ref } from 'vue'

type ActiveValue = string | number

type UseActiveIndexOptions<T> = {
  /** The items the value points into. */
  items: () => T[]
  /** The item key read as each item's value. */
  valueKey: () => string
  /** The controlled value, `undefined` when uncontrolled. */
  modelValue: () => ActiveValue | undefined
  /** The value when uncontrolled, read once. */
  defaultValue?: ActiveValue
  /** Whether a numeric index counts from the last item. */
  reverse?: () => boolean
}

/**
 * The active item of a list driven by `v-model` / `defaultValue`. An item value wins; a number no item has is
 * an index, so `items.length` points past the last item. `-1` when there is no value or no item matches it.
 */
export const useActiveIndex = <T extends object>({
  items,
  valueKey,
  modelValue,
  defaultValue,
  reverse = () => false,
}: UseActiveIndexOptions<T>) => {
  const uncontrolled = ref(defaultValue)
  const activeValue = computed(() => modelValue() ?? uncontrolled.value)

  const getValue = (item: T) =>
    (item as Record<string, unknown>)[valueKey()] as ActiveValue | undefined

  const activeIndex = computed(() => {
    const value = activeValue.value
    if (value === undefined) return -1

    const list = items()
    const index = list.findIndex((item) => getValue(item) === value)
    if (index !== -1 || typeof value === 'string') return index

    return reverse() ? list.length - 1 - value : value
  })

  /** Moves the uncontrolled state to an item and returns the value to emit: its value, else its index. */
  const setActiveIndex = (index: number): ActiveValue => {
    const list = items()
    const item = list[index]
    const value = (item && getValue(item)) ?? (reverse() ? list.length - 1 - index : index)
    uncontrolled.value = value

    return value
  }

  return { activeValue, activeIndex, setActiveIndex }
}
