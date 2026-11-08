<template>
  <div data-slot="markdown" :aria-busy="streaming || undefined" :class="ui.base()">
    <MarkdownBlock
      v-for="(block, index) in parsed.blocks"
      :key="index"
      :token="block"
      :context="context"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import { toBlocks } from './blocks'
import type { MarkdownBlocks } from './blocks'
import type { MarkdownProps } from './Markdown.types'
import { isSameContext, MarkdownBlock } from './render'
import type { RenderContext } from './render'
import theme from './theme'

const props = withDefaults(defineProps<MarkdownProps>(), { value: '' })

const ui = useComponentUI('markdown', { theme, variantProps: () => ({}), props })

// The previous result goes back in, so a block whose source is unchanged keeps its token and skips re-rendering.
const parsed = computed<MarkdownBlocks>((previous) =>
  toBlocks({ value: props.value, streaming: props.streaming }, previous),
)

// Kept while every class and override stays the same, so passing `ui` or `components` as an inline object doesn't
// re-render every block on each update.
const context = computed<RenderContext>((previous) => {
  const classes = Object.fromEntries(
    Object.entries(ui.value)
      .filter(([slot]) => slot !== 'base')
      .map(([slot, toClass]): [string, string] => [slot, toClass()]),
  )

  const next = { classes, components: props.components ?? {} }

  return previous && isSameContext(previous, next) ? previous : next
})
</script>
