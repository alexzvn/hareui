import type { Ref } from 'vue'
import { computed } from 'vue'

/** What `useAutocompleteAria` reads from the component. */
export type AutocompleteAriaOptions = {
  /** Id of the trigger button; the other ids derive from it. */
  id: Readonly<Ref<string>>
  labelId: Readonly<Ref<string>>
  hasLabel: Readonly<Ref<boolean>>
  /** Fallthrough attrs; `aria-label` / `aria-labelledby` name the field instead of landing on the root. */
  attrs: Record<string, unknown>
}

const joinIds = (ids: (string | undefined)[]) => ids.filter(Boolean).join(' ')

/** Element ids and the `aria-labelledby` of the trigger, popover and listbox. */
export const useAutocompleteAria = (options: AutocompleteAriaOptions) => {
  const { id, labelId, hasLabel, attrs } = options

  const valueId = computed(() => `${id.value}-value`)
  const listboxId = computed(() => `${id.value}-listbox`)
  const searchId = computed(() => `${id.value}-search`)

  const ariaLabel = () => attrs['aria-label'] as string | undefined

  // RAC useSelect: the label (then any `aria-labelledby`) names the field; a bare `aria-label` on the trigger is
  // referenced by the trigger's own id, so it still counts next to the value
  const fieldLabelledBy = computed(() => {
    const fieldLabelId = hasLabel.value ? labelId.value : undefined

    return joinIds([fieldLabelId, attrs['aria-labelledby'] as string | undefined]) || undefined
  })

  const selfLabelledBy = computed(() =>
    ariaLabel() && !fieldLabelledBy.value ? id.value : undefined,
  )

  const buttonLabelledBy = computed(() =>
    joinIds([valueId.value, fieldLabelledBy.value, selfLabelledBy.value]),
  )

  const popupLabelledBy = computed(() => fieldLabelledBy.value ?? selfLabelledBy.value)
  const listLabelledBy = computed(() => joinIds([listboxId.value, popupLabelledBy.value]))

  const rootAttrs = computed(() => {
    const { 'aria-label': _label, 'aria-labelledby': _labelledby, ...rest } = attrs

    return rest
  })

  return {
    valueId,
    listboxId,
    searchId,
    ariaLabel,
    buttonLabelledBy,
    popupLabelledBy,
    listLabelledBy,
    rootAttrs,
  }
}
