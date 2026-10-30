<template>
  <div
    data-slot="code-block"
    :data-lang="lang"
    :data-syntax="isHighlighted ? 'highlighted' : 'plain'"
    :class="ui.base()"
  >
    <div v-if="!hideHeader" data-slot="code-block-header" :class="ui.header()">
      <slot name="header" v-bind="headerSlotProps">
        <span data-slot="code-block-label" :class="ui.label()">
          <component :is="icon" v-if="icon" aria-hidden="true" :class="ui.icon()" />
          <span :class="ui.labelText()">{{ filename ?? lang }}</span>
        </span>
      </slot>
    </div>
    <div v-if="copy" data-slot="code-block-actions" :class="ui.actions()">
      <slot name="copy" v-bind="copySlotProps">
        <Button
          variant="ghost"
          size="sm"
          icon-only
          data-slot="code-block-copy"
          :data-copied="isCopied || undefined"
          :aria-label="isCopied ? copyOptions.copiedLabel : copyOptions.label"
          :class="ui.copy()"
          @click="copyCode"
        >
          <span aria-hidden="true" :class="ui.copyIcons()">
            <svg
              fill="none"
              height="16"
              viewBox="0 0 16 16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
              :class="ui.copyIcon()"
            >
              <path
                clip-rule="evenodd"
                d="M12 2.5H8A1.5 1.5 0 0 0 6.5 4v1H8a3 3 0 0 1 3 3v1.5h1A1.5 1.5 0 0 0 13.5 8V4A1.5 1.5 0 0 0 12 2.5M11 11h1a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v1H4a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3zM4 6.5h4A1.5 1.5 0 0 1 9.5 8v4A1.5 1.5 0 0 1 8 13.5H4A1.5 1.5 0 0 1 2.5 12V8A1.5 1.5 0 0 1 4 6.5"
                fill="currentColor"
                fill-rule="evenodd"
              />
            </svg>
            <svg
              fill="none"
              height="16"
              viewBox="0 0 16 16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
              :class="ui.checkIcon()"
            >
              <path
                clip-rule="evenodd"
                :d="CHECK_ICON_PATH"
                fill="currentColor"
                fill-rule="evenodd"
              />
            </svg>
          </span>
        </Button>
      </slot>
    </div>
    <ScrollShadow orientation="horizontal" data-slot="code-block-code" :class="ui.code()">
      <!-- The content stays on one line: any whitespace between tags inside <pre> renders. -->
      <pre
        :class="ui.pre()"
      ><code :style="gutterStyle" :class="ui.content()"><span v-for="(line, index) in lines" :key="index" data-slot="code-block-line" :data-highlighted="highlightedLines.has(index + 1) || undefined" :class="ui.line()"><span v-if="lineNumbers" aria-hidden="true" data-slot="code-block-line-number" :class="ui.lineNumber()">{{ index + 1 }}</span><span v-for="(token, tokenIndex) in line" :key="tokenIndex" :style="token.style" :class="tokenClass">{{ token.content }}</span></span></code></pre>
    </ScrollShadow>
  </div>
</template>

<script setup lang="ts">
import { defu } from 'defu'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'

import Button from '@/components/button/Button.vue'
import ScrollShadow from '@/components/scroll-shadow/ScrollShadow.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { CHECK_ICON_PATH } from '@/utils/checkIcon'
import { warn } from '@/utils/warn'

import type {
  CodeBlockCopyOptions,
  CodeBlockCopySlotProps,
  CodeBlockHeaderSlotProps,
  CodeBlockProps,
  CodeBlockSlots,
  CodeBlockThemes,
  CodeBlockToken,
} from './CodeBlock.types'
import { highlightCode, isPlainLang, toLineSet, toPlainLines } from './highlight'
import theme from './theme'

type Highlighted = { code: string; lang: string; lines: CodeBlockToken[][] }

const COPY_DEFAULTS: Required<CodeBlockCopyOptions> = {
  label: 'Copy code',
  copiedLabel: 'Copied',
  duration: 1650,
}

const THEME_DEFAULTS: Required<CodeBlockThemes> = { light: 'github-light', dark: 'github-dark' }

const props = withDefaults(defineProps<CodeBlockProps>(), { lang: 'text', copy: true })
defineSlots<CodeBlockSlots>()

const highlighted = shallowRef<Highlighted>()
const isCopied = ref(false)

const copyOptions = computed(() =>
  defu(typeof props.copy === 'object' ? props.copy : {}, COPY_DEFAULTS),
)

const themes = computed(() => defu(props.themes, THEME_DEFAULTS))

// Tokens of an older `code` or `lang` are dropped, so the plain text shows until the new highlight lands.
const isHighlighted = computed(
  () => highlighted.value?.code === props.code && highlighted.value.lang === props.lang,
)

const lines = computed(() =>
  isHighlighted.value ? highlighted.value!.lines : toPlainLines(props.code),
)

const highlightedLines = computed(() => toLineSet(props.highlight))

const gutterStyle = computed(() => {
  if (!props.lineNumbers) return undefined

  return { '--code-block-gutter': `${String(lines.value.length).length}ch` }
})

const ui = useComponentUI('codeBlock', {
  theme,
  variantProps: () => ({
    copied: isCopied.value,
    filename: Boolean(props.filename),
    copy: Boolean(props.copy),
  }),
  props,
})

const tokenClass = computed(() => ui.value.token())

// Only the latest request may land; a slower earlier one must not overwrite it.
let request = 0

const runHighlight = async () => {
  request += 1
  const current = request
  const { code, lang } = props
  if (isPlainLang(lang)) return

  try {
    const tokens = await highlightCode({ code, lang, themes: themes.value })
    if (current !== request) return

    highlighted.value = { code, lang, lines: tokens }
  } catch (error) {
    if (current !== request) return

    warn(`CodeBlock shows "${lang}" as plain text: ${String(error)}`)
  }
}

// Highlighting starts after mount, so the server and the first client render both output plain text.
onMounted(runHighlight)

watch(() => [props.code, props.lang, themes.value.light, themes.value.dark], runHighlight)

let copiedTimer: ReturnType<typeof setTimeout> | undefined

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
  } catch {
    // Clipboard missing (insecure context) or denied: nothing was copied, so no copied state.
    return
  }

  isCopied.value = true
  clearTimeout(copiedTimer)

  copiedTimer = setTimeout(() => {
    isCopied.value = false
  }, copyOptions.value.duration)
}

onBeforeUnmount(() => {
  request += 1
  clearTimeout(copiedTimer)
})

const copySlotProps = computed<CodeBlockCopySlotProps>(() => ({
  copied: isCopied.value,
  copy: copyCode,
}))

const headerSlotProps = computed<CodeBlockHeaderSlotProps>(() => ({
  ...copySlotProps.value,
  lang: props.lang,
  filename: props.filename,
}))
</script>
