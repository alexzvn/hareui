<template>
  <Modal v-model:open="isOpen" title="Pick a palette" placement="top" :ui="shell">
    <Button variant="secondary">Browse palettes</Button>
    <template #content>
      <div class="flex min-h-0 flex-1">
        <CommandPalette
          :groups="groups"
          placeholder="Find a palette..."
          class="w-3/5 border-e border-border/70"
          :ui="{ item: 'min-h-13' }"
          @highlight="onHighlight"
          @update:model-value="isOpen = false"
        >
          <template #item-leading="{ item }">
            <span class="size-8 shrink-0 rounded-lg" :style="{ background: item.colors[0] }" />
          </template>
        </CommandPalette>
        <div class="flex flex-1 flex-col items-center justify-center gap-3 p-6">
          <template v-if="preview">
            <div class="grid w-full grid-cols-2 gap-2">
              <span
                v-for="color in preview.colors"
                :key="color"
                class="h-14 rounded-xl"
                :style="{ background: color }"
              />
            </div>
            <p class="text-sm font-medium text-foreground">{{ preview.label }}</p>
          </template>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { Button, Modal } from '@hareui/vue'
import { CommandPalette } from '@hareui/vue/command-palette'
import type { CommandPaletteGroup, CommandPaletteItem } from '@hareui/vue/command-palette'
import { ref, shallowRef } from 'vue'

type Palette = CommandPaletteItem & { label: string; colors: string[] }

const isOpen = ref(false)

// The dialog drops from the top, 15% down the viewport, and grows in as it fades.
const shell = {
  container:
    'pt-[15vh] [&:where([data-state=open])]:[--tw-duration:200ms]! [&:where([data-state=open])]:zoom-in-95! [&:where([data-state=open])]:slide-in-from-top-2!',
  dialog: 'max-h-110 w-full max-w-xl overflow-hidden p-0 [border-radius:var(--radius-2xl)]',
}

const palettes: Palette[] = [
  {
    label: 'Harbor',
    description: 'Cool blues for calm dashboards',
    colors: ['#0f4c81', '#3b82c4', '#9cc3e6', '#e8f1fa'],
  },
  {
    label: 'Orchard',
    description: 'Fresh greens and a warm accent',
    colors: ['#2f6b3a', '#5fa35a', '#c4e3a5', '#f2b84b'],
  },
  {
    label: 'Ember',
    description: 'Warm reds for bold calls to action',
    colors: ['#7f1d1d', '#dc2626', '#f59e8b', '#fde4dc'],
  },
  {
    label: 'Dune',
    description: 'Sandy neutrals for long reads',
    colors: ['#6b4f2a', '#b08d57', '#e3cfa6', '#f8f1e3'],
  },
  {
    label: 'Lagoon',
    description: 'Teal with a touch of violet',
    colors: ['#115e59', '#14b8a6', '#a78bfa', '#ecfeff'],
  },
  {
    label: 'Graphite',
    description: 'Quiet greys with one bright pop',
    colors: ['#1f2937', '#4b5563', '#d1d5db', '#facc15'],
  },
]

const groups: CommandPaletteGroup<Palette>[] = [
  { id: 'palettes', label: 'Palettes', items: palettes },
]

// shallowRef: command items can hold icon components, which deep ref unwrapping can't type.
const preview = shallowRef<Palette | undefined>(palettes[0])

const onHighlight = (payload?: { value: unknown }) => {
  const label = (payload?.value as Palette | undefined)?.label
  preview.value = palettes.find((palette) => palette.label === label) ?? preview.value
}
</script>
