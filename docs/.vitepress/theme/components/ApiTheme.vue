<template>
  <CollapsibleCode :code="code" lang="ts" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import CollapsibleCode from './CollapsibleCode.vue'

const props = defineProps<{ component: string }>()

const files = import.meta.glob<string>('../../api/theme/*.ts', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const code = computed(() => {
  const source = files[`../../api/theme/${props.component}.ts`]
  if (source === undefined)
    throw new Error(
      `ApiTheme: missing docs/.vitepress/api/theme/${props.component}.ts (run \`bun run api\`)`,
    )

  return source
})
</script>
