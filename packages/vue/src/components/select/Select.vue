<template>
  <div
    ref="root"
    data-slot="select"
    v-bind="rootAttrs"
    :data-focused="interaction.isFocused || isOpen ? 'true' : undefined"
    :data-focus-visible="interaction.isFocusVisible ? 'true' : undefined"
    :data-open="isOpen ? 'true' : undefined"
    :data-disabled="disabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :class="ui.base()"
  >
    <FieldLabel :id="labelId" as="span" @click="triggerEl()?.focus()" />
    <PopoverRoot :open="isOpen" :modal="false" @update:open="onRootOpenChange">
      <PopoverLabel />
      <PopoverTrigger as-child>
        <button
          :id="id"
          ref="trigger"
          type="button"
          data-slot="select-trigger"
          aria-haspopup="listbox"
          :aria-label="attrs['aria-label'] as string | undefined"
          :aria-labelledby="triggerLabelledBy"
          :aria-describedby="describedBy"
          :aria-invalid="invalid ? 'true' : undefined"
          :disabled="disabled"
          :data-disabled="disabled ? 'true' : undefined"
          :data-pressed="isOpen ? 'true' : undefined"
          :data-hovered="interaction.isHovered ? 'true' : undefined"
          :data-focused="interaction.isFocused ? 'true' : undefined"
          :data-focus-visible="interaction.isFocusVisible ? 'true' : undefined"
          :class="ui.trigger()"
          @keydown="onTriggerKeydown"
          @focus="onTriggerFocus"
          @blur="onTriggerBlur"
          @pointerdown="onTriggerPointerdown"
          @mousedown="onTriggerMousedown"
          @pointerenter="interaction.isHovered = $event.pointerType === 'mouse'"
          @pointerleave="interaction.isHovered = false"
        >
          <slot name="leading" />
          <span
            :id="valueId"
            data-slot="select-value"
            :data-placeholder="isPlaceholder ? 'true' : undefined"
            :class="ui.value()"
          >
            <slot
              name="value"
              :selected-items="selectedItems"
              :is-placeholder="isPlaceholder"
              :text="valueText"
            >
              {{ valueText }}
              <!-- RAC SelectValue re-renders each selected item's children, indicator included; the value class hides it -->
              <span
                v-for="item in selectedItems"
                :key="String(item.value)"
                aria-hidden="true"
                data-slot="list-box-item-indicator"
                :class="valueIndicatorClass(item)"
              >
                <svg
                  aria-hidden="true"
                  data-slot="list-box-item-indicator--checkmark"
                  fill="none"
                  role="presentation"
                  stroke="currentColor"
                  stroke-dasharray="22"
                  stroke-dashoffset="66"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 17 18"
                >
                  <polyline points="1 9 7 14 15 4" />
                </svg>
              </span>
            </slot>
          </span>
          <span
            v-if="clearable"
            aria-hidden="true"
            data-slot="select-clear-button"
            :data-empty="isPlaceholder ? 'true' : undefined"
            :class="ui.clearButton()"
            @pointerdown.stop
            @click.stop.prevent="clear"
          >
            <slot name="clear">
              <svg
                aria-hidden="true"
                data-slot="select-clear-button-icon"
                fill="none"
                height="16"
                role="presentation"
                viewBox="0 0 16 16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  d="M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L9.06 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L6.94 8 3.47 4.53a.75.75 0 0 1 0-1.06Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                />
              </svg>
            </slot>
          </span>
          <span
            v-if="slots.indicator"
            aria-hidden="true"
            data-slot="select-indicator"
            :data-open="isOpen ? 'true' : undefined"
            :class="ui.indicator()"
          >
            <slot name="indicator" :open="isOpen" />
          </span>
          <svg
            v-else
            aria-hidden="true"
            data-slot="select-default-indicator"
            :data-open="isOpen ? 'true' : undefined"
            fill="none"
            height="16"
            role="presentation"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
            :class="ui.indicator()"
          >
            <path
              clip-rule="evenodd"
              d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06"
              fill="currentColor"
              fill-rule="evenodd"
            />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverPortal :disabled="portalTarget.disabled" :to="portalTarget.to">
        <PopoverContent
          ref="content"
          data-slot="select-popover"
          :side="side"
          :align="align"
          :side-offset="8"
          :collision-padding="12"
          :class="ui.popover()"
          @open-auto-focus="onOpenAutoFocus"
          @close-auto-focus="onCloseAutoFocus"
          @pointerdown="pressRelease.onPointerdown"
          @pointerup="pressRelease.onPointerup"
        >
          <ListBox
            ref="listBox"
            :model-value="isMultiple ? selectedValues : selectedKey"
            :items="items"
            :selection-mode="selectionMode"
            highlight-on-hover
            escape-key-behavior="none"
            :loading="loading"
            :aria-labelledby="listLabelledBy"
            :aria-label="listLabelledBy ? undefined : (attrs['aria-label'] as string | undefined)"
            @update:model-value="onListUpdate"
            @load-more="emit('loadMore')"
          >
            <template v-for="name in forwarded" #[name]="state">
              <slot :name="name" v-bind="state as any" />
            </template>
            <template v-if="slots['item-indicator']" #indicator="state">
              <slot name="item-indicator" v-bind="state as ListBoxItemSlotProps<T>" />
            </template>
          </ListBox>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
    <FieldDescription />
    <FieldError />
    <!-- RAC HiddenSelect: carries form data and native `required` validity -->
    <div
      aria-hidden="true"
      data-a11y-ignore="aria-hidden-focus"
      style="
        border: 0;
        clip-path: inset(50%);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        white-space: nowrap;
        width: 1px;
      "
    >
      <select
        tabindex="-1"
        :name="name"
        :multiple="isMultiple"
        :required="required && (validationBehavior ?? 'native') === 'native'"
        :disabled="disabled"
        :autocomplete="autocomplete"
        @invalid="onHiddenInvalid"
      >
        <option value="" />
        <option
          v-for="item in options"
          :key="item.value"
          :value="item.value"
          :selected="isSelected(item.value)"
        >
          {{ itemText(item) }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends ListBoxItem = ListBoxItem">
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { computed, provide, ref, shallowReactive, useAttrs, useTemplateRef, watch } from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import type {
  ListBoxItem,
  ListBoxItemSlotProps,
  ListBoxValue,
} from '@/components/list-box/ListBox.types'
import ListBox from '@/components/list-box/ListBox.vue'
import { itemText } from '@/components/list-box/listBoxCollection'
import listBoxTheme from '@/components/list-box/theme'
import { useCollectionModel } from '@/components/list-box/useCollectionModel'
import type { TypeaheadSource } from '@/components/list-box/useTypeahead'
import { useTypeahead } from '@/components/list-box/useTypeahead'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'
import { keyboardModalityKey, useKeyboardModality } from '@/composables/useKeyboardModality'
import { useLocale } from '@/composables/useLocale'
import { usePortal } from '@/composables/usePortal'

import { usePressRelease } from './pressRelease'
import type { SelectEmits, SelectProps, SelectSlots, SelectValue } from './Select.types'
import theme from './theme'
import { useSelectLabels } from './useSelectLabels'
import { useSelectListFocus } from './useSelectListFocus'

defineOptions({ inheritAttrs: false })

// The popover's options mount after the press that opens it, so the modality is tracked from here
provide(keyboardModalityKey, useKeyboardModality())

// Absent booleans stay `undefined` (not `false`): `open` → uncontrolled, `invalid` → validation decides,
// `loading` → no sentinel
const { t } = useLocale()

const props = withDefaults(defineProps<SelectProps<T>>(), {
  portal: undefined,
  selectionMode: 'single',
  defaultValue: undefined,
  placeholder: undefined,
  side: 'bottom',
  align: 'center',
  open: undefined,
  invalid: undefined,
  loading: undefined,
})

const emit = defineEmits<SelectEmits>()
const slots = defineSlots<SelectSlots<T>>()
const modelValue = defineModel<SelectValue>()

const portalTarget = usePortal(() => props.portal)
const disabled = useFieldsetDisabled(() => props.disabled)
const isMultiple = computed(() => props.selectionMode === 'multiple')

// Selection: `v-model` wins when bound; otherwise local, seeded from `defaultValue`. Selected items keep
// collection order (not RAC's selection order)
const {
  options,
  selection,
  selectedValues,
  selectedKey,
  selectedItems,
  valueText,
  isPlaceholder,
  isSelected,
  clear: clearSelection,
  reset,
} = useCollectionModel<T>({
  items: () => props.items,
  model: modelValue,
  defaultValue: () => props.defaultValue,
  isMultiple: () => isMultiple.value,
  placeholder: () => props.placeholder ?? t('select.placeholder'),
  order: 'collection',
})

// Open state: the `open` prop wins when bound
const uncontrolledOpen = ref(props.defaultOpen ?? false)

const isOpen = computed({
  get: () => props.open ?? uncontrolledOpen.value,
  set: (value: boolean) => {
    uncontrolledOpen.value = value
    emit('update:open', value)
  },
})

const setOpen = (value: boolean) => {
  if (value && disabled.value) return

  isOpen.value = value
}

const root = useTemplateRef<HTMLElement>('root')
const trigger = useTemplateRef<{ $el: HTMLElement } | HTMLElement>('trigger')

const triggerEl = () => {
  const element = trigger.value
  return element instanceof HTMLElement ? element : element?.$el
}

const { validation, invalid, commitValidation } = useFieldValidation<SelectValue>({
  formField: props,
  value: () => selection.value,
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value,
  onReset: reset,
})

const onListUpdate = (value: ListBoxValue | ListBoxValue[] | null | undefined) => {
  selection.value = value
  commitValidation()

  // Single selection closes the popover; focus returns to the trigger
  if (!isMultiple.value) setOpen(false)
}

const clear = () => {
  if (disabled.value || isPlaceholder.value) return

  clearSelection()
  commitValidation()
  emit('clear')
}

const { setOpenStrategy, onOpenAutoFocus, onCloseAutoFocus } = useSelectListFocus({
  isPlaceholder: () => isPlaceholder.value,
  focusTrigger: () => triggerEl()?.focus(),
})

// RAC Select: typing on the closed trigger selects the first option, from the selected one onwards (inclusive, so
// a repeated character stays put) and then from the top, whose text starts with the typed string. Space opens
// instead.
const typeahead = useTypeahead({ start: 'current' })

const getTypeaheadSource = (): TypeaheadSource<T> => ({
  items: options.value,
  text: itemText,
  disabled: (item) => !!item.disabled,
  isCurrent: (item) => item.value === selectedValues.value[0],
})

const selectTypeaheadMatch = (match: T) => {
  if (isMultiple.value) return

  selection.value = match.value
  commitValidation()
}

// RAC Select opens on mouse press start, and releasing over an option selects it (press-drag-release)
let isTriggerPress = false

const endTriggerPress = () => {
  setTimeout(() => {
    isTriggerPress = false
  })
}

const onTriggerPointerdown = (event: PointerEvent) => {
  const isPrimaryMouse = event.pointerType === 'mouse' && event.button === 0
  if (!isPrimaryMouse || disabled.value) return

  // The click that ends this press must not toggle again
  isTriggerPress = true
  triggerEl()?.focus()
  setOpen(!isOpen.value)

  window.addEventListener('pointerup', endTriggerPress, { once: true, capture: true })
  window.addEventListener('pointercancel', endTriggerPress, { once: true, capture: true })
}

// Focus stays where the press put it (the trigger, or the list once open)
const onTriggerMousedown = (event: MouseEvent) => {
  if (isTriggerPress) event.preventDefault()
}

const onRootOpenChange = (value: boolean) => {
  if (!isTriggerPress) setOpen(value)
}

const pressRelease = usePressRelease()

const onTriggerKeydown = (event: KeyboardEvent) => {
  isTriggerPress = false
  if (disabled.value) return

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()

    // RAC focus strategy: ArrowUp opens on the last option (unless one is selected)
    setOpenStrategy(event.key === 'ArrowUp' ? 'last' : 'first')
    setOpen(true)

    return
  }

  const isClearKey = event.key === 'Backspace' || event.key === 'Delete'
  if (isClearKey && props.clearable && !isOpen.value) {
    event.preventDefault()
    clear()

    return
  }

  typeahead.onKeydown(event, { source: getTypeaheadSource, select: selectTypeaheadMatch })
}

