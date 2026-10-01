<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref, shallowRef, type Component } from 'vue'
import { tv } from '../../../../packages/herouse/src/utils/tv'
import buttonTheme from '../../../../packages/herouse/src/theme/button'
import gravity from '@iconify-json/gravity-ui/icons.json'
import { flashCopied } from '../composables/useDocInteractions'

const props = withDefaults(defineProps<{ name: string; align?: 'center' | 'start' | 'end'; minHeight?: string }>(), {
  align: 'center',
})

const loaders = import.meta.glob<{ default: Component }>('../../../demos/**/*.vue')
const sources = import.meta.glob<string>('../../../demos/**/*.vue', { query: '?raw', import: 'default', eager: true })

const key = computed(() => `../../../demos/${props.name}.vue`)
const source = computed(() => sources[key.value])

if (import.meta.env.SSR && !loaders[key.value]) {
  throw new Error(`ComponentPreview: demo not found: docs/demos/${props.name}.vue`)
}

const demo = computed(() => {
  const loader = loaders[key.value]
  return loader ? defineAsyncComponent(loader) : undefined
})

const highlighted = new Map<string, Promise<string>>()
function highlight(name: string, code: string): Promise<string> {
  let cached = highlighted.get(name)
  if (!cached) {
    cached = import('shiki').then(({ codeToHtml }) =>
      codeToHtml(code, { lang: 'vue', themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: false }),
    )
    highlighted.set(name, cached)
  }
  return cached
}

const codeHtml = shallowRef<string>()
onMounted(async () => {
  if (!source.value) return
  const html = await highlight(props.name, source.value)
  codeHtml.value = html.match(/<code[^>]*>([\s\S]*)<\/code>/)?.[1]
})

const expanded = ref(false)

const button = tv(buttonTheme)
const copyClass = button({ variant: 'ghost', size: 'sm', iconOnly: true }).base({ class: '-mt-0.5 bg-transparent text-muted' })
const expandClass = button({ variant: 'tertiary', size: 'sm' }).base({
  class: 'absolute end-1/2 bottom-2 translate-x-1/2 bg-surface text-xs shadow-sm shadow-black/5',
})
const copyIcon = `<svg aria-hidden="true" height="1em" role="img" viewBox="0 0 16 16" width="1em" xmlns="http://www.w3.org/2000/svg">${gravity.icons.copy.body}</svg>`

const dataName = computed(() => props.name.replace(/\//g, '-'))
const alignClass = computed(() => ({ center: 'items-center justify-center', start: 'items-start justify-start', end: 'items-end justify-end' })[props.align])

function copy(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement
  if (source.value) void navigator.clipboard.writeText(source.value).then(() => flashCopied(target))
}
</script>

<template>
  <p v-if="!demo" class="text-danger">Demo not found: {{ name }}</p>
  <div v-else class="component-preview-container group relative my-4 w-full" :data-name="dataName" style="contain: content">
    <div
      :data-name="dataName"
      :class="['preview not-prose relative min-h-[350px] w-full overflow-hidden rounded-t-xl border-s border-e border-t border-separator p-4 sm:p-10 flex', alignClass]"
    >
      <div :class="['flex w-full', alignClass]" :style="minHeight ? { minHeight } : undefined">
        <component :is="demo" />
      </div>
    </div>
    <div class="code-section relative rounded-b-xl border border-separator bg-transparent">
      <div class="code-block-wrapper">
        <div class="relative">
          <div class="relative">
            <div :class="['code-block-wrapper relative', !expanded && 'mask-to-bottom max-h-[150px] overflow-hidden']">
              <figure
                dir="ltr"
                class="my-4 bg-fd-card rounded-xl shiki relative border not-prose overflow-hidden text-sm docs-code-block shadow-none docs-code-block-line-numbers"
                lang="vue"
                tabindex="-1"
              >
                <div class="z-1! empty:hidden absolute top-3 right-2 z-2 backdrop-blur-lg rounded-lg text-fd-muted-foreground">
                  <button aria-label="Copy Text" type="button" :class="copyClass" @click="copy" v-html="copyIcon" />
                </div>
                <div
                  role="region"
                  tabindex="0"
                  class="text-[0.8125rem] py-3.5 overflow-auto max-h-[600px] fd-scroll-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fd-ring"
                  style="--padding-right: calc(var(--spacing) * 8)"
                >
                  <pre
                    class="min-w-full w-max *:flex *:flex-col shiki shiki-themes github-light github-dark"
                    style="--shiki-light: #24292e; --shiki-dark: #e1e4e8; --shiki-light-bg: #fff; --shiki-dark-bg: #24292e"
                    tabindex="0"
                  ><code v-if="codeHtml" v-html="codeHtml" /><code v-else><span v-for="(line, i) in source?.split('\n')" :key="i" class="line">{{ line }}</span></code></pre>
                </div>
              </figure>
            </div>
            <button type="button" data-slot="button" :class="expandClass" @click="expanded = !expanded">
              {{ expanded ? 'Collapse code' : 'Expand code' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
