<template>
  <template v-if="isVisible">
    <Transition name="code-panel-backdrop" appear>
      <div
        key="code-panel-backdrop"
        aria-label="Close source code"
        class="fixed inset-0 z-9999 bg-black/40 backdrop-blur-sm"
        role="button"
        tabindex="0"
        @click="emit('close')"
        @keydown="(e) => e.key === 'Escape' && emit('close')"
      />
    </Transition>

    <Transition name="code-panel" appear>
      <aside
        key="code-panel"
        :aria-label="title"
        :class="[
          'fixed end-6 top-1/2 z-9999 flex h-[88vh] w-[45%] -translate-y-1/2 flex-col overflow-hidden rounded-xl bg-surface/94 shadow-xl backdrop-blur-md',
          props.class,
        ]"
      >
        <!-- Header -->
        <header
          class="flex shrink-0 items-center justify-between border-b border-separator/50 px-6 py-3"
        >
          <h3 class="text-sm font-medium text-foreground/60">{{ title }}</h3>
          <div class="flex items-center gap-1">
            <button
              v-if="!!sourceCode && !!fileName"
              aria-label="Download code"
              :class="ACTION"
              type="button"
              @click="handleDownload"
            >
              <Icon height="1em" icon="gravity-ui:arrow-down-to-line" width="16" />
            </button>
            <button
              v-if="!!sourceCode"
              :aria-label="copied ? 'Copied!' : 'Copy code'"
              :class="[ACTION, 'data-[copied=true]:text-green-500']"
              :data-copied="copied || undefined"
              type="button"
              @click="onCopy"
            >
              <Icon
                height="1em"
                :icon="copied ? 'gravity-ui:check' : 'gravity-ui:copy'"
                width="16"
              />
            </button>
          </div>
        </header>

        <!-- Code content -->
        <div class="flex-1 overflow-auto px-4 py-2">
          <slot>
            <HighlightedCode
              v-if="sourceCode"
              :code="sourceCode"
              :lang="lang"
              :show-line-numbers="showLineNumbers"
            />
          </slot>
        </div>
      </aside>
    </Transition>
  </template>
</template>

<script setup lang="ts">
// Port of HeroUI docs `components/code-panel.tsx`.
// framer-motion -> CSS transitions: backdrop `duration: 0.3, ease: easeOut`; panel `spring { bounce: 0, duration: 0.4 }`
// (a critically damped spring settling at 0.4s, sampled into `linear()`). HeroUI returns `null` as soon as `isVisible`
// is false, so there is no exit animation; neither here.
import { Icon } from '@iconify/vue'
import { onBeforeUnmount, ref } from 'vue'

import HighlightedCode from './HighlightedCode.vue'

const props = withDefaults(
  defineProps<{
    /** Raw source code to highlight (used with `lang`) */
    sourceCode?: string
    /** File name for download */
    fileName?: string
    /** Language for syntax highlighting */
    lang?: string
    /** Panel title */
    title?: string
    /** Whether to show line numbers */
    showLineNumbers?: boolean
    isVisible: boolean
    class?: any
  }>(),
  { lang: 'tsx', showLineNumbers: true, title: 'Source code' },
)
const emit = defineEmits<{ close: [] }>()
defineSlots<{
  /** Pre-rendered content (takes precedence over `sourceCode`) */
  default?: () => any
}>()

// Same behavior as fumadocs' `useCopyButton`: `copied` for 1.5s
const copied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | undefined
function onCopy() {
  if (props.sourceCode) void navigator.clipboard.writeText(props.sourceCode)
  clearTimeout(copiedTimer)
  copied.value = true
  copiedTimer = setTimeout(() => (copied.value = false), 1500)
}
onBeforeUnmount(() => clearTimeout(copiedTimer))

function handleDownload() {
  if (!props.sourceCode || !props.fileName) return

  const blob = new Blob([props.sourceCode], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = props.fileName
  link.click()

  URL.revokeObjectURL(url)
}

const ACTION =
  'flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-foreground/60'
</script>

<style scoped>
.code-panel-backdrop-enter-active {
  transition: opacity 0.3s ease-out;
}
.code-panel-backdrop-enter-from {
  opacity: 0;
}

.code-panel-enter-active {
  --code-panel-spring: linear(
    0,
    0.0575,
    0.1803,
    0.3208,
    0.4551,
    0.5729,
    0.6711,
    0.7501,
    0.8122,
    0.8601,
    0.8966,
    0.924,
    0.9445,
    0.9596,
    0.9708,
    0.9789,
    0.9848,
    0.9891,
    0.9922,
    0.9944,
    0.996,
    0.9972,
    0.998,
    0.9986,
    1
  );
  transition:
    opacity 0.4s var(--code-panel-spring),
    transform 0.4s var(--code-panel-spring);
}
.code-panel-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
</style>
