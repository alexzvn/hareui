<template>
  <ComboboxRoot
    v-bind="rootAttrs"
    as="div"
    data-slot="combo-box"
    :model-value="rekaValue as any"
    :multiple="isMultiple"
    :disabled="disabled"
    :open="isOpen"
    ignore-filter
    :highlight-on-hover="false"
    :reset-search-term-on-blur="false"
    :reset-search-term-on-select="false"
    :data-focused="isFocused ? 'true' : undefined"
    :data-open="isOpen ? 'true' : undefined"
    :data-disabled="disabled ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :class="ui.base()"
    @update:model-value="onRekaValue"
    @update:open="onRekaOpen"
  >
    <RekaBridge @ready="onReady" />
    <FieldLabel :id="labelId" :for="id" :class="ui.label()" />
    <ComboboxAnchor
      as="div"
      role="group"
      data-slot="combo-box-input-group"
      :data-disabled="disabled ? 'true' : undefined"
      :data-invalid="invalid ? 'true' : undefined"
      :data-focus-within="isFocused ? 'true' : undefined"
      :data-focus-visible="isFocusVisible ? 'true' : undefined"
      :class="ui.inputGroup()"
    >
      <input
        :id="id"
        ref="input"
        type="text"
        role="combobox"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        aria-autocomplete="list"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="isOpen ? listboxId : undefined"
        :aria-activedescendant="isOpen && highlighted ? highlighted.id : undefined"
        :aria-label="attrs['aria-label'] as string | undefined"
        :aria-labelledby="inputLabelledBy"
        :aria-describedby="describedBy"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-required="required && !isNativeRequired ? 'true' : undefined"
        :value="inputValue"
        :placeholder="placeholder"
        :name="shouldSubmitText ? name : undefined"
        :disabled="disabled || undefined"
        :readonly="readonly || undefined"
        :required="isNativeRequired || undefined"
        data-slot="input"
        :data-invalid="invalid ? 'true' : undefined"
        :data-disabled="disabled ? 'true' : undefined"
        :data-focused="isFocused ? 'true' : undefined"
        :data-focus-visible="isFocusVisible ? 'true' : undefined"
        :class="inputUi.base()"
        @input="onInput"
        @keydown="onKeydown"
        @focus="onFocus"
        @blur="onBlur"
      />
      <button
        :id="triggerId"
        type="button"
        tabindex="-1"
        data-slot="combo-box-trigger"
        aria-label="Show suggestions"
        :aria-labelledby="hasLabel ? `${triggerId} ${labelId}` : undefined"
        aria-haspopup="listbox"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="isOpen ? listboxId : undefined"
        :disabled="disabled || readonly || undefined"
        :data-disabled="disabled || readonly ? 'true' : undefined"
        :data-open="isOpen ? 'true' : undefined"
        :data-pressed="isOpen ? 'true' : undefined"
        :data-hovered="isTriggerHovered ? 'true' : undefined"
        :class="ui.trigger()"
        @pointerdown="onTriggerPointerdown"
        @click="onTriggerClick"
        @pointerenter="isTriggerHovered = $event.pointerType === 'mouse'"
        @pointerleave="isTriggerHovered = false"
      >
        <slot name="indicator" :open="isOpen">
          <svg
            aria-hidden="true"
            data-slot="combo-box-trigger-default-icon"
            fill="none"
            height="16"
            role="presentation"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06"
              fill="currentColor"
              fill-rule="evenodd"
            />
          </svg>
        </slot>
      </button>
    </ComboboxAnchor>
    <div
      v-if="shouldShowValue"
      :id="valueId"
      data-slot="combo-box-value"
      :data-placeholder="isPlaceholder ? 'true' : undefined"
      :class="ui.value()"
    >
      <slot
        name="value"
        :selected-items="selectedItems"
        :is-placeholder="isPlaceholder"
        :text="valueText"
        >{{ valueText }}</slot
      >
    </div>
    <FieldDescription />
    <FieldError />
    <template v-if="name && !shouldSubmitText">
      <input
        v-for="(value, i) in hiddenValues"
        :key="i"
        type="hidden"
        :name="name"
        :value="value"
      />
    </template>
    <ComboboxPortal :disabled="portalTarget.disabled" :to="portalTarget.to">
      <ComboboxContent
        ref="content"
        position="popper"
        :role="undefined"
        :aria-orientation="undefined"
        :aria-multiselectable="undefined"
        :data-orientation="undefined"
        data-slot="combo-box-popover"
        side="bottom"
        align="center"
        :side-offset="8"
        :collision-padding="12"
        :class="ui.popover()"
      >
        <div
          :id="listboxId"
          role="listbox"
          aria-orientation="vertical"
          data-slot="list-box"
          data-layout="stack"
          data-orientation="vertical"
          aria-label="Suggestions"
          :aria-labelledby="hasLabel ? `${listboxId} ${labelId}` : undefined"
          :aria-multiselectable="isMultiple ? 'true' : undefined"
          :data-empty="visibleCount ? undefined : 'true'"
          :class="listBoxUi.base()"
          @mousedown.prevent
          @pointerdown="pressRelease.onPointerdown"
          @pointerup="pressRelease.onPointerup"
        >
          <ListBoxRows
            v-if="forwarded.length || slots['item-indicator']"
            :blocks="blocks"
            :selected-values="selectedValues"
            :selection-mode="selectionMode"
            :disabled="disabled"
            :classes="listBoxUi as any"
            :component="ComboboxItem"
            :virtual-focus="virtualFocus"
            :option-attrs="optionAttrs"
            :loading="loading"
            @load-more="emit('loadMore')"
          >
            <template v-for="name in forwarded" #[name]="state">
              <slot :name="name" v-bind="state as any" />
            </template>
            <template v-if="slots['item-indicator']" #indicator="state">
              <slot name="item-indicator" v-bind="state as ListBoxItemSlotProps<T>" />
            </template>
          </ListBoxRows>
          <!-- Slot-less branch: forwarded (dynamic) slots would force-update the rows on every render -->
          <ListBoxRows
            v-else
            :blocks="blocks"
            :selected-values="selectedValues"
            :selection-mode="selectionMode"
            :disabled="disabled"
            :classes="listBoxUi as any"
            :component="ComboboxItem"
            :virtual-focus="virtualFocus"
            :option-attrs="optionAttrs"
            :loading="loading"
            @load-more="emit('loadMore')"
          />
        </div>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>

