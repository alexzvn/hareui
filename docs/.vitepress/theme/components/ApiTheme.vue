<template>
  <p>
    Below is the component's default theme, in the shape <code>createHareUI({ ui })</code> takes
    (<code>app.use(hareui)</code> in <code>main.ts</code>). Copy it and keep only the slots and
    variants you change: your classes are added to the defaults, and a conflicting class replaces
    the default one. To restyle a single instance, pass the same slot keys to its
    <code>ui</code> prop.
  </p>
  <component :is="themeView" />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, h } from 'vue'

import CollapsibleCode from './CollapsibleCode.vue'

const props = defineProps<{ component: string }>()

// Not eager: this component is registered on every page, so a page fetches one theme, and only when it shows one.
const sources = import.meta.glob<string>('../../api/theme/*.ts', {
  query: '?raw',
  import: 'default',
})

// An async component leaves the server-rendered theme in place until its source has loaded, then hydrates it.
const themeView = computed(() => {
  const loadSource = sources[`../../api/theme/${props.component}.ts`]
  if (loadSource === undefined)
    throw new Error(
      `ApiTheme: missing docs/.vitepress/api/theme/${props.component}.ts (run \`bun run api\`)`,
    )

  return defineAsyncComponent(async () => {
    const code = await loadSource()

    return () => h(CollapsibleCode, { code, lang: 'ts', title: 'hareui.ts' })
  })
})
</script>
