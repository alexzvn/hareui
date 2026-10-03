<script setup lang="ts">
import { Tooltip } from '@hareui/vue'

defineProps<{ content?: string; tooltipClass?: string }>()
</script>

<template>
  <div v-if="!content" :class="tooltipClass">
    <slot />
  </div>
  <Tooltip v-else :delay="0">
    <div :class="tooltipClass">
      <slot />
    </div>
    <template #content>
      <pre class="font-mono text-xs leading-relaxed whitespace-pre-wrap">{{ content }}</pre>
    </template>
  </Tooltip>
</template>
