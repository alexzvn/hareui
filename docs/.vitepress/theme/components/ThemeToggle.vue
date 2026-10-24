<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

type Mode = 'light' | 'dark' | 'auto'

const STORAGE_KEY = 'vitepress-theme-appearance'

const modes: { mode: Mode; label: string; paths: string[] }[] = [
  {
    mode: 'light',
    label: 'light',
    paths: [
      '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>',
    ],
  },
  { mode: 'dark', label: 'dark', paths: ['<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>'] },
  {
    mode: 'auto',
    label: 'system',
    paths: [
      '<rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" x2="16" y1="21" y2="21"></line><line x1="12" x2="12" y1="17" y2="21"></line>',
    ],
  },
]

const current = ref<Mode>('auto')
let media: MediaQueryList | undefined

function apply(mode: Mode) {
  const dark = mode === 'dark' || (mode === 'auto' && !!media?.matches)
  const root = document.documentElement
  root.classList.toggle('dark', dark)
  root.style.colorScheme = dark ? 'dark' : 'light'
}

function select(mode: Mode) {
  current.value = mode
  localStorage.setItem(STORAGE_KEY, mode)
  apply(mode)
}

function onSystemChange() {
  if (current.value === 'auto') apply('auto')
}

onMounted(() => {
  media = window.matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', onSystemChange)
  const stored = localStorage.getItem(STORAGE_KEY)
  current.value = stored === 'light' || stored === 'dark' ? stored : 'auto'
  apply(current.value)
})

onBeforeUnmount(() => media?.removeEventListener('change', onSystemChange))
</script>

<template>
  <div
    class="inline-flex cursor-(--cursor-interactive) items-center rounded-full border p-1"
    data-theme-toggle=""
  >
    <button
      v-for="item in modes"
      :key="item.mode"
      type="button"
      :aria-label="item.label"
      :class="[
        'size-6.5 rounded-full p-1.5',
        current === item.mode
          ? 'bg-fd-accent text-fd-accent-foreground'
          : 'text-fd-muted-foreground',
      ]"
      @click="select(item.mode)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-full"
        aria-hidden="true"
        v-html="item.paths.join('')"
      />
    </button>
  </div>
</template>
