<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    data-slot="autocomplete"
    :data-focused="focusWithin || isOpen ? 'true' : undefined"
    :data-focus-visible="focusVisible ? 'true' : undefined"
    :data-open="isOpen ? 'true' : undefined"
    :data-disabled="disabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <FieldLabel
      :id="labelId"
      as="span"
      :class="ui.label({ class: props.ui?.label })"
      @click="button?.focus()"
    />
    <PopoverRoot :open="isOpen" :modal="false" @update:open="setOpen">
      <PopoverLabelBridge :labelled-by="popupLabelledBy" />
      <PopoverAnchor as-child>
        <div
          ref="trigger"
          role="group"
          data-slot="autocomplete-trigger"
          :data-disabled="disabled ? 'true' : undefined"
          :data-hovered="hovered ? 'true' : undefined"
          :data-focus-within="focusWithin ? 'true' : undefined"
          :data-focus-visible="focusVisible ? 'true' : undefined"
          :class="ui.trigger({ class: props.ui?.trigger })"
          @pointerdown="onTriggerPointerdown"
          @mousedown="onTriggerMousedown"
          @click="onTriggerClick"
          @focusin="onFocusIn"
          @focusout="onFocusOut"
          @pointerenter="hovered = $event.pointerType === 'mouse'"
          @pointerleave="hovered = false"
        >
          <span
            :id="valueId"
            data-slot="autocomplete-value"
            :data-placeholder="isPlaceholder ? 'true' : undefined"
            :class="ui.value({ class: props.ui?.value })"
          >
            <!-- RAC SelectValue re-renders each selected item's children, indicator included; the value class hides it -->
            <!-- A rich item (with a description) re-renders as RAC does: its label only, in the item's column wrapper -->
            <slot
              name="value"
              :selected-items="selectedItems"
              :is-placeholder="isPlaceholder"
              :text="valueText"
              ><div v-if="!multiple && selectedItems[0]?.description" class="flex flex-col">
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
            :class="ui.clearButton({ class: props.ui?.clearButton })"
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
            :aria-label="attrs['aria-label'] as string | undefined"
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
              :class="ui.indicator({ class: props.ui?.indicator })"
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
              :class="ui.indicator({ class: props.ui?.indicator })"
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
          :class="ui.popover({ class: props.ui?.popover })"
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
            :multiple="multiple"
            :disabled="disabled"
            @update:model-value="onListUpdate"
          >
            <ListboxBridge @ready="listboxRef = $event" />
            <div
              v-if="search"
              data-slot="search-field"
              :data-empty="inputValue ? undefined : 'true'"
              :class="searchUi.base({ class: [props.ui?.searchField] })"
            >
              <div
                data-slot="search-field-group"
                role="group"
                :data-focus-within="'true'"
                :data-focus-visible="searchFocusVisible ? 'true' : undefined"
                :class="searchUi.group({ class: props.ui?.searchGroup })"
              >
                <span
                  data-slot="search-field-search-icon"
                  :class="searchUi.searchIcon({ class: props.ui?.searchIcon })"
                >
                  <svg
                    aria-hidden="true"
                    fill="none"
                    height="16"
                    role="presentation"
                    viewBox="0 0 16 16"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clip-rule="evenodd"
                      d="M11.5 7a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m-.82 4.74a6 6 0 1 1 1.06-1.06l2.79 2.79a.75.75 0 1 1-1.06 1.06z"
                      fill="currentColor"
                      fill-rule="evenodd"
                    />
                  </svg>
                </span>
                <input
                  :id="searchId"
                  ref="searchInput"
                  type="search"
                  autocomplete="off"
                  autocorrect="off"
                  spellcheck="false"
                  enterkeyhint="go"
                  aria-autocomplete="list"
                  :aria-label="searchLabel"
                  :aria-controls="listboxId"
                  :aria-activedescendant="activeDescendant"
                  :placeholder="searchPlaceholder"
                  :value="inputValue"
                  data-slot="search-field-input"
                  :class="searchUi.input({ class: props.ui?.searchInput })"
                  @input="onSearchInput"
                  @focus="searchFocusVisible = ($event.target as Element).matches(':focus-visible')"
                  @blur="searchFocusVisible = false"
                />
                <slot name="search-trailing" :input-value="inputValue" />
                <CloseButton
                  data-slot="search-field-clear-button"
                  aria-label="Clear search"
                  tabindex="-1"
                  :class="searchUi.clearButton({ class: props.ui?.searchClearButton })"
                  @mousedown.prevent
                  @click="onSearchClear"
                />
              </div>
            </div>
            <ListboxContent
              :id="listboxId"
              ref="list"
              data-slot="list-box"
              data-layout="stack"
              aria-label="Suggestions"
              :aria-labelledby="listLabelledBy"
              :aria-multiselectable="multiple ? 'true' : undefined"
              :data-empty="countRows(blocks) ? undefined : 'true'"
              :class="listBoxUi.base({ class: props.ui?.listBox })"
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
        :multiple="multiple"
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

