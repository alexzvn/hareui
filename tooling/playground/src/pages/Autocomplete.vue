<script setup lang="ts">
import { Autocomplete, Button, Form, Spinner, Surface } from '@hareui/vue'
import { ref } from 'vue'

const states = ['Florida', 'Delaware', 'California', 'Texas', 'New York', 'Washington'].map(label => ({ value: label.toLowerCase().replace(' ', '-'), label }))
const sections = [
  { type: 'section' as const, label: 'South', items: [{ value: 'florida', label: 'Florida' }, { value: 'texas', label: 'Texas' }] },
  { type: 'separator' as const },
  { type: 'section' as const, label: 'West', items: [{ value: 'california', label: 'California' }, { value: 'washington', label: 'Washington' }] },
]
const single = ref<string | null>(null)
const multi = ref<string[]>(['texas'])
const open = ref(false)
const query = ref('')
const submitted = ref('')
function onSubmit(event: SubmitEvent) {
  submitted.value = JSON.stringify(Object.fromEntries(new FormData(event.currentTarget as HTMLFormElement)))
}
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">
      Autocomplete
    </h1>
    <section class="flex flex-wrap items-start gap-8">
      <div class="w-[256px]">
        <Autocomplete v-model="single" clearable label="Single" placeholder="Select one" search-placeholder="Search states..." :items="states">
          <template #empty>
            No results found
          </template>
        </Autocomplete>
        <p class="text-sm text-muted">
          {{ single }}
        </p>
      </div>
      <div class="w-[256px]">
        <Autocomplete v-model="multi" clearable label="Multiple" selection-mode="multiple" placeholder="Select states" :items="states" />
        <p class="text-sm text-muted">
          {{ multi.join(', ') }}
        </p>
      </div>
      <div class="w-[256px]">
        <Autocomplete v-model:open="open" v-model:input-value="query" label="Controlled open + query" :items="states" />
        <Button size="sm" @click="open = !open">
          Toggle
        </Button>
        <p class="text-sm text-muted">
          query: {{ query }}
        </p>
      </div>
      <Autocomplete class="w-[256px]" label="Sections" :items="sections" />
      <Autocomplete class="w-[256px]" label="No search field" :search="false" :items="states" />
    </section>
    <section class="flex flex-wrap items-start gap-8">
      <Autocomplete class="w-[256px]" label="Secondary" variant="secondary" :items="states" />
      <Autocomplete class="w-[256px]" label="Disabled" disabled default-value="texas" clearable :items="states" />
      <Autocomplete class="w-[256px]" label="Invalid" invalid description="Hidden while invalid" error-message="Please select a state" :items="states" />
      <Autocomplete class="w-[256px]" label="Description" description="Select your state of residence" :items="states" />
      <Autocomplete class="w-[256px]" label="Empty collection" allows-empty-collection :items="[]">
        <template #empty>
          No results found
        </template>
      </Autocomplete>
      <Autocomplete class="w-[256px]" label="Search trailing slot" :items="states">
        <template #search-trailing>
          <Spinner size="sm" class="absolute end-2 top-1/2 -translate-y-1/2" />
        </template>
      </Autocomplete>
    </section>
    <section class="flex flex-wrap items-start gap-8">
      <Autocomplete class="w-[256px]" label="Custom indicator" :items="states">
        <template #indicator>
          <svg class="size-3" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2 4 6h8L8 2Zm0 12 4-4H4l4 4Z" /></svg>
        </template>
      </Autocomplete>
      <Autocomplete class="w-[256px]" label=":ui override" :items="states" :ui="{ trigger: 'rounded-xl bg-accent-soft', value: 'font-semibold', popover: 'rounded-xl' }" />
      <div class="w-[400px]">
        <Autocomplete full-width label="Full width" :items="states" />
      </div>
    </section>
    <Surface class="w-[320px] rounded-3xl p-6">
      <Form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <Autocomplete required name="state" variant="secondary" label="Required" :items="states" />
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
