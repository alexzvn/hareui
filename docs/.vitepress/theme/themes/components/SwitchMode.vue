<template>
  <div :class="['flex flex-col gap-1', !label && 'h-9']">
    <Label v-if="label">{{ label }}</Label>
    <Tooltip>
      <!-- HeroUI `Tooltip.Trigger` renders this focusable wrapper -->
      <div class="inline-block" data-slot="tooltip-trigger" role="button" tabindex="0">
        <button
          aria-label="Toggle Theme"
          class="inline-flex h-9 cursor-(--cursor-interactive) items-center rounded-full border p-1"
          data-theme-toggle=""
          type="button"
          @click="handleModeSwitch"
        >
          <svg
            :class="[
              ITEM,
              isDark ? 'text-fd-muted-foreground' : 'bg-fd-accent text-fd-accent-foreground',
            ]"
            fill="currentColor"
            height="24"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
          <svg
            :class="[
              ITEM,
              isDark ? 'bg-fd-accent text-fd-accent-foreground' : 'text-fd-muted-foreground',
            ]"
            fill="currentColor"
            height="24"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </button>
      </div>
      <template #content>
        <p>Switch mode <Kbd>S</Kbd></p>
      </template>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
// Port of HeroUI docs `themes/components/switch-mode.tsx`. `next-themes` -> the docs' light/dark handling (see colorMode.ts).
import { Kbd, Label, Tooltip } from '@hareui/vue'

import { useColorMode } from '../composables/colorMode'
import { useKeyPress } from '../composables/keyPress'

defineProps<{ label?: string }>()

const { isDark, toggle: handleModeSwitch } = useColorMode()

useKeyPress('s', handleModeSwitch)

const ITEM = 'size-6.5 rounded-full p-1.5'
</script>
