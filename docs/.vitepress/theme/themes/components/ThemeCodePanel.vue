<template>
  <CodePanel
    show-line-numbers
    file-name="theme.css"
    :is-visible="isCodeVisible"
    lang="css"
    :source-code="cssCode"
    title="globals.css"
    @close="toggleCode"
  />
</template>

<script setup lang="ts">
// Port of HeroUI docs `themes/components/theme-code-panel.tsx`.
// `useDeferredValue` has no Vue counterpart; HighlightedCode highlights asynchronously and coalesces rapid changes,
// so slider drags don't wait on syntax highlighting.
import { computed } from 'vue'

import { useCodePanel } from '../composables/codePanel'
import { useVariablesState } from '../composables/variables'
import { getCustomFontInfoFromUrl, isCustomFontUrl } from '../utils/font-utils'
import { generateMinimalCssVariables } from '../utils/generate-css-variables'
import CodePanel from './CodePanel.vue'

const [variables] = useVariablesState()
const { isCodeVisible, toggleCode } = useCodePanel()

const cssCode = computed(() => {
  // Get custom font info if using a URL-based custom font
  const customFontInfo = isCustomFontUrl(variables.value.fontFamily)
    ? getCustomFontInfoFromUrl(variables.value.fontFamily)
    : undefined

  return generateMinimalCssVariables(variables.value, customFontInfo ?? undefined)
})
</script>
