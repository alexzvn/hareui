<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    data-slot="autocomplete"
    :data-focused="triggerState.isFocusWithin || isOpen ? 'true' : undefined"
    :data-focus-visible="triggerState.isFocusVisible ? 'true' : undefined"
    :data-open="isOpen ? 'true' : undefined"
    :data-disabled="disabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :class="ui.base()"
  >
    <FieldLabel :id="labelId" as="span" :class="ui.label()" @click="button?.focus()" />
    <PopoverRoot :open="isOpen" :modal="false" @update:open="setOpen">
      <PopoverLabelBridge :labelled-by="popupLabelledBy" />
      <PopoverAnchor as-child>
        <div
          ref="trigger"
          role="group"
          data-slot="autocomplete-trigger"
          :data-disabled="disabled ? 'true' : undefined"
          :data-hovered="triggerState.isHovered ? 'true' : undefined"
          :data-focus-within="triggerState.isFocusWithin ? 'true' : undefined"
          :data-focus-visible="triggerState.isFocusVisible ? 'true' : undefined"
          :class="ui.trigger()"
          @pointerdown="onTriggerPointerdown"
          @mousedown="onTriggerMousedown"
          @click="onTriggerClick"
          @focusin="onFocusIn"
          @focusout="onFocusOut"
          @pointerenter="onPointerenter"
          @pointerleave="onPointerleave"
        >
          <span
            :id="valueId"
            data-slot="autocomplete-value"
            :data-placeholder="isPlaceholder ? 'true' : undefined"
            :class="ui.value()"
          >
            <!-- RAC SelectValue re-renders each selected item's children, indicator included; the value class hides it -->
            <!-- A rich item (with a description) re-renders as RAC does: its label only, in the item's column wrapper -->
            <slot
              name="value"
              :selected-items="selectedItems"
              :is-placeholder="isPlaceholder"
              :text="valueText"
              ><div v-if="!isMultiple && selectedItems[0]?.description" class="flex flex-col">
                <Label as="span">{{ selectedItems[0].label }}</Label>
              </div>
              <template v-else>{{ valueText }}</template
              ><span
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
          <button
            v-if="clearable"
            type="button"
            tabindex="-1"
            aria-label="Clear selection"
            data-slot="autocomplete-clear-button"
            :aria-hidden="isPlaceholder ? 'true' : undefined"
            :data-empty="isPlaceholder ? 'true' : undefined"
            :disabled="disabled"
            :class="ui.clearButton()"
            @click="clear"
          >
            <slot name="clear">
              <svg
                aria-hidden="true"
                data-slot="autocomplete-clear-button-icon"
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
          </button>
          <button
            :id="id"
            ref="button"
            type="button"
            aria-haspopup="listbox"
            :aria-expanded="isOpen ? 'true' : 'false'"
            :aria-controls="isOpen ? listboxId : undefined"
            :aria-label="ariaLabel()"
            :aria-labelledby="buttonLabelledBy"
            :aria-describedby="describedBy"
            :aria-invalid="invalid ? 'true' : undefined"
            :disabled="disabled"
            :data-pressed="isOpen ? 'true' : undefined"
            @keydown="onButtonKeydown"
          >
            <!-- HeroUI clones the custom indicator element itself (no wrapper) -->
            <Primitive
              v-if="slots.indicator"
              as-child
              aria-hidden="true"
              data-slot="autocomplete-indicator"
              :data-open="isOpen ? 'true' : undefined"
              :class="ui.indicator()"
            >
              <slot name="indicator" :open="isOpen" />
            </Primitive>
            <svg
              v-else
              aria-hidden="true"
              data-slot="autocomplete-default-indicator"
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
        </div>
      </PopoverAnchor>
      <PopoverPortal :disabled="portalTarget.disabled" :to="portalTarget.to">
        <PopoverContent
          role="dialog"
          tabindex="-1"
          data-slot="autocomplete-popover"
          side="bottom"
          align="center"
          :side-offset="8"
          :collision-padding="12"
          :class="ui.popover()"
          @open-auto-focus="onOpenAutoFocus"
          @close-auto-focus="onCloseAutoFocus"
          @pointer-down-outside="onOutside"
          @focus-outside="onOutside"
          @escape-key-down="onEscapeKeyDown"
          @keydown="onPopoverKeydown"
        >
          <ListboxRoot
            class="contents"
            :model-value="listValue as any"
            :multiple="isMultiple"
            :disabled="disabled"
            @update:model-value="onListUpdate"
          >
            <ListboxBridge @ready="listboxRef = $event" />
            <AutocompleteSearchField
              v-if="search"
              :id="searchId"
              ref="searchField"
              :value="inputValue"
              :label="searchLabel"
              :placeholder="searchPlaceholder"
              :listbox-id="listboxId"
              :active-descendant="activeDescendant"
              :ui="props.ui"
              @update:value="setSearchText"
              @clear="setSearchText('')"
            >
              <template #trailing>
                <slot name="search-trailing" :input-value="inputValue" />
              </template>
            </AutocompleteSearchField>
            <ListboxContent
              :id="listboxId"
              ref="list"
              data-slot="list-box"
              data-layout="stack"
              aria-label="Suggestions"
              :aria-labelledby="listLabelledBy"
              :aria-multiselectable="isMultiple ? 'true' : undefined"
              :data-empty="countRows(blocks) ? undefined : 'true'"
              :class="listBoxUi.base()"
              @mousedown.prevent
              @pointerdown="pressRelease.onPointerdown"
              @pointerup="pressRelease.onPointerup"
            >
              <ListBoxRows
                v-if="forwarded.length || slots['item-indicator']"
                ref="rows"
                :blocks="blocks"
                :selected-values="selectedValues"
                :selection-mode="selectionMode"
                :disabled="disabled"
                :classes="listBoxUi as any"
                :virtual-focus="virtualFocus"
                :option-attrs="optionAttrs"
                :loading="loading"
                :virtualize="virtualize"
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
                ref="rows"
                :blocks="blocks"
                :selected-values="selectedValues"
                :selection-mode="selectionMode"
                :disabled="disabled"
                :classes="listBoxUi as any"
                :virtual-focus="virtualFocus"
                :option-attrs="optionAttrs"
                :loading="loading"
                :virtualize="virtualize"
                @load-more="emit('loadMore')"
              />
            </ListboxContent>
          </ListboxRoot>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
    <FieldDescription />
    <FieldError />
    <AutocompleteHiddenSelect
      :name="name"
      :multiple="isMultiple"
      :required="isNativeRequired"
      :disabled="disabled"
      :autocomplete="autocomplete"
      :options="options"
      :is-selected="isSelected"
      @invalid="onHiddenInvalid"
    />
  </div>
