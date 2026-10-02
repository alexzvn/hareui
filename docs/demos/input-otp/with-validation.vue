<script setup lang="ts">
import { Button, Form, InputOtp } from 'herouse'
import { ref } from 'vue'

const value = ref('')
const isInvalid = ref(false)

function onSubmit(e: Event) {
  e.preventDefault()

  if (value.value !== '123456') {
    isInvalid.value = true
    return
  }

  isInvalid.value = false
  value.value = ''
  // eslint-disable-next-line no-console
  console.log('Code verified successfully!')
}

function handleChange(val: string) {
  value.value = val
  isInvalid.value = false
}
</script>

<template>
  <Form class="flex w-[280px] flex-col gap-2" @submit="onSubmit">
    <InputOtp
      :model-value="value"
      label="Verify account"
      description="Hint: The code is 123456"
      name="code"
      :invalid="isInvalid"
      error-message="Invalid code. Please try again."
      :groups="[3, 3]"
      @update:model-value="handleChange"
    />
    <Button :disabled="value.length !== 6" type="submit">
      Submit
    </Button>
  </Form>
</template>