<script lang="ts">
import { injectListboxRootContext, injectPopoverRootContext } from 'reka-ui'
import type { VNode } from 'vue'
import { defineComponent, watchEffect } from 'vue'

import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type {
  ListBoxEntry,
  ListBoxItem,
  ListBoxItemSlotProps,
  ListBoxSection,
  ListBoxValue,
} from '@/components/list-box/ListBox.vue'
import type { CollectionRow } from '@/components/list-box/listBoxCollection'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { PortalTarget } from '@/config'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'

type Autocomplete = typeof theme

export type AutocompleteValue = ListBoxValue | ListBoxValue[] | null

export type AutocompleteProps<T extends ListBoxItem = ListBoxItem> = {
  /**
   * Renders the listbox popover in a portal. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** Options, sections (`{ type: 'section', label, items }`) and separators (`{ type: 'separator' }`), as in ListBox. */
  items?: ListBoxEntry<T>[]
  /**
   * Whether one or several options can be selected. In `'multiple'` mode `v-model` is an array.
   * @defaultValue 'single'
   */
  selectionMode?: 'single' | 'multiple'
  /** The initial selection when uncontrolled (no `v-model`). */
  defaultValue?: AutocompleteValue
  /**
   * Text shown in the trigger while nothing is selected.
   * @defaultValue 'Select an item'
   */
  placeholder?: string
  /** Label text rendered above the trigger. */
  label?: string
  /** Helper text rendered below the trigger. Hidden while invalid. */
  description?: string
  /** Error text rendered below the trigger while invalid. Defaults to the validation messages. */
  errorMessage?: string
  /** Id of the trigger button. */
  id?: string
  /** Name of the hidden native `<select>`, submitted with forms. */
  name?: string
  /** `autocomplete` hint of the hidden native `<select>`. */
  autocomplete?: string
  /** Whether the popover is open (`v-model:open`). */
  open?: boolean
  /**
   * Whether the popover starts open when uncontrolled.
   * @defaultValue false
   */
  defaultOpen?: boolean
  /**
   * Whether the popover has a search field that filters the options (HeroUI `Autocomplete.Filter` + `SearchField`).
   * Without it, the list takes focus as in Select.
   * @defaultValue true
   */
  search?: boolean
  /**
   * Placeholder of the search field.
   * @defaultValue 'Search...'
   */
  searchPlaceholder?: string
  /**
   * Accessible name of the search field.
   * @defaultValue 'Search options'
   */
  searchLabel?: string
  /** The initial search text when uncontrolled (no `v-model:input-value`). */
  defaultInputValue?: string
  /**
   * Filters options against the search text. Defaults to a case- and accent-insensitive "contains" match on each
   * option's `textValue ?? label`. Pass `false` to show every item (e.g. when `items` are fetched per search).
   */
  filter?: ((text: string, inputValue: string) => boolean) | false
  /**
   * Whether the popover opens when there are no options.
   * @defaultValue false
   */
  allowsEmptyCollection?: boolean
  /**
   * Whether to render a clear button in the trigger. Backspace / Delete on the trigger also clears.
   * @defaultValue false
   */
  clearable?: boolean
  /** Async options: shows the `#loading` slot after the last option and emits `load-more` at the end of the list. */
  loading?: boolean
  /**
   * Render only the visible rows (Reka `ListboxVirtualizer`), for long lists. Sections and separators are skipped.
   * Pass `{ estimateSize, overscan }` to tune; rows are `estimateSize` (default 50) px apart.
   * @defaultValue false
   */
  virtualize?: boolean | { estimateSize?: number; overscan?: number }
  /**
   * Visual variant. Use `secondary` on surfaces.
   * @defaultValue 'primary'
   */
  variant?: 'primary' | 'secondary'
  /**
   * Whether the autocomplete takes the full width of its container.
   * @defaultValue false
   */
  fullWidth?: boolean
  /**
   * Whether the autocomplete is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether a selection is required before the form can be submitted.
   * @defaultValue false
   */
  required?: boolean
  /** Controlled invalid state; overrides validation. */
  invalid?: boolean
  /** Custom validation, called with the current selection. Return an error message (or several) when invalid. */
  validate?: ValidateFn<AutocompleteValue>
  /**
   * `native` blocks form submission and shows errors on commit; `aria` shows errors in realtime without blocking.
   * @defaultValue 'native' (or the enclosing Form's)
   */
  validationBehavior?: ValidationBehavior
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Autocomplete> & { searchClearButton?: ClassValue }
} & FormFieldProps

