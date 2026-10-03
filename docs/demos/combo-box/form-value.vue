<script setup lang="ts">
import { Button, ComboBox, Form } from '@hareui/vue'
import { ref } from 'vue'

const animals = [
  { value: 'aardvark', label: 'Aardvark' },
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
  { value: 'kangaroo', label: 'Kangaroo' },
  { value: 'panda', label: 'Panda' },
  { value: 'snake', label: 'Snake' },
]

const message = ref<string | null>(null)

function onSubmit(event: SubmitEvent) {
  const formData = new FormData(event.currentTarget as HTMLFormElement)
  message.value = `Key: ${formData.get('animal')}. Text: ${formData.get('animal-text')}.`
}
</script>

<template>
  <Form class="flex w-[256px] flex-col gap-4" @submit.prevent="onSubmit">
    <ComboBox required class="w-full" form-value="key" name="animal" label="Animal" placeholder="Select an animal..." description="Submits the selected key" :items="animals" />
    <ComboBox required class="w-full" form-value="text" name="animal-text" label="Animal (text)" placeholder="Select an animal..." description="Submits the selected text" :items="animals" />
    <Button class="w-fit" type="submit">
      Submit
    </Button>
    <p v-if="message" class="text-sm text-muted">
      {{ message }}
    </p>
  </Form>
</template>