<script setup lang="ts" generic="T extends ListBoxItem = ListBoxItem">
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxItem,
  ComboboxPortal,
  ComboboxRoot,
} from 'reka-ui'
import { computed, ref, useAttrs, useId, useTemplateRef } from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import inputTheme from '@/components/input/theme'
import type {
  ListBoxItem,
  ListBoxItemSlotProps,
  ListBoxValue,
} from '@/components/list-box/ListBox.types'
import ListBoxRows from '@/components/list-box/ListBoxRows.vue'
import listBoxTheme from '@/components/list-box/theme'
import { useCollectionModel } from '@/components/list-box/useCollectionModel'
import { usePressRelease } from '@/components/select/pressRelease'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'
import { usePortal } from '@/composables/usePortal'

import type {
  ComboBoxEmits,
  ComboBoxProps,
  ComboBoxSlots,
  ComboBoxValidationValue,
  ComboBoxValue,
} from './ComboBox.types'
import { RekaBridge } from './RekaBridge'
import theme from './theme'
import { useComboBoxCommit } from './useComboBoxCommit'
import { useComboBoxFilter } from './useComboBoxFilter'
import { useComboBoxHighlight } from './useComboBoxHighlight'
import { useComboBoxInputEvents } from './useComboBoxInputEvents'
import { useComboBoxInputText } from './useComboBoxInputText'
import { useComboBoxKeyboard } from './useComboBoxKeyboard'
import { useComboBoxOpenState } from './useComboBoxOpenState'

defineOptions({ inheritAttrs: false })

// Absent booleans stay `undefined`: `open` → uncontrolled, `invalid` → validation decides, `loading` → no sentinel
const props = withDefaults(defineProps<ComboBoxProps<T>>(), {
  portal: undefined,
  selectionMode: 'single',
  defaultValue: undefined,
  formValue: 'key',
  menuTrigger: 'focus',
  filter: undefined,
  open: undefined,
  invalid: undefined,
  loading: undefined,
})

