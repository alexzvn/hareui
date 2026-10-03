<script setup lang="ts">
import { Button, Form, Select } from '@hareui/vue'
import { ref } from 'vue'

const states = ['Florida', 'Delaware', 'California', 'Texas', 'New York', 'Washington'].map(label => ({ value: label.toLowerCase().replace(' ', '-'), label }))
const single = ref<string | null>(null)
const multi = ref<string[]>(['texas'])
const open = ref(false)
const submitted = ref('')
function onSubmit(event: SubmitEvent) {
  submitted.value = JSON.stringify(Object.fromEntries(new FormData(event.currentTarget as HTMLFormElement)))
}
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">
      Select
    </h1>
    <section class="flex flex-wrap items-start gap-8">
      <div class="w-[256px]">
        <Select v-model="single" data-test="single" clearable label="Single" :items="states" />
        <p data-test="single-value">{{ single }}</p>
      </div>
      <div class="w-[256px]">
        <Select v-model="multi" data-test="multi" label="Multiple" selection-mode="multiple" :items="states" />
        <p data-test="multi-value">{{ multi.join(',') }}</p>
      </div>
      <div class="w-[256px]">
        <Select v-model:open="open" data-test="open" label="Controlled open" :items="states" />
        <Button size="sm" @click="open = !open">
          Toggle
        </Button>
      </div>
      <Form class="flex w-[256px] flex-col gap-2" @submit.prevent="onSubmit">
        <Select required data-test="form" label="Required" name="state" :items="states" />
        <Button type="submit">
          Submit
        </Button>
        <p data-test="submitted">{{ submitted }}</p>
      </Form>
      <Select class="w-[256px]" disabled label="Disabled" default-value="texas" :items="states" />
      <Select class="w-[256px]" invalid label="Invalid" description="Hidden while invalid" error-message="Pick one" :items="states" />
    </section>
  </div>
</template>
