<template>
  <div v-if="!isLoaded" class="space-y-2.5 py-4">
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

<script setup lang="ts">
// Port of HeroUI docs `components/highlighted-code.tsx` (Shiki, github-light / github-dark by color mode).
// Shiki is loaded on demand; until the first highlight is ready, the loading skeleton of `code-panel.tsx` shows.
import { Skeleton } from '@hareui/vue'
import type { codeToHtml as ShikiCodeToHtml } from 'shiki'
import { onBeforeUnmount, ref, shallowRef, watch } from 'vue'

import { useColorMode } from '../composables/colorMode'

const props = withDefaults(
  defineProps<{ code: string; lang?: string; showLineNumbers?: boolean }>(),
  {
    lang: 'tsx',
    showLineNumbers: true,
  },
)

const { isDark } = useColorMode()

const html = shallowRef('')
const isLoaded = ref(false)

// Highlight requests coalesce: while one runs, later changes only mark it dirty and the newest input is highlighted next.
let isRunning = false
let isDirty = false
let isUnmounted = false

// Unknown languages fall back to plain text instead of failing the highlight.
const toHtml = async (code: string, codeToHtml: typeof ShikiCodeToHtml) => {
  if (!code) return ''

  const theme = isDark.value ? 'github-dark' : 'github-light'

  try {
    return await codeToHtml(code, { lang: props.lang, theme })
  } catch {
    return await codeToHtml(code, { lang: 'text', theme })
  }
}

const highlight = async () => {
  if (isRunning) {
    isDirty = true
    return
  }

  isRunning = true

  try {
    const { codeToHtml } = await import('shiki')
    do {
      isDirty = false
      const result = await toHtml(props.code.trim(), codeToHtml)

      if (isUnmounted) return
      html.value = result
      isLoaded.value = true
    } while (isDirty)
  } finally {
    isRunning = false
  }
}

watch(() => [props.code, props.lang, isDark.value], highlight, { immediate: true })
onBeforeUnmount(() => (isUnmounted = true))

// 15 bars, widths as in HeroUI's `CodeLoadingSkeleton`
const SKELETON_WIDTHS = [
  'w-3/4',
  'w-1/2',
  'w-5/6',
  'w-2/3',
  'w-4/5',
  'w-1/3',
  'w-3/5',
  'w-2/5',
  'w-1/5',
  'w-4/5',
  'w-3/5',
  'w-2/5',
  'w-1/5',
  'w-4/5',
  'w-3/5',
]
</script>