const portalTarget = usePortal(() => props.portal)
const disabled = useFieldsetDisabled(() => props.disabled)
const emit = defineEmits<ComboBoxEmits>()
const slots = defineSlots<ComboBoxSlots<T>>()
const modelValue = defineModel<ComboBoxValue>()
const inputModel = defineModel<string>('inputValue')

const isMultiple = computed(() => props.selectionMode === 'multiple')
const input = useTemplateRef<HTMLInputElement>('input')
const content = useTemplateRef<{ $el: HTMLElement }>('content')

// ---- Collection and selection (`v-model` wins when bound) -------------------------------------------------------
// Selected items keep selection order, as RAC (`[...selectedKeys]`)
const {
  options,
  selection,
  selectedValues,
  selectedKey,
  selectedItems,
  valueText,
  isPlaceholder,
  resolveItemText,
  reset,
} = useCollectionModel<T>({
  items: () => props.items,
  model: modelValue,
  defaultValue: () => props.defaultValue,
  isMultiple: () => isMultiple.value,
  placeholder: () => props.valuePlaceholder,
})

const selectedText = computed(() => resolveItemText(selectedKey.value))

// ---- Input text, filtering, highlight and open state ------------------------------------------------------------
const { inputValue, resetInputValue, mirrorText } = useComboBoxInputText({
  model: inputModel,
  defaultText: () => props.defaultInputValue ?? selectedText.value,
  isMultiple: () => isMultiple.value,
  selectedKey: () => selectedKey.value,
  resolveItemText,
})

const { isShowingAll, liveBlocks, filteredCount } = useComboBoxFilter({
  props,
  items: () => props.items,
  options,
  inputValue,
})

const {
  onReady,
  highlighted,
  isKeyboardModality,
  virtualFocus,
  setHighlight,
  clearHighlightAfterReka,
  highlightOnOpen,
  navigate,
  selectHighlighted,
  itemValueOf,
  optionAttrs,
} = useComboBoxHighlight({ input, content, options })

const { isOpen, blocks, visibleCount, open, close } = useComboBoxOpenState({
  props,
  isDisabled: disabled,
  onUpdateOpen: (value) => emit('update:open', value),
  optionCount: () => options.value.length,
  filteredCount,
  liveBlocks,
  isShowingAll,
  highlightOnOpen,
})

const isFocused = ref(false)
const isFocusVisible = ref(false)

const { commitSelection, commitValue, revert } = useComboBoxCommit({
  props,
  isMultiple: () => isMultiple.value,
  isFocused,
  selection,
  selectedKey,
  selectedText,
  inputValue,
  resetInputValue,
  mirrorText,
  close,
})

// ---- Validation ---------------------------------------------------------------------------------------------------
// ComboboxRoot renders a fragment (PopperRoot), so its `$el` isn't the element; find it from the input
const rootEl = () => input.value?.closest<HTMLElement>('[data-slot=combo-box]') ?? undefined

const toValidationValue = (): ComboBoxValidationValue | null => {
  if (isMultiple.value && selectedValues.value.length === 0) return null

  return { inputValue: inputValue.value, value: selection.value, selectedKey: selectedKey.value }
}

const { validation, invalid, commitValidation } = useFieldValidation<ComboBoxValidationValue>({
  formField: props,
  value: toValidationValue,
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => rootEl(),
  onReset: () => {
    const value = reset() as ListBoxValue | null
    const resetText = isMultiple.value ? '' : resolveItemText(value)
    inputValue.value = props.defaultInputValue ?? resetText
  },
})

const isNativeRequired = computed(() => {
  const isNativeBehavior = (props.validationBehavior ?? 'native') === 'native'
  const isEmpty = !isMultiple.value || selectedValues.value.length === 0

  return !!props.required && isNativeBehavior && isEmpty
})

// ---- Input events -----------------------------------------------------------------------------------------------
const { onKeydown } = useComboBoxKeyboard({
  props,
  isMultiple: () => isMultiple.value,
  isOpen,
  inputValue,
  selectedKey,
  selectedText,
  highlighted,
  itemValueOf,
  setHighlight,
  selectHighlighted,
  navigate,
  open,
  commitSelection,
  commitValue,
  revert,
})

