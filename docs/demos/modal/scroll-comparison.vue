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
          <strong class="text-foreground">{{ i }}.</strong> We may update these terms from time to
          time. When we do, we'll email you at least 30 days before the changes apply and keep the
          previous version on this page.
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