export type AutocompleteValueSlotProps<T extends ListBoxItem = ListBoxItem> = {
  /** The selected options, in selection order. */
  selectedItems: T[]
  /** Whether nothing is selected. */
  isPlaceholder: boolean
  /** The placeholder, or the selected labels joined as a list. */
  text: string
}

export type AutocompleteSlots<T extends ListBoxItem = ListBoxItem> = {
  /** Label content. Replaces `label`. */
  label?: () => VNode[]
  /** Trigger value content. Defaults to the selected label(s) or the placeholder. */
  value?: (props: AutocompleteValueSlotProps<T>) => VNode[]
  /** Trigger indicator content. Defaults to a chevron. */
  indicator?: (props: { open: boolean }) => VNode[]
  /** Clear button content. Defaults to a close icon. */
  clear?: () => VNode[]
  /** Description content. Replaces `description`. */
  description?: () => VNode[]
  /** Error content, rendered while invalid. */
  error?: (props: ValidationResult) => VNode[]
  /** Content after the search input (e.g. a Spinner while fetching). */
  'search-trailing'?: (props: { inputValue: string }) => VNode[]
  /** Whole content of each option (as ListBox `#item`). */
  item?: (props: ListBoxItemSlotProps<T>) => VNode[]
  /** Content before each option's text (ListBox `#item-leading`). */
  'item-leading'?: (props: ListBoxItemSlotProps<T>) => VNode[]
  /** Each option's label (ListBox `#item-label`). */
  'item-label'?: (props: ListBoxItemSlotProps<T>) => VNode[]
  /** Each option's description (ListBox `#item-description`). */
  'item-description'?: (props: ListBoxItemSlotProps<T>) => VNode[]
  /** Content after each option's text (ListBox `#item-trailing`). */
  'item-trailing'?: (props: ListBoxItemSlotProps<T>) => VNode[]
  /** Option checkmark content (ListBox `#indicator`). */
  'item-indicator'?: (props: ListBoxItemSlotProps<T>) => VNode[]
  /** Section heading (ListBox `#section-label`). */
  'section-label'?: (props: { section: ListBoxSection<T> }) => VNode[]
  /** Empty-state content, rendered when no option matches (HeroUI `renderEmptyState`). */
  empty?: () => VNode[]
  /** Shown after the last option while `loading` is true. */
  loading?: () => VNode[]
}

export type AutocompleteEmits = {
  /** The selection was cleared with the clear button or Backspace / Delete. */
  clear: []
  /** The popover opened or closed (`v-model:open`). */
  'update:open': [value: boolean]
  /** The search text changed (`v-model:input-value`). */
  'update:inputValue': [value: string]
  /** The end of the option list scrolled into view while `loading` is false. */
  loadMore: []
}

