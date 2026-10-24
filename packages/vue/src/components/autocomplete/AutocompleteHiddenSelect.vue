<template>
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
      :required="required"
      :disabled="disabled"
      :autocomplete="autocomplete"
      @invalid="emit('invalid')"
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
</template>

<script setup lang="ts">
import type { ListBoxItem, ListBoxValue } from '@/components/list-box/ListBox.types'
import { itemText } from '@/components/list-box/listBoxCollection'

// Autocomplete's visually hidden native <select>. Private.
defineProps<{
  name?: string
  multiple: boolean
  required: boolean
  disabled: boolean
  autocomplete?: string
  options: ListBoxItem[]
  isSelected: (value: ListBoxValue) => boolean
}>()

const emit = defineEmits<{ invalid: [] }>()
</script>
