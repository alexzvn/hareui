// Internal: accessible names of Select's trigger, listbox and popover dialog, following RAC Select.
import { injectPopoverRootContext } from 'reka-ui'
import type { ComputedRef } from 'vue'
import { computed, defineComponent, watchEffect } from 'vue'

type SelectLabelsOptions = {
  /** The component's fallthrough attributes (`useAttrs()`). */
  attrs: Record<string, unknown>
  /** Id of the trigger button. */
  id: ComputedRef<string>
  /** Id of the field label. */
  labelId: ComputedRef<string>
  /** Whether the field renders a label. */
  hasLabel: ComputedRef<boolean>
}

export const useSelectLabels = ({ attrs, id, labelId, hasLabel }: SelectLabelsOptions) => {
  const valueId = computed(() => `${id.value}-value`)

  // `aria-labelledby` overrides `aria-label`, so an `aria-label`-only trigger references itself to keep that
  // name (as RAC does)
  const triggerLabelledBy = computed(() => {
    const ariaLabelledBy = attrs['aria-labelledby'] as string | undefined
    const isAriaLabelOnly = !!attrs['aria-label'] && !ariaLabelledBy && !hasLabel.value

    return [
      ariaLabelledBy,
      hasLabel.value ? labelId.value : undefined,
      isAriaLabelOnly ? id.value : undefined,
      valueId.value,
    ]
      .filter(Boolean)
      .join(' ')
  })

  const listLabelledBy = computed(
    () =>
      (attrs['aria-labelledby'] as string | undefined) ??
      (hasLabel.value ? labelId.value : undefined),
  )

  // RAC names the popover dialog like the listbox (or after an `aria-label`-only trigger). Reka labels its content
  // with its own trigger id, which the trigger's `id` replaces, so point that id at the label instead (set before
  // the trigger's setup, which only fills it when empty)
  const popoverLabelledBy = computed(() => listLabelledBy.value ?? id.value)

  const PopoverLabel = defineComponent({
    setup() {
      const popover = injectPopoverRootContext()

      watchEffect(() => {
        popover.triggerId = popoverLabelledBy.value
      })

      return () => null
    },
  })

  // Bound after the root's `data-slot`, so a wrapping component (CellSelect, InlineSelect) can rename the root
  const rootAttrs = computed(() => {
    const { 'aria-label': _label, 'aria-labelledby': _labelledby, ...rest } = attrs
    return rest
  })

  return { valueId, triggerLabelledBy, listLabelledBy, PopoverLabel, rootAttrs }
}
