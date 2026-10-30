<template>
  <Form class="flex flex-col gap-4" @submit="onSubmit">
    <Rating
      required
      name="support"
      label="Support experience"
      description="Low scores ask for a short comment."
      :validate="(value) => (value < 3 ? 'Tell us what went wrong in the comment box.' : true)"
    />
    <Button class="w-fit" type="submit">Send feedback</Button>
    <p v-if="!!message" class="text-sm text-muted">{{ message }}</p>
  </Form>
</template>

<script setup lang="ts">
import { Button, Form, Rating } from '@hareui/vue'
import { ref } from 'vue'

const message = ref<string | null>(null)

const onSubmit = (e: Event) => {
  e.preventDefault()
  const formData = new FormData(e.currentTarget as HTMLFormElement)
  message.value = `Thanks! You rated support ${formData.get('support')} of 5.`
}
</script>