const { onInput, onFocus, onBlur, onTriggerPointerdown, onTriggerClick } = useComboBoxInputEvents({
  props,
  input,
  rootEl,
  content,
  isDisabled: disabled,
  isMultiple: () => isMultiple.value,
  isFocused,
  isFocusVisible,
  isOpen,
  isShowingAll,
  filteredCount,
  inputValue,
  selection,
  setHighlight,
  clearHighlightAfterReka,
  open,
  close,
  commitValue,
  commitValidation,
})

const isTriggerHovered = ref(false)

// ---- Selection from the list (Reka ComboboxItem / ListboxRoot) --------------------------------------------------
const pressRelease = usePressRelease()

const rekaValue = computed(() =>
  isMultiple.value ? selectedValues.value : (selectedKey.value ?? undefined),
)

// RAC resets the text and keeps the popover open. Reka keeps the picked option highlighted; RAC drops the virtual
// focus after a pointer pick and keeps it after a keyboard one
const applyMultipleSelection = (value: unknown) => {
  selection.value = Array.isArray(value) ? (value as ListBoxValue[]) : []
  inputValue.value = ''
  isShowingAll.value = false

  if (!isKeyboardModality.value) clearHighlightAfterReka()
}

const applySingleSelection = (value: unknown) => {
  const key = (value as ListBoxValue | undefined) ?? null
  selection.value = key
  resetInputValue(key)
}

const onRekaValue = (value: unknown) => {
  const applySelection = isMultiple.value ? applyMultipleSelection : applySingleSelection
  applySelection(value)
  commitValidation()
}

// Reka closes on single selection and on dismiss (outside press, Escape, focus outside)
const onRekaOpen = (value: boolean) => {
  if (value) return

  const isInputFocused = isFocused.value && document.activeElement === input.value
  if (isInputFocused) {
    close()
    return
  }

  commitValue()
}

// ---- Ids / ARIA ---------------------------------------------------------------------------------------------------
const attrs = useAttrs()
const autoId = useId()
const id = computed(() => props.id ?? `${autoId}-input`)
const triggerId = `${autoId}-trigger`
const listboxId = `${autoId}-listbox`
const valueId = `${autoId}-value`
const shouldShowValue = computed(() => isMultiple.value || !!slots.value)

// Chrome ids derive from `autoId` even with an `id` prop (that one names the input)
const { labelId, hasLabel, describedBy, FieldLabel, FieldDescription, FieldError } = useFieldChrome(
  {
    props,
    baseId: autoId,
    slots,
    invalid,
    validation,
    disabled,
    required: () => props.required,
    hideDescriptionWhenInvalid: true,
    ariaDescribedBy: () => attrs['aria-describedby'] as string | undefined,
    describedByIds: () => [shouldShowValue.value && valueId],
  },
)

const inputLabelledBy = computed(
  () =>
    (attrs['aria-labelledby'] as string | undefined) ??
    (hasLabel.value ? labelId.value : undefined),
)

const rootAttrs = computed(() => {
  const {
    'aria-label': _label,
    'aria-labelledby': _labelledby,
    'aria-describedby': _describedby,
    ...rest
  } = attrs

  return rest
})

const shouldSubmitText = computed(() => props.allowsCustomValue || props.formValue === 'text')
const hiddenValues = computed(() => (selectedValues.value.length ? selectedValues.value : ['']))

// ---- Classes ------------------------------------------------------------------------------------------------------
const ui = useComponentUI('comboBox', {
  theme,
  variantProps: () => ({ fullWidth: props.fullWidth }),
  props,
})

const inputUi = useComponentUI('input', {
  theme: inputTheme,
  variantProps: () => ({
    variant: props.variant,
    fullWidth: false,
  }),
  // The text input is the input theme's root, styled by `ui.input`.
  props: {
    get ui() {
      return { base: props.ui?.input }
    },
  },
})

const listBoxUi = useComponentUI('listBox', { theme: listBoxTheme, variantProps: () => ({}) })

const rowSlots = [
  'item',
  'item-leading',
  'item-label',
  'item-description',
  'item-trailing',
  'section-label',
  'empty',
  'loading',
] as const

const forwarded = computed(() => rowSlots.filter((name) => slots[name]))
</script>