type ListboxContext = NonNullable<ReturnType<typeof injectListboxRootContext>>

// Internal: hands Reka's listbox context to Autocomplete, which drives the virtual focus from the search input
const ListboxBridge = defineComponent({
  emits: { ready: (_listbox: ListboxContext) => true },
  setup(_, { emit }) {
    const listbox = injectListboxRootContext()!

    // RAC Autocomplete: focus stays in the search field (or on the popover); options get virtual focus
    listbox.focusable.value = false
    emit('ready', listbox)

    return () => null
  },
})

// Internal: Reka names the popover dialog after its PopoverTrigger (`aria-labelledby` = `triggerId`, overriding ours).
// The trigger here is an anchor, so hand Reka the field's label instead, as RAC Select labels its popover.
const PopoverLabelBridge = defineComponent({
  props: { labelledBy: { type: String, default: undefined } },
  setup(props) {
    const popover = injectPopoverRootContext()
    watchEffect(() => {
      popover.triggerId = props.labelledBy ?? ''
    })

    return () => null
  },
})
</script>

<script setup lang="ts" generic="T extends ListBoxItem = ListBoxItem">
import {
  ListboxContent,
  ListboxRoot,
  PopoverAnchor,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  Primitive,
  useFilter,
} from 'reka-ui'
import {
  computed,
  getCurrentInstance,
  nextTick,
  reactive,
  ref,
  shallowRef,
  useAttrs,
  useTemplateRef,
  watch,
} from 'vue'

import CloseButton from '@/components/close-button/CloseButton.vue'
import { useFieldsetDisabled } from '@/components/fieldset/context'
import Label from '@/components/label/Label.vue'
import { countRows, filterEntries, itemText } from '@/components/list-box/listBoxCollection'
import ListBoxRows from '@/components/list-box/ListBoxRows.vue'
import listBoxTheme from '@/components/list-box/theme'
import { useCollectionModel } from '@/components/list-box/useCollectionModel'
import { useTypeahead } from '@/components/list-box/useTypeahead'
import searchFieldTheme from '@/components/search-field/theme'
import { usePressRelease } from '@/components/select/pressRelease'
import { outsideEventTarget } from '@/composables/nestedLayer'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'
import { useKeyboardModality } from '@/composables/useKeyboardModality'
import { usePortal } from '@/composables/usePortal'

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

const portalTarget = usePortal(() => props.portal)
const disabled = useFieldsetDisabled(() => props.disabled)
const emit = defineEmits<AutocompleteEmits>()
const slots = defineSlots<AutocompleteSlots<T>>()
const modelValue = defineModel<AutocompleteValue>()
const inputModel = defineModel<string>('inputValue')

// Whether the parent binds `v-model:input-value` (defineModel keeps a local value when it doesn't)
const vnodeProps = getCurrentInstance()?.vnode.props ?? {}
const inputControlled = () => ['inputValue', 'input-value'].some((key) => key in vnodeProps)

const multiple = computed(() => props.selectionMode === 'multiple')

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
  isMultiple: () => multiple.value,
  placeholder: () => props.placeholder,
})

// ---- Search text (`v-model:input-value` wins when bound) and filtering ------------------------------------------
const uncontrolledInput = ref(props.defaultInputValue ?? '')
const inputValue = computed<string>({
  get: () => (inputControlled() ? (inputModel.value ?? '') : uncontrolledInput.value),
  set: (value) => {
    uncontrolledInput.value = value
    inputModel.value = value
  },
})

const { contains } = useFilter({ sensitivity: 'base' })
const blocks = computed(() => {
  const filter = props.filter
  const text = props.search ? inputValue.value : ''

  return filterEntries(
    props.items,
    filter === false ? () => true : (item) => (filter ?? contains)(itemText(item), text),
  )
})

