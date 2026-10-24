<template>
  <div
    class="code-section not-prose relative my-4 rounded-xl border border-separator bg-transparent"
  >
    <div class="code-block-wrapper">
      <div class="relative">
        <div
          :class="[
            'code-block-wrapper relative',
            collapsible && !isExpanded && 'mask-to-bottom max-h-[150px] overflow-hidden',
          ]"
        >
          <figure
            dir="ltr"
            class="my-0 bg-fd-card rounded-xl shiki relative not-prose overflow-hidden text-sm docs-code-block shadow-none"
            :class="showLineNumbers && 'docs-code-block-line-numbers'"
            :lang="lang"
            tabindex="-1"
          >
            <figcaption v-if="title" class="border-b border-separator px-4 py-2 text-xs text-muted">
              {{ title }}
            </figcaption>
            <div
              class="z-1! empty:hidden absolute top-3 right-2 z-2 backdrop-blur-lg rounded-lg text-fd-muted-foreground"
            >
              <button
                aria-label="Copy Text"
                type="button"
                :class="copyClass"
                @click="copy"
                v-html="copyIcon"
              />
            </div>
            <div
              role="region"
              tabindex="0"
              class="text-[0.8125rem] py-3.5 overflow-auto max-h-[600px] fd-scroll-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fd-ring"
              style="--padding-right: calc(var(--spacing) * 8)"
            >
              <pre
                class="min-w-full w-max *:flex *:flex-col shiki shiki-themes github-light github-dark"
                style="
                  --shiki-light: #24292e;
                  --shiki-dark: #e1e4e8;
                  --shiki-light-bg: #fff;
                  --shiki-dark-bg: #24292e;
                "
                tabindex="0"
              ><code v-if="codeHtml" v-html="codeHtml" /><code v-else><span v-for="(line, i) in code.trim().split('\n')" :key="i" class="line">{{ line }}</span></code></pre>
            </div>
          </figure>
        </div>
        <button
          v-if="collapsible"
          type="button"
          data-slot="button"
          :class="expandClass"
          @click="isExpanded = !isExpanded"
        >
          {{ isExpanded ? 'Collapse code' : 'Expand code' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import gravity from '@iconify-json/gravity-ui/icons.json'
import { onMounted, ref, shallowRef, watch } from 'vue'

import buttonTheme from '../../../../packages/vue/src/components/button/theme'
import { tv } from '../../../../packages/vue/src/utils/tv'
import { flashCopied } from '../composables/useDocInteractions'

const props = withDefaults(
  defineProps<{
    code: string
    lang?: string
    title?: string
    showLineNumbers?: boolean
    collapsible?: boolean
  }>(),
  {
    lang: 'tsx',
    showLineNumbers: true,
    collapsible: true,
  },
)

const highlighted = new Map<string, Promise<string>>()
const highlight = (code: string, lang: string): Promise<string> => {
  const key = `${lang}:${code}`
  let cached = highlighted.get(key)
  if (!cached) {
    cached = import('shiki').then(({ codeToHtml }) =>
      codeToHtml(code, {
        lang,
        themes: { light: 'github-light', dark: 'github-dark' },
        defaultColor: false,
      }),
    )

    highlighted.set(key, cached)
  }

  return cached
}

const codeHtml = shallowRef<string>()
const render = async () => {
  const trimmed = props.code.trim()
  if (!trimmed) return
  const html = await highlight(trimmed, props.lang)
  codeHtml.value = html.match(/<code[^>]*>([\s\S]*)<\/code>/)?.[1]
}

onMounted(render)
watch(() => [props.code, props.lang], render)

const isExpanded = ref(!props.collapsible)

const button = tv(buttonTheme)
const copyClass = button({ variant: 'ghost', size: 'sm', iconOnly: true }).base({
  class: '-mt-0.5 bg-transparent text-muted',
})

const expandClass = button({ variant: 'tertiary', size: 'sm' }).base({
  class: 'absolute end-1/2 bottom-2 translate-x-1/2 bg-surface text-xs shadow-sm shadow-black/5',
})

const copyIcon = `<svg aria-hidden="true" height="1em" role="img" viewBox="0 0 16 16" width="1em" xmlns="http://www.w3.org/2000/svg">${gravity.icons.copy.body}</svg>`

const copy = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement
  void navigator.clipboard.writeText(props.code.trim()).then(() => flashCopied(target))
}
</script>
