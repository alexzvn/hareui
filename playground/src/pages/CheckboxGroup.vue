<script setup lang="ts">
import { Checkbox, CheckboxGroup, Label } from '@hareui/vue'
import { computed, ref } from 'vue'

const variants = ['primary', 'secondary'] as const

const items = [
  { value: 'coding', label: 'Coding', description: 'Love building software' },
  { value: 'design', label: 'Design', description: 'Enjoy creating beautiful interfaces' },
  { value: 'writing', label: 'Writing', description: 'Passionate about content creation', disabled: true },
]

const controlled = ref<string[]>(['coding', 'design'])
const picked = ref<string[]>([])

const allOptions = ['coding', 'design', 'writing']
const selected = ref<string[]>(['coding'])
const indeterminate = computed(() => selected.value.length > 0 && selected.value.length < allOptions.length)
const allSelected = computed(() => selected.value.length === allOptions.length)
function toggleAll(value: boolean | 'indeterminate') {
  selected.value = value === true ? [...allOptions] : []
}
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">
      CheckboxGroup
    </h1>

    <section v-for="variant in variants" :key="variant" class="flex flex-wrap items-start gap-10">
      <h2 class="w-24 text-sm text-muted">
        {{ variant }}
      </h2>
      <CheckboxGroup :variant="variant" name="interests" label="Select your interests" description="Choose all that apply" :items="items" />
    </section>

    <section class="flex flex-wrap items-start gap-10">
      <h2 class="w-24 text-sm text-muted">
        disabled
      </h2>
      <CheckboxGroup disabled name="interests-disabled" label="Features" description="Feature selection is temporarily disabled" :items="items" />
    </section>

    <section class="flex flex-wrap items-start gap-10">
      <h2 class="w-24 text-sm text-muted">
        required + invalid
      </h2>
      <CheckboxGroup
        required
        name="preferences"
        label="Preferences"
        invalid
        error-message="Please select at least one preference."
        :items="items"
      />
    </section>

    <section class="flex flex-wrap items-start gap-10">
      <h2 class="w-24 text-sm text-muted">
        v-model
      </h2>
      <CheckboxGroup v-model="controlled" name="skills" label="Your skills" :items="items" />
      <p class="text-sm text-muted">
        Selected: {{ controlled.join(', ') || 'None' }}
      </p>
    </section>

    <section class="flex flex-wrap items-start gap-10">
      <h2 class="w-24 text-sm text-muted">
        indeterminate (parent checkbox)
      </h2>
      <div>
        <Checkbox
          name="select-all"
          label="Select all"
          :model-value="indeterminate ? 'indeterminate' : allSelected"
          @update:model-value="toggleAll"
        />
        <div class="ms-6">
          <CheckboxGroup v-model="selected" :items="items.map(({ value, label }) => ({ value, label }))" />
        </div>
      </div>
    </section>

    <section class="flex flex-wrap items-start gap-10">
      <h2 class="w-24 text-sm text-muted">
        slots
      </h2>
      <CheckboxGroup v-model="picked" name="skills-slots" :items="items">
        <template #label>
          Slot <em>label</em>
        </template>
        <template #description>
          Slot description
        </template>
        <template #item-label="{ item }">
          <strong>{{ item.label }}</strong>
        </template>
        <template #item-description="{ item }">
          (custom) {{ item.description }}
        </template>
        <template #indicator="{ checked }">
          <span v-if="checked" class="text-[8px] leading-none text-background">✓</span>
        </template>
      </CheckboxGroup>
    </section>

    <section class="flex flex-wrap items-start gap-10">
      <h2 class="w-24 text-sm text-muted">
        :ui override
      </h2>
      <CheckboxGroup
        name="channels"
        label=":ui override"
        :items="items"
        :ui="{ base: 'gap-3 **:data-[slot=checkbox]:mt-0', control: 'bg-success-soft before:bg-success' }"
      />
    </section>

    <section class="flex flex-wrap items-start gap-10">
      <h2 class="w-24 text-sm text-muted">
        external label
      </h2>
      <div class="flex flex-col gap-1">
        <Label for="group-ext">External label</Label>
        <CheckboxGroup id="group-ext" name="group-ext" :items="items" />
      </div>
    </section>
  </div>
</template>
