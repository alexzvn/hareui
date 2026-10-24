<template>
  <Form class="flex w-[280px] flex-col gap-4" @submit="handleSubmit">
    <SearchField
      v-model="value"
      required
      :invalid="isInvalid"
      full-width
      name="search"
      label="Search products"
      placeholder="Search products..."
      :error-message="`Search query must be at least ${MIN_LENGTH} characters`"
      :description="`Enter at least ${MIN_LENGTH} characters to search`"
    />
    <Button
      class="w-full"
      :disabled="value.length < MIN_LENGTH"
      :pending="isSubmitting"
      type="submit"
      variant="primary"
    >
      <template v-if="isSubmitting">
        <Spinner color="current" size="sm" />
        Searching...
      </template>
      <template v-else> Search </template>
    </Button>
  </Form>
</template>

<script setup lang="ts">
import { Button, Form, SearchField, Spinner } from '@hareui/vue'
import { computed, ref } from 'vue'

const value = ref('')
const isSubmitting = ref(false)
const MIN_LENGTH = 3
const isInvalid = computed(() => value.value.length > 0 && value.value.length < MIN_LENGTH)

function handleSubmit(e: Event) {
  e.preventDefault()
  if (value.value.length < MIN_LENGTH) return
  isSubmitting.value = true
  // Simulate API call
  setTimeout(() => {
    console.log('Search submitted:', { query: value.value })
    value.value = ''
    isSubmitting.value = false
  }, 1500)
}
</script>
