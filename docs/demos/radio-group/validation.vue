<script setup lang="ts">
import { Button, RadioGroup } from 'herouse'
import { ref } from 'vue'

const value = ref<string>()
const invalid = ref(false)
const message = ref<string>()

const items = [
  { value: 'starter', label: 'Starter', description: 'For side projects and small teams' },
  { value: 'pro', label: 'Pro', description: 'Advanced reporting and analytics' },
  { value: 'teams', label: 'Teams', description: 'Share access with up to 10 teammates' },
]

function onSubmit() {
  if (!value.value) {
    invalid.value = true
    message.value = undefined
    return
  }
  invalid.value = false
  message.value = `Your chosen plan is: ${value.value}`
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
    <RadioGroup
      v-model="value"
      required
      :invalid="invalid"
      name="plan-validation"
      label="Subscription plan"
      error-message="Choose a subscription before continuing."
      :items="items"
    />
    <Button class="mt-2 w-fit" type="submit">
      Submit
    </Button>
    <p v-if="message" class="text-sm text-muted">
      {{ message }}
    </p>
  </form>
</template>
