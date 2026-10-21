<script setup lang="ts">
import { Footer, NavigationMenu } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const items = [
  { label: 'Figma Kit', href: '#figma' },
  { label: 'Playground', href: '#playground' },
  { label: 'Releases', href: '#releases' },
]
</script>

<template>
  <div class="w-full overflow-hidden rounded-xl border border-separator">
    <Footer class="border-t-0">
      <template #left>
        <p class="text-sm text-muted">
          Copyright © {{ new Date().getFullYear() }}
        </p>
      </template>

      <NavigationMenu :items="items" variant="link" :ui="{ list: 'flex-wrap justify-center gap-2', link: 'rounded-sm p-0' }" />

      <template #right>
        <a aria-label="GitHub" class="rounded-sm text-muted outline-none transition-colors hover:text-foreground focus-visible:status-focused" href="https://github.com/hareui/hareui" target="_blank">
          <Icon class="size-5" icon="gravity-ui:logo-github" />
        </a>
        <a aria-label="Figma" class="rounded-sm text-muted outline-none transition-colors hover:text-foreground focus-visible:status-focused" href="#figma">
          <Icon class="size-5" icon="gravity-ui:logo-figma" />
        </a>
      </template>
    </Footer>
  </div>
</template>
