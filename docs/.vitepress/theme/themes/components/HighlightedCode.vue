<script setup lang="ts">
// Port of HeroUI docs `components/highlighted-code.tsx` (Shiki, github-light / github-dark by color mode).
// Shiki is loaded on demand; until the first highlight is ready, the loading skeleton of `code-panel.tsx` shows.
import { Skeleton } from 'herouse'
import { onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { useColorMode } from '../composables/colorMode'

const props = withDefaults(defineProps<{ code: string, lang?: string, showLineNumbers?: boolean }>(), {
  lang: 'tsx',
  showLineNumbers: true,
})

const { isDark } = useColorMode()

const html = shallowRef('')
const loaded = ref(false)

// Highlight requests coalesce: while one runs, later changes only mark it dirty and the newest input is highlighted next.
let running = false
let dirty = false
let unmounted = false

async function highlight() {
  if (running) {
    dirty = true
    return
  }
  running = true
  try {
    const { codeToHtml } = await import('shiki')
    do {
      dirty = false
      const code = props.code.trim()
      let result = ''
      if (code) {
        const theme = isDark.value ? 'github-dark' : 'github-light'
        try {
          result = await codeToHtml(code, { lang: props.lang, theme })
        }
        catch {
          result = await codeToHtml(code, { lang: 'text', theme })
        }
      }
      if (unmounted) return
      html.value = result
      loaded.value = true
    } while (dirty)
  }
  finally {
    running = false
  }
}

watch(() => [props.code, props.lang, isDark.value], highlight, { immediate: true })
onBeforeUnmount(() => (unmounted = true))

// 15 bars, widths as in HeroUI's `CodeLoadingSkeleton`
const SKELETON_WIDTHS = [
  'w-3/4', 'w-1/2', 'w-5/6', 'w-2/3', 'w-4/5', 'w-1/3', 'w-3/5', 'w-2/5', 'w-1/5', 'w-4/5', 'w-3/5', 'w-2/5', 'w-1/5', 'w-4/5', 'w-3/5',
]
</script>

<template>
  <div v-if="!loaded" class="space-y-2.5 py-4">
    <Skeleton v-for="(width, i) in SKELETON_WIDTHS" :key="i" :class="['h-4 rounded-md', width]" />
  </div>
  <div
    v-else-if="html"
    :class="[
      'docs-code-block overflow-auto text-sm [&_.shiki]:bg-transparent! [&_pre]:bg-transparent!',
      showLineNumbers && 'docs-code-block-line-numbers',
      '[&>pre]:m-0 [&>pre]:p-4',
      '[&>pre>code]:block [&>pre>code]:font-mono [&>pre>code]:leading-relaxed',
    ]"
    v-html="html"
  />
</template>