</template>

<script setup lang="ts" generic="T extends ListBoxItem = ListBoxItem">
import {
  ListboxContent,
  ListboxRoot,
  PopoverAnchor,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  Primitive,
} from 'reka-ui'
import { computed, getCurrentInstance, shallowRef, useAttrs, useTemplateRef } from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import Label from '@/components/label/Label.vue'
import type {
  ListBoxItem,
  ListBoxItemSlotProps,
  ListBoxValue,
} from '@/components/list-box/ListBox.types'
import { countRows } from '@/components/list-box/listBoxCollection'
import ListBoxRows from '@/components/list-box/ListBoxRows.vue'
import listBoxTheme from '@/components/list-box/theme'
import { useCollectionModel } from '@/components/list-box/useCollectionModel'
import { usePressRelease } from '@/components/select/pressRelease'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'
import { usePortal } from '@/composables/usePortal'

import type {
  AutocompleteEmits,
  AutocompleteProps,
  AutocompleteSlots,
  AutocompleteValue,
} from './Autocomplete.types'
import AutocompleteHiddenSelect from './AutocompleteHiddenSelect.vue'
import AutocompleteSearchField from './AutocompleteSearchField.vue'
import type { ListboxContext } from './ListboxBridge'
import ListboxBridge from './ListboxBridge'
import PopoverLabelBridge from './PopoverLabelBridge'
import theme from './theme'
import { useAutocompleteAria } from './useAutocompleteAria'
import { useAutocompleteOpen } from './useAutocompleteOpen'
import { useAutocompletePopoverFocus } from './useAutocompletePopoverFocus'
import { useAutocompleteSearch } from './useAutocompleteSearch'
import { useAutocompleteTrigger } from './useAutocompleteTrigger'
import { useAutocompleteVirtualFocus } from './useAutocompleteVirtualFocus'

