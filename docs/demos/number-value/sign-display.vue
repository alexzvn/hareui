<template>
  <div class="flex flex-col gap-3">
    <div v-for="mode in modes" :key="mode" class="flex items-baseline gap-4">
      <code class="w-24 text-xs text-muted">{{ mode }}</code>
      <NumberValue
        v-for="value in [18, 0, -18]"
        :key="value"
        class="w-12 font-semibold"
        :value="value"
        :sign-display="mode"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NumberValue } from '@hareui/vue'

const modes = ['auto', 'always', 'exceptZero', 'never'] as const
</script>
