<script setup lang="ts">
import { computed } from 'vue'
import { tv } from '../../../../packages/vue/src/utils/tv'
import buttonTheme from '../../../../packages/vue/src/components/button/theme'
import { repoFileUrl } from '../repo'
import BrandIcon from './BrandIcon.vue'

export interface PageLinks {
  /** Component file under `packages/vue/src/components/`, e.g. `button/Button.vue`. */
  source?: string
  /** Theme file under `packages/vue/src/components/`, e.g. `button/theme.ts`. */
  styles?: string
  reka?: string
  heroui?: string
}

interface Badge {
  label: string
  href: string
  icon: 'github' | 'heroui' | 'reka'
}

const props = defineProps<{ title: string; description?: string; links?: PageLinks }>()

const docsButton = tv({
  extend: tv(buttonTheme),
  variants: { variant: { tertiary: { base: 'relative gap-2 dark:bg-default/70' } } },
  defaultVariants: { size: 'sm', variant: 'tertiary' },
})

const linkClass = docsButton().base()

const badges = computed(() => {
  const links = props.links ?? {}
  return [
    links.reka && { label: 'Reka UI', href: `https://reka-ui.com/docs/components/${links.reka}`, icon: 'reka' },
    links.heroui && { label: 'HeroUI', href: `https://heroui.com/docs/react/components/${links.heroui}`, icon: 'heroui' },
    links.source && { label: 'Source', href: repoFileUrl(`packages/vue/src/components/${links.source}`), icon: 'github' },
    links.styles && { label: 'Styles source', href: repoFileUrl(`packages/vue/src/components/${links.styles}`), icon: 'github' },
  ].filter((badge): badge is Badge => !!badge)
})
</script>

<template>
  <section class="flex flex-col gap-2">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h1 class="text-[1.75em] font-semibold flex items-center gap-2">{{ title }}</h1>
    </div>
    <p v-if="description" class="text-fd-muted-foreground text-md mt-2 mb-4">{{ description }}</p>
    <div v-if="badges.length" class="mb-4 flex flex-wrap gap-2">
      <a v-for="badge in badges" :key="badge.href" :class="linkClass" :href="badge.href" rel="noopener noreferrer" target="_blank">
        <BrandIcon :name="badge.icon" class="text-lg" />
        {{ badge.label }}
      </a>
    </div>
  </section>
</template>
