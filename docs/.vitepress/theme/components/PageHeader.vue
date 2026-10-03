<script setup lang="ts">
import { computed } from 'vue'
import { tv } from '../../../../packages/vue/src/utils/tv'
import buttonTheme from '../../../../packages/vue/src/theme/button'

export interface PageLinks {
  reka?: string
  heroui?: string
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
    links.reka && { label: 'Reka UI', href: `https://reka-ui.com/docs/components/${links.reka}`, icon: 'reka' as const },
    links.heroui && { label: 'HeroUI', href: `https://heroui.com/docs/react/components/${links.heroui}`, icon: 'heroui' as const },
  ].filter((badge): badge is { label: string; href: string; icon: 'reka' | 'heroui' } => !!badge)
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
        <svg v-if="badge.icon === 'reka'" class="text-lg" width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" />
          <circle cx="12" cy="12" r="3.5" fill="currentColor" />
        </svg>
        <svg v-else class="text-lg" width="1em" height="1em" viewBox="0 0 16 16" aria-hidden="true">
          <path fill="currentColor" d="M3 2h3v5h4V2h3v12h-3V9H6v5H3z" />
        </svg>
        {{ badge.label }}
      </a>
    </div>
  </section>
</template>
