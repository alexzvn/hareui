<template>
  <div class="flex flex-col gap-4">
    <RadioGroup v-model="scroll" orientation="horizontal" name="scroll" :items="items" />

    <Modal :scroll="scroll">
      <Button variant="secondary">
        Open Modal ({{ scroll.charAt(0).toUpperCase() + scroll.slice(1) }})
      </Button>
      <template #title> Scroll: {{ scroll.charAt(0).toUpperCase() + scroll.slice(1) }} </template>
      <template #body>
        <p v-for="i in 30" :key="i" class="mb-3">
          Paragraph {{ i }}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed
          porttitor quam.
        </p>
      </template>
      <template #footer="{ close }">
        <Button variant="secondary" @click="close"> Cancel </Button>
        <Button @click="close"> Confirm </Button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import type { RadioGroupItem } from '@hareui/vue'
import { Button, Modal, RadioGroup } from '@hareui/vue'
import { ref } from 'vue'

const scroll = ref<'inside' | 'outside'>('inside')

const items: RadioGroupItem[] = [
  { value: 'inside', label: 'Inside' },
  { value: 'outside', label: 'Outside' },
]
</script>
