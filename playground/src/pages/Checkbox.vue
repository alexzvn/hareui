<script setup lang="ts">
import { Checkbox } from 'herouse'
import { ref } from 'vue'

const controlled = ref(true)
const indeterminate = ref<boolean | 'indeterminate'>('indeterminate')
const variants = ['primary', 'secondary'] as const
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">Checkbox</h1>

    <section v-for="variant in variants" :key="variant" class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">{{ variant }}</h2>
      <Checkbox :variant="variant" label="Accept terms" description="Read our terms carefully" />
      <Checkbox :variant="variant" default-value label="Default selected" />
      <Checkbox :variant="variant" default-value="indeterminate" label="Indeterminate" />
      <Checkbox :variant="variant" disabled label="Disabled" description="Cannot be edited" />
      <Checkbox :variant="variant" disabled default-value label="Disabled checked" />
      <Checkbox :variant="variant" required label="Required" />
      <Checkbox :variant="variant" invalid required label="Invalid" error-message="You must accept to continue" />
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <Checkbox v-model="controlled" id="controlled" label="Controlled" />
      <p class="text-sm text-muted self-center">Status: {{ controlled ? 'checked' : 'unchecked' }}</p>
      <Checkbox v-model="indeterminate" id="select-all" label="Select all" description="Clears to boolean on click" />
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <Checkbox name="form-item" value="on" label="Named form field" />
      <div class="flex items-center gap-3">
        <Checkbox id="external" />
        <label for="external" class="text-sm">External label element</label>
      </div>
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <Checkbox default-value label="Custom indicator">
        <template #indicator="{ state }">
          <svg v-if="state === 'checked'" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12.62 20.81c-.34.12-.9.12-1.24 0C8.48 19.82 2 15.69 2 8.69 2 5.6 4.49 3.1 7.56 3.1c1.82 0 3.43.88 4.44 2.24a5.53 5.53 0 0 1 4.44-2.24C19.51 3.1 22 5.6 22 8.69c0 7-6.48 11.13-9.38 12.12Z"
              fill="currentColor"
            />
          </svg>
        </template>
      </Checkbox>
      <Checkbox label=":ui override" :ui="{ control: 'size-5 rounded-full before:rounded-full' }" />
      <Checkbox>
        <template #label="{ state }">
          Slot label (<em>{{ state }}</em>)
        </template>
        <template #description>
          Slot description
        </template>
      </Checkbox>
    </section>
  </div>
</template>
