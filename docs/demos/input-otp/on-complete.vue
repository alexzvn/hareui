<template>
  <Form class="flex w-[280px] flex-col gap-2" @submit="handleSubmit">
    <InputOtp
      v-model="value"
      label="Verify account"
      :groups="[3, 3]"
      @complete="handleComplete"
      @update:model-value="isComplete = false"
    />
    <Button
      class="mt-2 w-full"
      :disabled="!isComplete"
      :pending="isSubmitting"
      type="submit"
      variant="primary"
    >
      <template v-if="isSubmitting">
        <Spinner color="current" size="sm" />
        Verifying...
      </template>
      <template v-else> Verify Code </template>
    </Button>
  </Form>
</template>

<script setup lang="ts">
import { Button, Form, InputOtp, Spinner } from '@hareui/vue'
import { ref } from 'vue'

const value = ref('')
const isComplete = ref(false)
const isSubmitting = ref(false)

function handleComplete(code: string) {
  isComplete.value = true
  // eslint-disable-next-line no-console
  console.log('Code complete:', code)
}

function handleSubmit(e: Event) {
  e.preventDefault()
  isSubmitting.value = true
  // Simulate API call
  setTimeout(() => {
    isSubmitting.value = false
    value.value = ''
    isComplete.value = false
  }, 2000)
}
</script>
