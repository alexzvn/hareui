<script setup lang="ts">
import { Button, Form, InputOtp, Link, Spinner } from '@hareui/vue'
import { ref } from 'vue'

const value = ref('')
const error = ref('')
const isSubmitting = ref(false)

function handleSubmit(e: Event) {
  e.preventDefault()
  error.value = ''

  if (value.value.length !== 6) {
    error.value = 'Please enter all 6 digits'
    return
  }

  isSubmitting.value = true
  // Simulate API call
  setTimeout(() => {
    if (value.value === '123456') {
      // eslint-disable-next-line no-console
      console.log('Code verified successfully!')
      value.value = ''
    } else {
      error.value = 'Invalid code. Please try again.'
    }
    isSubmitting.value = false
  }, 1500)
}
</script>

<template>
  <Form class="flex w-[280px] flex-col gap-4" @submit="handleSubmit">
    <InputOtp
      v-model="value"
      label="Two-factor authentication"
      description="Enter the 6-digit code from your authenticator app"
      :invalid="!!error"
      :error-message="error"
      :groups="[3, 3]"
      @update:model-value="error = ''"
    />
    <Button
      class="w-full"
      :disabled="value.length !== 6"
      :pending="isSubmitting"
      type="submit"
      variant="primary"
    >
      <template v-if="isSubmitting">
        <Spinner color="current" size="sm" />
        Verifying...
      </template>
      <template v-else> Verify </template>
    </Button>
    <div class="flex items-center justify-center gap-1">
      <p class="text-sm text-muted">Having trouble?</p>
      <Link class="text-sm text-foreground underline" href="#"> Use backup code </Link>
    </div>
  </Form>
</template>
