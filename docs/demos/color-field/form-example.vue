<template>
  <Form class="flex w-[280px] flex-col gap-4" @submit="handleSubmit">
    <ColorField
      v-model="value"
      full-width
      required
      class="w-full"
      name="brand-color"
      label="Brand Color"
      placeholder="#000000"
      description="Choose your brand's primary color"
    >
      <template #prefix>
        <ColorSwatch :color="value" size="xs" />
      </template>
    </ColorField>
    <Button
      class="w-full"
      :disabled="!value"
      :pending="isSubmitting"
      type="submit"
      variant="primary"
    >
      {{ isSubmitting ? 'Saving...' : 'Save Color' }}
    </Button>
  </Form>
</template>

<script setup lang="ts">
import type { Color } from '@hareui/vue'
import { Button, ColorField, ColorSwatch, Form, colorToString } from '@hareui/vue'
import { ref } from 'vue'

const value = ref<Color>()
const isSubmitting = ref(false)

function handleSubmit(e: Event) {
  e.preventDefault()
  if (!value.value) return

  isSubmitting.value = true
  // Simulate API call
  setTimeout(() => {
    console.log('Color submitted:', { color: colorToString(value.value!, 'hex') })
    value.value = undefined
    isSubmitting.value = false
  }, 1500)
}
</script>
