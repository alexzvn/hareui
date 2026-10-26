<template>
  <Form class="flex w-[256px] flex-col gap-4" @submit.prevent="onSubmit">
    <ComboBox
      required
      class="w-full"
      name="animal"
      label="Favorite Animal"
      placeholder="Search animals..."
      :validate="validate"
      :items="animals"
    />
    <Button class="w-fit" type="submit"> Submit </Button>
  </Form>
</template>

<script setup lang="ts">
import type { ComboBoxValidationValue, ListBoxItem } from '@hareui/vue'
import { Button, ComboBox, Form } from '@hareui/vue'

const animals: ListBoxItem[] = [
  { value: 'aardvark', label: 'Aardvark' },
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
  { value: 'kangaroo', label: 'Kangaroo' },
  { value: 'panda', label: 'Panda' },
  { value: 'snake', label: 'Snake' },
]

const validate = (value: ComboBoxValidationValue) => {
  if (value.selectedKey == null) return 'Please select an animal'
  if (value.selectedKey === 'snake') return 'Snakes are not allowed'

  return true
}

const onSubmit = () => {
  alert('Form submitted successfully!')
}
</script>