// RAC Button / Select interaction states
const interaction = shallowReactive({ isHovered: false, isFocused: false, isFocusVisible: false })

const onTriggerFocus = (event: FocusEvent) => {
  interaction.isFocused = true

  interaction.isFocusVisible =
    event.target instanceof Element && event.target.matches(':focus-visible')
}

const onTriggerBlur = () => {
  interaction.isFocused = false
  interaction.isFocusVisible = false
}

// The validation composable focuses the first native control of an invalid field; the hidden <select> isn't
// focusable for users, so hand focus to the trigger (RAC marks it `data-react-aria-prevent-focus`)
const onHiddenInvalid = () => {
  requestAnimationFrame(() => {
    const active = document.activeElement
    const isHiddenSelectFocused =
      active instanceof HTMLSelectElement && !!root.value?.contains(active)

    if (isHiddenSelectFocused) triggerEl()?.focus({ focusVisible: true } as FocusOptions)
  })
}

const attrs = useAttrs()

const { id, labelId, hasLabel, describedBy, FieldLabel, FieldDescription, FieldError } =
  useFieldChrome({
    props,
    slots,
    invalid,
    validation,
    disabled,
    required: () => props.required,
    hideDescriptionWhenInvalid: true,
  })

const { valueId, triggerLabelledBy, listLabelledBy, PopoverLabel, rootAttrs } = useSelectLabels({
  attrs,
  id,
  labelId,
  hasLabel,
})

// ListBox item slots are forwarded; the option checkmark is `item-indicator` here (`indicator` is the chevron)
const itemSlots = [
  'item',
  'item-leading',
  'item-label',
  'item-description',
  'item-trailing',
  'section-label',
  'empty',
  'loading',
] as const

const forwarded = computed(() => itemSlots.filter((name) => slots[name]))

const ui = useComponentUI('select', {
  theme,
  variantProps: () => ({
    variant: props.variant,
    fullWidth: props.fullWidth,
  }),
  props,
})

// Classes for the hidden indicator copies inside the value (RAC renders the item's own indicator there);
// per-item variant override, as in ListBoxOption
const listBoxUi = useComponentUI('listBox', { theme: listBoxTheme, variantProps: () => ({}) })

const valueIndicatorClass = (item: ListBoxItem) => {
  const indicator = listBoxUi.value.indicator as (options?: { variant?: string }) => string
  return indicator({ variant: item.variant })
}

watch(disabled, (isDisabled) => {
  if (isDisabled) setOpen(false)
})
</script>