// ---- Open state (the `open` prop wins when bound) ---------------------------------------------------------------
const uncontrolledOpen = ref(props.defaultOpen ?? false)
const isOpen = computed(() => (props.open ?? uncontrolledOpen.value) && !disabled.value)
type FocusStrategy = 'first' | 'last' | null
let openStrategy: FocusStrategy = null
const setOpen = (value: boolean, strategy: FocusStrategy = null) => {
  if (value && (disabled.value || (!props.allowsEmptyCollection && options.value.length === 0)))
    return

  if (value === isOpen.value) return
  openStrategy = strategy
  uncontrolledOpen.value = value
  emit('update:open', value)
}

watch(isOpen, (value) => {
  // The popover unmounts its search field, so uncontrolled search text starts empty on the next open
  if (!value && !inputControlled()) uncontrolledInput.value = props.defaultInputValue ?? ''
})

// ---- Interaction modality (RAC): keyboard focus is focus-visible, hover moves focus only after pointer use ----
const keyboardModality = useKeyboardModality()

// ---- Virtual focus (RAC `focusedKey`): DOM focus stays in the search field or on the popover --------------------
// Tracked by value, not element: virtualized rows unmount when scrolled out
const listboxRef = shallowRef<ListboxContext>()
const listEl = useTemplateRef<{ $el: HTMLElement }>('list')
const rowsRef = useTemplateRef<InstanceType<typeof ListBoxRows>>('rows')
const focusedKey = ref<ListBoxValue | null>(null)
const optionId = (value: ListBoxValue) => `${listboxId.value}-option-${String(value)}`
const activeDescendant = computed(() =>
  focusedKey.value != null ? optionId(focusedKey.value) : undefined,
)

const enabledRows = () => {
  return disabled.value ? [] : (rowsRef.value?.rows() ?? []).filter((row) => !row.item.disabled)
}

const setFocusKey = (value: ListBoxValue | null, scroll = true) => {
  focusedKey.value = value
  if (value == null || !scroll) return

  // Virtualized: render the row first, then scroll it into view like any other (RAC `scrollIntoViewport`)
  const reveal = () =>
    document.getElementById(optionId(value))?.scrollIntoView({ block: 'nearest' })

  const list = listEl.value?.$el as HTMLElement | undefined
  if (props.virtualize && list && !document.getElementById(optionId(value))) {
    const index = (rowsRef.value?.rows() ?? []).findIndex((row) => row.item.value === value)
    if (index === -1) return

    // tanstack's scrollToIndex aligns to the padded scroll ends; it only serves to mount the row here. Then go back
    // and scroll it to the nearest edge (the row stays mounted until the next scroll event)
    const from = list.scrollTop
    rowsRef.value?.scrollToIndex(index)

    requestAnimationFrame(() => {
      list.scrollTop = from
      reveal()
    })
  } else {
    nextTick(reveal)
  }
}

// RAC `ListKeyboardDelegate.getKeyPageBelow/Above`: a viewport height down / up when the list scrolls, else last / first
const pageIndex = (list: CollectionRow[], current: number, down: boolean): number => {
  const el = listEl.value?.$el as HTMLElement | undefined
  if (!el || current === -1 || el.scrollHeight <= el.clientHeight) return down ? list.length - 1 : 0
  const all = rowsRef.value?.rows() ?? []
  const size = typeof props.virtualize === 'object' ? (props.virtualize.estimateSize ?? 50) : 50
  const listTop = el.getBoundingClientRect().top - el.scrollTop

  // Row rect in content coordinates: measured when mounted, from the virtualizer's fixed row size otherwise
  const rect = (row: CollectionRow) => {
    const node = document.getElementById(optionId(row.item.value))
    if (node && !props.virtualize) {
      const r = node.getBoundingClientRect()
      return { y: r.top - listTop, height: r.height }
    }

    return { y: all.indexOf(row) * size, height: size }
  }

  const start = rect(list[current]!)
  let i = current
  if (down) {
    const pageY = Math.min(el.scrollHeight, start.y - start.height + el.clientHeight)
    while (i < list.length - 1 && rect(list[i]!).y < pageY) i++
  } else {
    const pageY = Math.max(0, start.y + start.height - el.clientHeight)
    while (i > 0 && rect(list[i]!).y > pageY) i--
  }

  return i
}

