<template>
  <Form class="flex w-96 flex-col gap-4" :schema="schema" :state="state" @submit="onSubmit">
    <TextField v-model="state.name" name="name" label="Name" />
    <Checkbox v-model="state.news" name="news" label="Subscribe to the newsletter" />
    <!-- Validated with the parent form only while it is rendered -->
    <Form v-if="state.news" nested :schema="newsSchema">
      <TextField v-model="state.email" name="email" type="email" label="Email" />
    </Form>
    <Button type="submit" class="self-start"> Submit </Button>
  </Form>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@hareui/vue'
import { Button, Checkbox, Form, TextField } from '@hareui/vue'
import { reactive } from 'vue'
import * as z from 'zod'

const schema = z.object({
  name: z
    .string('Name is required')
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters'),
  news: z.boolean().optional(),
})

const newsSchema = z.object({
  email: z.email('Please enter a valid email address'),
})

type Schema = z.output<typeof schema> & Partial<z.output<typeof newsSchema>>

const state = reactive<Partial<Schema>>({ news: false })

const onSubmit = (event: FormSubmitEvent<Schema>) => {
  alert(`Valid: ${JSON.stringify(event.data, null, 2)}`)
}
</script>