defineOptions({ inheritAttrs: false })

// Absent booleans stay `undefined`: `open` → uncontrolled, `invalid` → validation decides, `loading` → no sentinel
const props = withDefaults(defineProps<AutocompleteProps<T>>(), {
  portal: undefined,
  selectionMode: 'single',
  defaultValue: undefined,
  placeholder: 'Select an item',
  search: true,
  searchPlaceholder: 'Search...',
  searchLabel: 'Search options',
  filter: undefined,
  open: undefined,
  invalid: undefined,
  loading: undefined,
})

const emit = defineEmits<AutocompleteEmits>()
const slots = defineSlots<AutocompleteSlots<T>>()
const modelValue = defineModel<AutocompleteValue>()
const inputModel = defineModel<string>('inputValue')
const attrs = useAttrs()

const portalTarget = usePortal(() => props.portal)
const disabled = useFieldsetDisabled(() => props.disabled)
const isMultiple = computed(() => props.selectionMode === 'multiple')

// Whether the parent binds `v-model:input-value` (defineModel keeps a local value when it doesn't)
const vnodeProps = getCurrentInstance()?.vnode.props ?? {}
const isInputControlled = () => ['inputValue', 'input-value'].some((key) => key in vnodeProps)

const root = useTemplateRef<HTMLElement>('root')
const trigger = useTemplateRef<HTMLElement>('trigger')
const button = useTemplateRef<HTMLButtonElement>('button')
const searchField = useTemplateRef<InstanceType<typeof AutocompleteSearchField>>('searchField')
const list = useTemplateRef<{ $el: HTMLElement }>('list')
const rows = useTemplateRef<InstanceType<typeof ListBoxRows>>('rows')
const listboxRef = shallowRef<ListboxContext>()

const listElement = () => list.value?.$el as HTMLElement | undefined
const searchInput = () => searchField.value?.input ?? undefined

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
  isSelected,
  clear: clearSelection,
  reset,
} = useCollectionModel<T>({
  items: () => props.items,
  model: modelValue,
  defaultValue: () => props.defaultValue,
  isMultiple: () => isMultiple.value,
  placeholder: () => props.placeholder,
})

// ---- Validation -------------------------------------------------------------------------------------------------
const { validation, invalid, commitValidation } = useFieldValidation<AutocompleteValue>({
  formField: props,
  value: () => selection.value,
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value,
  onReset: reset,
})

const isNativeRequired = computed(
  () => !!props.required && (props.validationBehavior ?? 'native') === 'native',
)

// Native form validation focuses the hidden <select>; hand focus to the trigger button instead
const onHiddenInvalid = () => {
  requestAnimationFrame(() => {
    const active = document.activeElement
    const isHiddenSelectFocused =
      active instanceof HTMLSelectElement && root.value?.contains(active) === true

    if (isHiddenSelectFocused) button.value?.focus({ focusVisible: true } as FocusOptions)
  })
}

// ---- Ids / ARIA -------------------------------------------------------------------------------------------------
const { id, labelId, hasLabel, describedBy, FieldLabel, FieldDescription, FieldError } =
  useFieldChrome({
    props,
    slots,
    invalid,
    validation,
    disabled,
    required: () => props.required,
  })

const {
  valueId,
  listboxId,
  searchId,
  ariaLabel,
  buttonLabelledBy,
  popupLabelledBy,
  listLabelledBy,
  rootAttrs,
} = useAutocompleteAria({ id, labelId, hasLabel, attrs })

