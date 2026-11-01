<template>
  <Form class="flex w-80 flex-col gap-4" :state="state" :validate="validate" @submit="onSubmit">
    <FormField
      label="Workspace URL"
      name="slug"
      hint="lowercase"
      help="Letters, numbers and dashes."
    >
      <InputGroup v-model="state.slug" prefix="hare.dev/" full-width />
    </FormField>
    <FormField label="Seats" name="seats" description="How many people will join?">
      <NumberField v-model="state.seats" :min="1" full-width />
    </FormField>
    <Button type="submit" class="self-start">Create workspace</Button>
  </Form>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@hareui/vue'
import { Button, Form, FormField, InputGroup, NumberField } from '@hareui/vue'
import { reactive } from 'vue'

type State = {
  slug?: string
  seats?: number
}

const state = reactive<State>({})

// Errors are matched to each FormField by its `name`
const validate = (state: Partial<State>): FormError[] => {
  const errors: FormError[] = []
  if (!state.slug || !/^[a-z0-9-]+$/.test(state.slug))
    errors.push({ name: 'slug', message: 'Use lowercase letters, numbers and dashes.' })

  if (!state.seats) errors.push({ name: 'seats', message: 'Add at least one seat.' })

  return errors
}

const onSubmit = (event: FormSubmitEvent<State>) => {
  alert(`Created: ${JSON.stringify(event.data)}`)
}
</script>
