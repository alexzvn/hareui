<script setup lang="ts">
import { Button, NumberField } from 'herouse'
import { ref } from 'vue'

const value = ref<number | null>(1024)
</script>

<template>
  <div class="flex w-full max-w-64 flex-col gap-4">
    <NumberField v-model="value" :min="0" name="width" label="Width" :ui="{ input: 'w-[120px]' }">
      <template #description>
        Current value: {{ value }}
      </template>
    </NumberField>
    <div class="flex gap-2">
      <Button variant="tertiary" @click="value = 0">
        Reset to 0
      </Button>
      <Button variant="tertiary" @click="value = 2048">
        Set to 2048
      </Button>
    </div>
  </div>
</template>
