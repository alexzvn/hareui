<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Button, ComboBox, Form } from '@hareui/vue'

const animals: ListBoxItem[] = [
  { value: 'aardvark', label: 'Aardvark' },
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
  { value: 'kangaroo', label: 'Kangaroo' },
  { value: 'panda', label: 'Panda' },
  { value: 'snake', label: 'Snake' },
]

function onSubmit(event: SubmitEvent) {
  const data = Object.fromEntries(new FormData(event.currentTarget as HTMLFormElement))
  console.log('Form submitted:', data)
  alert('Form submitted successfully!')
}
</script>

<template>
  <Form class="flex w-[256px] flex-col gap-4" @submit.prevent="onSubmit">
    <ComboBox required class="w-full" name="animal" label="Favorite Animal" placeholder="Search animals..." :items="animals" />
    <Button type="submit">
      Submit
    </Button>
  </Form>
</template>
