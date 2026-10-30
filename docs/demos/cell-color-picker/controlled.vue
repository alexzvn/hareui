<template>
  <div class="grid w-72 gap-3">
    <CellColorPicker v-model="cursor" label="Cursor" />
    <div class="rounded-xl bg-neutral-900 px-4 py-3 font-mono text-xs text-neutral-300">
      ~/app $ npm run dev<span
        class="ms-1 inline-block h-3.5 w-1.5 align-[-2px]"
        :style="{ backgroundColor: hex }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CellColorPicker, colorToString, parseColor } from '@hareui/vue'
import { computed, ref } from 'vue'

const cursor = ref(parseColor('#22D3EE'))
const hex = computed(() => colorToString(cursor.value, 'hex').toUpperCase())
</script>