const navigate = (key: string) => {
  const list = enabledRows()
  if (!list.length) return
  const current = list.findIndex((row) => row.item.value === focusedKey.value)
  let next
  if (key === 'Home') next = list[0]
  else if (key === 'End') next = list.at(-1)
  else if (key === 'PageUp' || key === 'PageDown')
    next = list[pageIndex(list, current, key === 'PageDown')]
  else if (current === -1) next = key === 'ArrowDown' ? list[0] : list.at(-1)
  else next = list[Math.min(Math.max(current + (key === 'ArrowDown' ? 1 : -1), 0), list.length - 1)]

  setFocusKey(next?.item.value ?? null)
}

// ---- Popover focus ----------------------------------------------------------------------------------------------
const searchInput = useTemplateRef<HTMLInputElement>('searchInput')
const button = useTemplateRef<HTMLButtonElement>('button')

const popoverEl = () =>
  (listEl.value?.$el as HTMLElement | undefined)?.closest<HTMLElement>(
    '[data-slot=autocomplete-popover]',
  ) ?? undefined

// RAC FocusScope `restoreFocus`: focus returns to what was focused before opening
let focusBeforeOpen: Element | null = null
watch(
  isOpen,
  (value) => {
    if (value) focusBeforeOpen = document.activeElement
  },
  { flush: 'sync' },
)

const onOpenAutoFocus = async (event: Event) => {
  event.preventDefault()

  // After Reka's own mount highlight (which falls back to the first option)
  await nextTick()
  await nextTick()
  await nextTick()

  if (props.search) searchInput.value?.focus()
  else popoverEl()?.focus()

  // RAC: the first selected option, else the first / last option when opened from the keyboard, else nothing
  const list = enabledRows()
  const selected = list.find((row) => isSelected(row.item.value))
  setFocusKey(
    (
      selected ??
      (openStrategy === 'first' ? list[0] : openStrategy === 'last' ? list.at(-1) : undefined)
    )?.item.value ?? null,
  )
}

const onCloseAutoFocus = (event: Event) => {
  event.preventDefault()

  // Only when focus was still inside the popover (or lost), as RAC
  const active = document.activeElement
  if (active && active !== document.body && !popoverEl()?.contains(active)) return

  if (
    focusBeforeOpen instanceof HTMLElement &&
    focusBeforeOpen !== document.body &&
    focusBeforeOpen.isConnected
  )
    focusBeforeOpen.focus()
}

// Presses on the trigger toggle it themselves; don't let them count as outside presses
const trigger = useTemplateRef<HTMLElement>('trigger')
const onOutside = (event: Event) => {
  const target = outsideEventTarget(event as CustomEvent<{ originalEvent: Event }>)
  if (target instanceof Node && trigger.value?.contains(target)) event.preventDefault()
}

const onEscapeKeyDown = (event: KeyboardEvent) => {
  // RAC SearchField: Escape clears the text first; the next one closes
  if (props.search && inputValue.value) {
    event.preventDefault()
    inputValue.value = ''
    onSearchTextChange()
  }
}

// ---- Search input -----------------------------------------------------------------------------------------------
const onSearchInput = (event: Event) => {
  inputValue.value = (event.target as HTMLInputElement).value
  onSearchTextChange()
}

// RAC Autocomplete: typing focuses the first match; an empty search focuses nothing
const onSearchTextChange = async () => {
  await nextTick()
  setFocusKey(inputValue.value ? (enabledRows()[0]?.item.value ?? null) : null)
}

const onSearchClear = () => {
  searchInput.value?.focus()
  inputValue.value = ''
  onSearchTextChange()
}

// Keys from the search field, or from the popover itself when there is none
const onPopoverKeydown = (event: KeyboardEvent) => {
  if (event.isComposing) return
  const fromSearch = event.target === searchInput.value
  if (!fromSearch && event.target !== popoverEl()) return

  switch (event.key) {
    case ' ':
      if (fromSearch) break
      event.preventDefault()
      selectFocused()
      break
    case 'ArrowDown':
    case 'ArrowUp':
    case 'Home':
    case 'End':
    case 'PageUp':
    case 'PageDown':
      event.preventDefault()
      navigate(event.key)
      break
    case 'Enter':
      event.preventDefault()
      selectFocused()
      break
  }
}

