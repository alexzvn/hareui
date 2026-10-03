<script setup lang="ts">
import { Button, ComboBox, Form, Surface } from '@hareui/vue'
import { ref } from 'vue'

const animals = ['Aardvark', 'Cat', 'Dog', 'Kangaroo', 'Panda', 'Snake'].map(label => ({ value: label.toLowerCase(), label }))
const sections = [
  { type: 'section' as const, label: 'North America', items: ['United States', 'Canada', 'Mexico'].map(c => ({ value: c, label: c })) },
  { type: 'separator' as const },
  { type: 'section' as const, label: 'Europe', items: ['France', 'Germany', 'Spain'].map(c => ({ value: c, label: c })) },
]
const single = ref<string | null>('cat')
const text = ref('')
const multi = ref<string[]>(['dog'])
const open = ref(false)
const submitted = ref('')
function onSubmit(event: SubmitEvent) {
  submitted.value = JSON.stringify(Object.fromEntries(new FormData(event.currentTarget as HTMLFormElement)))
}
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">
      ComboBox
    </h1>
    <section class="flex flex-wrap items-start gap-8">
      <div class="w-[256px]">
        <ComboBox v-model="single" v-model:input-value="text" label="Controlled" placeholder="Search animals..." :items="animals" />
        <p class="text-sm text-muted">
          value: {{ single }} / text: {{ text }}
        </p>
      </div>
      <ComboBox v-model="multi" class="w-[256px]" label="Multiple" selection-mode="multiple" value-placeholder="No animals selected" placeholder="Search animals..." :items="animals" />
      <div class="w-[256px]">
        <ComboBox v-model:open="open" label="Controlled open" placeholder="Search animals..." :items="animals" />
        <Button size="sm" @click="open = !open">
          Toggle
        </Button>
      </div>
      <ComboBox class="w-[256px]" label="Sections" placeholder="Search countries..." :items="sections" />
    </section>
    <section class="flex flex-wrap items-start gap-8">
      <ComboBox class="w-[256px]" label="Secondary" variant="secondary" placeholder="Search animals..." :items="animals" />
      <ComboBox class="w-[256px]" label="Disabled" disabled default-value="cat" :items="animals" />
      <ComboBox class="w-[256px]" label="Read only" readonly default-value="cat" :items="animals" />
      <ComboBox class="w-[256px]" label="Invalid" invalid description="Hidden while invalid" error-message="Please select an animal" :items="animals" />
      <ComboBox class="w-[256px]" label="Menu trigger: input" menu-trigger="input" description="Opens when typing" :items="animals" />
      <ComboBox class="w-[256px]" label="Menu trigger: manual" menu-trigger="manual" description="Trigger button or arrow keys" :items="animals" />
      <ComboBox class="w-[256px]" label="Custom value" allows-custom-value description="Type anything" :items="animals" />
      <ComboBox class="w-[256px]" label="Empty collection" allows-empty-collection :items="animals">
        <template #empty>
          No results found
        </template>
      </ComboBox>
    </section>
    <section class="flex flex-wrap items-start gap-8">
      <ComboBox class="w-[256px]" label="Custom indicator" :items="animals">
        <template #indicator>
          <svg class="size-3" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2 4 6h8L8 2Zm0 12 4-4H4l4 4Z" /></svg>
        </template>
      </ComboBox>
      <ComboBox class="w-[256px]" label=":ui override" :items="animals" :ui="{ inputGroup: 'rounded-xl bg-accent-soft', trigger: 'text-accent', popover: 'rounded-xl' }" />
      <div class="w-[400px]">
        <ComboBox full-width label="Full width" :items="animals" />
      </div>
    </section>
    <Surface class="w-[320px] rounded-3xl p-6">
      <Form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <ComboBox required name="animal" variant="secondary" label="Required (key)" :items="animals" />
        <ComboBox required name="animal-text" form-value="text" label="Required (text)" :items="animals" />
        <Button type="submit">
          Submit
        </Button>
        <p class="text-sm text-muted">
          {{ submitted }}
        </p>
      </Form>
    </Surface>
  </div>
</template>
