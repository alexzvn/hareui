<script setup lang="ts">
import type { HeaderMode } from '@hareui/vue'
import { Button, Header, NavigationMenu } from '@hareui/vue'
import { ref } from 'vue'

const navItems = [
  { label: 'Docs', href: '#docs', active: true },
  { label: 'Components', href: '#components' },
  { label: 'Figma', href: '#figma' },
  { label: 'Releases', href: '#releases' },
]

// Touch-sized rows for the mobile menu.
const menuUi = {
  list: 'gap-1',
  link: 'min-h-11 gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-foreground',
}

const modes: HeaderMode[] = ['modal', 'slideover', 'drawer']
const mode = ref<HeaderMode>('slideover')
</script>

<template>
  <!-- `breakpoint="none"` keeps the collapsed layout so the menu is reachable at any width. -->
  <Header breakpoint="none" :mode="mode" title="HareUI" to="#">
    <template #title>
      <span class="flex items-center gap-2">
        <svg aria-hidden="true" fill="currentColor" height="22" viewBox="0 0 32 32" width="22">
          <path
            d="M14.125 5.5C14.125 1.99 15.115 1 18.625 1L25.875 1C29.385 1 30.375 1.99 30.375 5.5L30.375 12.75C30.375 16.26 29.385 17.25 25.875 17.25L22.875 17.25C18.975 17.25 17.875 18.35 17.875 22.25L17.875 26.5C17.875 30.01 16.885 31 13.375 31L6.125 31C2.615 31 1.625 30.01 1.625 26.5L1.625 19.25C1.625 15.74 2.615 14.75 6.125 14.75L9.125 14.75C13.025 14.75 14.125 13.65 14.125 9.75Z"
            transform="rotate(-1.5 16 16)"
          />
        </svg>
        <span class="text-lg font-semibold">HareUI</span>
      </span>
    </template>

    <template #body>
      <NavigationMenu :items="navItems" orientation="vertical" :ui="menuUi" />
    </template>
  </Header>

  <main class="flex flex-col gap-3 p-6">
    <h1 class="text-xl font-semibold text-foreground">Menu modes</h1>
    <p class="text-sm text-muted">Pick how the menu opens, then press the toggle.</p>
    <div class="flex flex-wrap gap-2">
      <Button
        v-for="item in modes"
        :key="item"
        size="sm"
        :variant="mode === item ? 'primary' : 'tertiary'"
        @click="mode = item"
      >
        {{ item }}
      </Button>
    </div>
  </main>
</template>