const searchFocusVisible = ref(false)

// ---- Selection from the list ------------------------------------------------------------------------------------
const listValue = computed(() =>
  multiple.value ? selectedValues.value : (selectedKey.value ?? undefined),
)

// Keyboard selection of the focused option (it may be scrolled out and unmounted, so not a click)
const selectFocused = () => {
  const value = focusedKey.value
  if (value == null || !enabledRows().some((row) => row.item.value === value)) return

  // Through Reka, so it counts as a user selection (a programmatic model change makes Reka re-highlight and,
  // when virtualized, scroll to the top)
  listboxRef.value?.onValueChange(value)
}

const onListUpdate = (value: unknown) => {
  if (multiple.value) {
    selection.value = Array.isArray(value) ? (value as ListBoxValue[]) : []
  } else {
    // Reka toggles a re-picked option off; RAC Select keeps it
    if (value !== undefined) selection.value = value as ListBoxValue
    setOpen(false)
  }

  commitValidation()
}

const clear = () => {
  if (disabled.value || isPlaceholder.value) return
  clearSelection()
  commitValidation()
  emit('clear')
}

// ---- Trigger ----------------------------------------------------------------------------------------------------
// Interactive content (clear button, tag remove buttons) handles its own presses
const isOwnPress = (event: Event) => {
  const interactive = (event.target as Element | null)?.closest('button, [role=button], a, input')
  return !interactive || interactive === button.value
}

// RAC Select trigger: a mouse press toggles on press start (so press-drag-release can select), and the click that
// ends it is ignored. Touch, pen and keyboard toggle on click.
let mousePress = false
const onTriggerPointerdown = (event: PointerEvent) => {
  mousePress = false

  if (disabled.value || event.pointerType !== 'mouse' || event.button !== 0 || !isOwnPress(event))
    return

  mousePress = true
  button.value?.focus()
  setOpen(!isOpen.value, null)
}

const onTriggerMousedown = (event: MouseEvent) => {
  // Focus stays where the press put it (the button, or the search field once open)
  if (mousePress) event.preventDefault()
}

const onTriggerClick = (event: MouseEvent) => {
  if (disabled.value || !isOwnPress(event)) return

  if (mousePress && event.detail !== 0) {
    mousePress = false
    return
  }

  setOpen(!isOpen.value, event.detail === 0 ? 'first' : null)
}

const pressRelease = usePressRelease()

// Typing on the closed trigger selects the next option whose text starts with the typed string (see `TypeaheadStart`)
const typeahead = useTypeahead({ start: 'next' })
const onButtonKeydown = (event: KeyboardEvent) => {
  if (disabled.value) return

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    setOpen(true, event.key === 'ArrowDown' ? 'first' : 'last')
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    setOpen(!isOpen.value, 'first')
  } else if (
    (event.key === 'Backspace' || event.key === 'Delete') &&
    props.clearable &&
    !isOpen.value
  ) {
    event.preventDefault()
    clear()
  } else {
    typeahead.onKeydown(
      event,
      () => ({
        items: options.value,
        text: itemText,
        disabled: (item) => !!item.disabled,
        isCurrent: (item) => item.value === selectedValues.value[0],
      }),
      (match) => {
        if (!multiple.value) {
          selection.value = match.value
          commitValidation()
        }
      },
    )
  }
}

// RAC Group states
const hovered = ref(false)
const focusWithin = ref(false)
const focusVisible = ref(false)
const onFocusIn = (event: FocusEvent) => {
  focusWithin.value = true

  focusVisible.value =
    event.target === button.value && button.value?.matches(':focus-visible') === true
}

const onFocusOut = (event: FocusEvent) => {
  if (event.relatedTarget instanceof Node && trigger.value?.contains(event.relatedTarget)) return
  focusWithin.value = false
  focusVisible.value = false
}

// ---- Validation -------------------------------------------------------------------------------------------------
const root = useTemplateRef<HTMLElement>('root')
const { validation, commitValidation } = useFieldValidation<AutocompleteValue>({
  formField: props,
  value: () => selection.value,
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value,
  onReset: reset,
})

