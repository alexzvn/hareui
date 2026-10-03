<script setup lang="ts">
import { ColorSwatchPicker, colorToString, parseColor } from '@hareui/vue'
import { ref } from 'vue'

const colors = ['#F43F5E', '#D946EF', '#8B5CF6', '#3B82F6', '#06B6D4', '#10B981', '#84CC16']
const value = ref(parseColor('#F43F5E'))
</script>

<template>
  <div class="flex flex-col gap-4">
    <ColorSwatchPicker v-model="value" :items="colors" />
    <p class="text-sm text-muted">
      Selected: <span class="font-medium">{{ colorToString(value, 'hex') }}</span>
    </p>
  </div>
</template>