// ---- Open state, virtual focus and search -----------------------------------------------------------------------
const { isOpen, setOpen, getOpenStrategy } = useAutocompleteOpen({
  props,
  hasOptions: () => options.value.length > 0,
  isDisabled: () => disabled.value,
  onUpdate: (value) => emit('update:open', value),
})

const {
  focusedKey,
  activeDescendant,
  virtualFocus,
  enabledRows,
  setFocusKey,
  navigate,
  optionAttrs,
} = useAutocompleteVirtualFocus({
  listboxId: () => listboxId.value,
  listElement,
  rows: () => rows.value?.rows() ?? [],
  scrollToIndex: (index) => rows.value?.scrollToIndex(index),
  options: () => options.value,
  virtualize: () => props.virtualize,
  isDisabled: () => disabled.value,
  isOpen: () => isOpen.value,
})

const { inputValue, blocks, setSearchText, onEscapeKeyDown } = useAutocompleteSearch<T>({
  props,
  model: inputModel,
  isControlled: isInputControlled,
  isOpen: () => isOpen.value,
  enabledRows,
  setFocusKey,
})

const { onOpenAutoFocus, onCloseAutoFocus, onOutside, onPopoverKeydown } =
  useAutocompletePopoverFocus({
    isOpen: () => isOpen.value,
    hasSearch: () => props.search,
    searchInput,
    listElement,
    trigger: () => trigger.value ?? undefined,
    listbox: () => listboxRef.value,
    getOpenStrategy,
    isSelected,
    virtualFocus: { focusedKey: () => focusedKey.value, enabledRows, setFocusKey, navigate },
  })

// ---- Selection from the list ------------------------------------------------------------------------------------
const listValue = computed(() =>
  isMultiple.value ? selectedValues.value : (selectedKey.value ?? undefined),
)

const applyListValue = (value: unknown) => {
  if (isMultiple.value) {
    selection.value = Array.isArray(value) ? (value as ListBoxValue[]) : []
    return
  }

  // Reka toggles a re-picked option off; RAC Select keeps it
  if (value !== undefined) selection.value = value as ListBoxValue
  setOpen(false)
}

const onListUpdate = (value: unknown) => {
  applyListValue(value)
  commitValidation()
}

const clear = () => {
  if (disabled.value || isPlaceholder.value) return

  clearSelection()
  commitValidation()
  emit('clear')
}

// ---- Trigger ----------------------------------------------------------------------------------------------------
// Typeahead on the closed trigger selects in single mode only
const selectTypeaheadMatch = (match: T) => {
  if (isMultiple.value) return

  selection.value = match.value
  commitValidation()
}

const {
  state: triggerState,
  onTriggerPointerdown,
  onTriggerMousedown,
  onTriggerClick,
  onButtonKeydown,
  onPointerenter,
  onPointerleave,
  onFocusIn,
  onFocusOut,
} = useAutocompleteTrigger<T>({
  button: () => button.value ?? undefined,
  trigger: () => trigger.value ?? undefined,
  isDisabled: () => disabled.value,
  isOpen: () => isOpen.value,
  setOpen,
  isClearable: () => !!props.clearable,
  clear,
  typeahead: {
    options: () => options.value,
    currentValue: () => selectedValues.value[0],
    select: selectTypeaheadMatch,
  },
})

const pressRelease = usePressRelease()

// ---- Classes and slots ------------------------------------------------------------------------------------------
const ui = useComponentUI('autocomplete', {
  theme,
  variantProps: () => ({
    variant: props.variant,
    fullWidth: props.fullWidth,
  }),
  props,
})

// The suggestion list's root takes `ui.listBox`.
const listBoxUi = useComponentUI('listBox', {
  theme: listBoxTheme,
  variantProps: () => ({}),
  props: {
    get ui() {
      return { base: props.ui?.listBox }
    },
  },
})

const valueIndicatorClass = (item: ListBoxItem) => {
  return listBoxUi.value.indicator({ variant: item.variant })
}

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