const invalid = computed(() => validation.value.isInvalid)

const onHiddenInvalid = () => {
  requestAnimationFrame(() => {
    if (
      document.activeElement instanceof HTMLSelectElement &&
      root.value?.contains(document.activeElement)
    )
      button.value?.focus({ focusVisible: true } as FocusOptions)
  })
}

// ---- Ids / ARIA -------------------------------------------------------------------------------------------------
const attrs = useAttrs()

const { id, labelId, hasLabel, describedBy, FieldLabel, FieldDescription, FieldError } =
  useFieldChrome({
    props,
    slots,
    invalid,
    validation,
    disabled,
    required: () => props.required,
  })

const valueId = computed(() => `${id.value}-value`)
const listboxId = computed(() => `${id.value}-listbox`)
const searchId = computed(() => `${id.value}-search`)

// RAC useSelect: the label (then any `aria-labelledby`) names the field; a bare `aria-label` on the trigger is
// referenced by the trigger's own id, so it still counts next to the value
const fieldLabelledBy = computed(
  () =>
    [hasLabel.value ? labelId.value : undefined, attrs['aria-labelledby'] as string | undefined]
      .filter(Boolean)
      .join(' ') || undefined,
)

const selfLabelledBy = computed(() =>
  attrs['aria-label'] && !fieldLabelledBy.value ? id.value : undefined,
)

const buttonLabelledBy = computed(() =>
  [valueId.value, fieldLabelledBy.value, selfLabelledBy.value].filter(Boolean).join(' '),
)

const popupLabelledBy = computed(() => fieldLabelledBy.value ?? selfLabelledBy.value)
const listLabelledBy = computed(() =>
  [listboxId.value, popupLabelledBy.value].filter(Boolean).join(' '),
)

const rootAttrs = computed(() => {
  const { 'aria-label': _label, 'aria-labelledby': _labelledby, ...rest } = attrs
  return rest
})

// ---- Classes ----------------------------------------------------------------------------------------------------
const ui = useComponentUI('autocomplete', theme, () => ({
  variant: props.variant,
  fullWidth: props.fullWidth,
}))

const listBoxUi = useComponentUI('listBox', listBoxTheme, () => ({}))

const searchUi = useComponentUI('searchField', searchFieldTheme, () => ({
  variant: 'secondary',
  fullWidth: false,
}))

const valueIndicatorClass = (item: ListBoxItem) => {
  return (listBoxUi.value.indicator as (options?: { variant?: string }) => string)({
    variant: item.variant,
  })
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

// One stable object (reactive unwraps the refs): a fresh object per change would re-render every option
const virtualFocus = reactive({ keyboard: keyboardModality, value: focusedKey })

// The option under the pointer, from the `id` its attrs write
const itemById = computed(() => new Map(options.value.map((item) => [optionId(item.value), item])))
const eventItem = (event: Event) => {
  return itemById.value.get((event.currentTarget as HTMLElement).id)
}

// RAC `shouldFocusOnHover`: hover moves focus unless the last interaction was a keyboard one
const onOptionPointermove = (event: PointerEvent) => {
  const item = eventItem(event)
  if (
    item &&
    !keyboardModality.value &&
    focusedKey.value !== item.value &&
    !item.disabled &&
    !disabled.value
  )
    setFocusKey(item.value, false)
}

// Pointer selection focuses the picked option (it stays focused in multiple mode)
const onOptionPointerdown = (event: PointerEvent) => {
  const item = eventItem(event)
  if (item && !item.disabled && !disabled.value) setFocusKey(item.value, false)
}

// No closures per row: options re-render only when their own props change
const optionAttrs = (row: CollectionRow) => {
  return {
    id: optionId(row.item.value),
    onPointermove: onOptionPointermove,
    onPointerdown: onOptionPointerdown,
  }
}

watch(isOpen, (value) => {
  if (!value) focusedKey.value = null
})

watch(disabled, (disabled) => {
  if (disabled) setOpen(false)
})
</script>
