<script setup lang="ts">
import type { CheckboxGroupItem } from '@hareui/vue'
import { Checkbox, CheckboxGroup } from '@hareui/vue'
import { computed, ref } from 'vue'

const selected = ref<string[]>(['coding'])
const allOptions = ['coding', 'design', 'writing']

const indeterminate = computed(
  () => selected.value.length > 0 && selected.value.length < allOptions.length,
)
const allSelected = computed(() => selected.value.length === allOptions.length)

function onToggleAll(isSelected: boolean | 'indeterminate') {
  selected.value = isSelected === true ? [...allOptions] : []
}

const items: CheckboxGroupItem[] = [
  { value: 'coding', label: 'Coding' },
  { value: 'design', label: 'Design' },
  { value: 'writing', label: 'Writing' },
]
</script>

<template>
  <div>
    <Checkbox
      name="select-all"
      label="Select all"
      :model-value="indeterminate ? 'indeterminate' : allSelected"
      @update:model-value="onToggleAll"
    />
    <div class="ms-6 flex flex-col gap-2">
      <CheckboxGroup v-model="selected" :items="items" />
    </div>
  </div>
</template>
