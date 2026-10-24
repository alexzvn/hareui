import { computed, ref } from 'vue'

export type ExpandedValue = string | number

/**
 * Expanded-items state shared by Accordion and DisclosureGroup (React Aria's `DisclosureGroup`
 * state): controlled through `modelValue`, uncontrolled from `defaultValue`. Without `multiple`,
 * expanding an item collapses the others.
 */
export const useExpandedValues = (
  props: { modelValue?: ExpandedValue[]; defaultValue?: ExpandedValue[]; multiple?: boolean },
  emit: (value: ExpandedValue[]) => void,
) => {
  const uncontrolled = ref<ExpandedValue[]>([...(props.defaultValue ?? [])])
  const expanded = computed(() => props.modelValue ?? uncontrolled.value)

  const isExpanded = (value: ExpandedValue) => expanded.value.includes(value)
  const setExpanded = (value: ExpandedValue, open: boolean) => {
    if (open === isExpanded(value)) return

    const next = open
      ? props.multiple
        ? [...expanded.value, value]
        : [value]
      : expanded.value.filter((v) => v !== value)

    uncontrolled.value = next
    emit(next)
  }

  return { expanded, isExpanded, setExpanded }
}
