<template>
  <Form class="flex flex-col gap-4" @submit="onSubmit">
    <RadioGroup
      required
      name="plan-validation"
      label="Subscription plan"
      error-message="Choose a subscription before continuing."
      :items="items"
    />
    <Button class="mt-2 w-fit" type="submit"> Submit </Button>
    <p v-if="!!message" class="text-sm text-muted">
      {{ message }}
    </p>
  </Form>
</template>

<script setup lang="ts">
import type { RadioGroupItem } from '@hareui/vue'
import { Button, Form, RadioGroup } from '@hareui/vue'
import { ref } from 'vue'

const message = ref<string | null>(null)

const items: RadioGroupItem[] = [
  { value: 'starter', label: 'Starter', description: 'For side projects and small teams' },
  { value: 'pro', label: 'Pro', description: 'Advanced reporting and analytics' },
  { value: 'teams', label: 'Teams', description: 'Share access with up to 10 teammates' },
]

function onSubmit(e: Event) {
  e.preventDefault()
  const formData = new FormData(e.currentTarget as HTMLFormElement)
  const value = formData.get('plan-validation')
  message.value = `Your chosen plan is: ${value}`
}
</script>
