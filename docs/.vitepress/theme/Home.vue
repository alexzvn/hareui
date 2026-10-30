<template>
  <main id="nd-home-layout" class="flex flex-1 flex-col [--fd-layout-width:1400px]">
    <HomeNav :docs-href="docsHref" :components-href="componentsHref" @search="emit('search')" />
    <main class="flex min-h-[calc(100vh-4rem)] flex-col">
      <section class="z-10 flex min-h-0 flex-1 flex-col items-center px-4 pt-12 text-center">
        <div class="mx-auto flex max-w-2xl flex-col items-center justify-center">
          <a
            class="flex items-center gap-1 rounded-full bg-accent-soft px-2 py-1 text-xs text-accent-soft-foreground transition-colors hover:bg-accent-soft-hover"
            :href="docsHref"
          >
            <Icon icon="gravity-ui:rocket" class="size-3 shrink-0 text-accent-soft-foreground" />
            <span class="max-w-60 truncate sm:max-w-full"
              >HareUI v{{ version }} — the modern UI library for Vue</span
            >
          </a>
          <h1
            class="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:mt-4 lg:text-5xl"
          >
            Beautiful by default. <span class="block text-muted/70">Customizable by design.</span>
          </h1>
          <p class="text-balance text-muted md:text-lg">
            HareUI is the modern UI library for Vue, built to help you move fast, stay consistent,
            and deliver delightful user experiences.
          </p>
          <div class="mt-4 flex gap-3">
            <Button as="a" :href="docsHref">Get started</Button>
            <Button as="a" :href="componentsHref" variant="outline">View components</Button>
          </div>
          <section aria-labelledby="hareui-overview" class="sr-only">
            <h2 id="hareui-overview">Build accessible products with HareUI</h2>
            <p>
              HareUI is an open-source UI library for Vue. It combines headless primitives with
              Tailwind CSS v4 to provide accessible behavior, typed APIs, customizable composition,
              and polished defaults.
            </p>
            <h3>Documentation for developers and coding agents</h3>
            <p>
              The HareUI documentation includes installation guides, component APIs, examples and
              theming references. Coding agents can use the generated llms.txt indexes.
            </p>
          </section>
        </div>
        <!-- DemoShowcase: HeroUI renders DemoComponents twice (mobile panel, desktop tab panel); one instance
             with responsive classes keeps radio names and ids unique. Below lg the wrapper is `contents`, so the
             grid is a direct flex item as in HeroUI's mobile panel (same sub-pixel centering). -->
        <div class="flex min-h-0 w-full max-w-[1200px] flex-1 flex-col py-6 lg:py-10">
          <div class="flex min-h-[420px] max-w-[1200px] flex-1 flex-col">
            <div
              class="flex w-full flex-1 justify-center rounded-2xl bg-background py-8 lg:overflow-x-hidden lg:overflow-y-auto lg:border lg:border-border/50"
            >
              <div class="contents lg:my-auto lg:block">
                <DemoComponents />
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer
        class="mt-auto flex w-full flex-row flex-wrap items-center justify-center gap-2 py-3 text-muted"
      >
        <p class="text-sm">&copy; {{ year }} HareUI.</p>
      </footer>
    </main>
  </main>
</template>

<script setup lang="ts">
import { Button } from '@hareui/vue'
// Landing page (`layout: home`): port of heroui.com's home (`app/[lang]/(home)/page.tsx` + `layout.tsx`).
// Left out as HeroUI-only: the GitHub stars line, the Pro banner, and the demo showcase bar
// (Pro template tabs, ColorSwatchPicker accent swatches, theme-builder link).
import { Icon } from '@iconify/vue'

import { version } from '../../../packages/vue/package.json'
import { sectionLinks, type SidebarSection } from '../sidebar'
import DemoComponents from './components/home/DemoComponents.vue'
import HomeNav from './components/home/HomeNav.vue'

const props = defineProps<{ sections: SidebarSection[] }>()
const emit = defineEmits<{ search: [] }>()

const firstLink = (base: string) => {
  const section = props.sections.find((s) => s.base === base)
  return (section && sectionLinks(section)[0]?.link) ?? base
}

const docsHref = firstLink('/docs/getting-started')
const componentsHref = firstLink('/docs/components')
const year = new Date().getFullYear()
</script>
