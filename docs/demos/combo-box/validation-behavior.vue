<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Button, ComboBox, Form } from '@hareui/vue'
import { ref } from 'vue'

const animals: ListBoxItem[] = [
  { value: 'aardvark', label: 'Aardvark' },
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
  { value: 'kangaroo', label: 'Kangaroo' },
  { value: 'panda', label: 'Panda' },
  { value: 'snake', label: 'Snake' },
]

const nativeMessage = ref<string | null>(null)
const ariaMessage = ref<string | null>(null)
</script>

<template>
  <div class="flex flex-col gap-8">
    <Form class="flex w-[256px] flex-col gap-4" @submit.prevent="nativeMessage = 'Submitted with native validation.'">
      <ComboBox required class="w-full" name="animal" validation-behavior="native" label="Animal (native)" placeholder="Select an animal..." description="Blocks submission when the value is missing" :items="animals" />
      <Button class="w-fit" type="submit">
        Submit
      </Button>
      <p v-if="nativeMessage" class="text-sm text-muted">
        {{ nativeMessage }}
      </p>
    </Form>
    <Form class="flex w-[256px] flex-col gap-4" @submit.prevent="ariaMessage = 'Submitted with ARIA validation.'">
      <ComboBox required class="w-full" name="animal-aria" validation-behavior="aria" label="Animal (ARIA)" placeholder="Select an animal..." description="Shows errors in realtime and does not block submission" :items="animals" />
      <Button class="w-fit" type="submit">
        Submit
      </Button>
      <p v-if="ariaMessage" class="text-sm text-muted">
        {{ ariaMessage }}
      </p>
    </Form>
  </div>
</template>
