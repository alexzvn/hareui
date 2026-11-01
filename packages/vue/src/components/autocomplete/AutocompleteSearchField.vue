<template>
  <div data-slot="search-field" :data-empty="value ? undefined : 'true'" :class="searchUi.base()">
    <div
      data-slot="search-field-group"
      role="group"
      :data-focus-within="'true'"
      :data-focus-visible="isFocusVisible ? 'true' : undefined"
      :class="searchUi.group()"
    >
      <span data-slot="search-field-search-icon" :class="searchUi.searchIcon()">
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
        :id="id"
        ref="input"
        type="search"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        enterkeyhint="go"
        aria-autocomplete="list"
        :aria-label="label"
        :aria-controls="listboxId"
        :aria-activedescendant="activeDescendant"
        :placeholder="placeholder"
        :value="value"
        data-slot="search-field-input"
        :class="searchUi.input()"
        @input="onInput"
        @focus="onFocus"
        @blur="isFocusVisible = false"
      />
      <slot name="trailing" />
      <CloseButton
        data-slot="search-field-clear-button"
        :aria-label="t('autocomplete.clearSearch')"
        tabindex="-1"
        :class="searchUi.clearButton()"
        @mousedown.prevent
        @click="onClear"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VNode } from 'vue'
import { ref, useTemplateRef } from 'vue'

import CloseButton from '@/components/close-button/CloseButton.vue'
import searchFieldTheme from '@/components/search-field/theme'
import { useComponentUI } from '@/composables/useComponentUI'
import { useLocale } from '@/composables/useLocale'

import type { AutocompleteProps } from './Autocomplete.types'

// Autocomplete's search field (HeroUI `Autocomplete.Filter` + `SearchField`), rendered inside the popover. Private.
const { t } = useLocale()

const props = defineProps<{
  id: string
  value: string
  label: string
  placeholder: string
  listboxId: string
  activeDescendant?: string
  ui?: AutocompleteProps['ui']
}>()

const emit = defineEmits<{ 'update:value': [value: string]; clear: [] }>()

defineSlots<{ trailing?: () => VNode[] }>()

const input = useTemplateRef<HTMLInputElement>('input')
const isFocusVisible = ref(false)

const searchUi = useComponentUI('searchField', {
  theme: searchFieldTheme,
  variantProps: () => ({
    variant: 'secondary',
    fullWidth: false,
  }),
  // Autocomplete prefixes the search field's slots (`ui.searchField` is its root).
  props: {
    get ui() {
      return {
        base: props.ui?.searchField,
        group: props.ui?.searchGroup,
        searchIcon: props.ui?.searchIcon,
        input: props.ui?.searchInput,
        clearButton: props.ui?.searchClearButton,
      }
    },
  },
})

const onInput = (event: Event) => {
  emit('update:value', (event.target as HTMLInputElement).value)
}

const onFocus = (event: FocusEvent) => {
  isFocusVisible.value = (event.target as Element).matches(':focus-visible')
}

const onClear = () => {
  input.value?.focus()
  emit('clear')
}

defineExpose({
  /** The search input, which keeps DOM focus while options get virtual focus. */
  input,
})
</script>
