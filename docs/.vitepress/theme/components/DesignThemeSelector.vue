<template>
  <div aria-hidden="true" class="pointer-events-none fixed size-0 overflow-hidden opacity-0">
    <img v-for="t in THEMES" :key="t.id" alt="" height="36" width="36" :src="t.image" />
  </div>
  <Popover side="bottom" class="w-[248px] rounded-3xl" :ui="{ dialog: 'p-4' }">
    <Button
      aria-label="Design theme"
      size="sm"
      variant="tertiary"
      :class="[
        'text-xs text-muted',
        showAvatar &&
          'max-sm:min-w-0 max-sm:border-0 max-sm:bg-transparent max-sm:px-0 sm:gap-1.5 sm:ps-2 sm:pe-2.5',
      ]"
    >
      <img
        v-if="showAvatar && current"
        :alt="current.label"
        class="size-5 shrink-0 rounded-full sm:size-3.5"
        height="20"
        width="20"
        :src="current.image"
      />
      <Icon v-else icon="gravity-ui:bucket-paint" class="size-3.5 text-foreground" />
      <span class="hidden sm:inline">{{ showAvatar && current ? current.label : 'Theme' }}</span>
    </Button>
    <template #content>
      <div
        data-slot="list-box"
        aria-label="Design theme"
        role="listbox"
        aria-orientation="vertical"
        data-layout="grid"
        class="relative w-full overflow-clip p-1 [&>*+*]:mt-1 grid grid-cols-4 gap-3"
      >
        <div
          v-for="(item, index) in THEMES"
          :key="item.id"
          ref="options"
          data-slot="list-box-item"
          role="option"
          :aria-selected="item.id === active"
          :data-selected="item.id === active ? 'true' : undefined"
          :tabindex="item.id === active ? 0 : -1"
          class="group relative flex min-h-9 w-10 flex-col items-center justify-center gap-1.5 rounded-2xl p-0 outline-none no-highlight cursor-(--cursor-interactive) transition-[transform,box-shadow] duration-250 ease-out-quart motion-reduce:transition-none focus-visible:status-focused active:scale-[0.98]"
          @click="setStoredDesignTheme(item.id)"
          @keydown="onOptionKeydown($event, index)"
        >
          <img
            :alt="item.label"
            height="36"
            width="36"
            :src="item.image"
            class="size-9 rounded-full bg-surface group-data-[selected=true]:ring-2 group-data-[selected=true]:ring-accent group-data-[selected=true]:ring-offset-2 group-data-[selected=true]:ring-offset-surface"
          />
          <span
            class="text-[10px] font-medium text-muted capitalize group-data-[selected=true]:text-foreground"
            >{{ item.label }}</span
          >
        </div>
      </div>
      <div class="mt-4 border-t border-separator pt-4">
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-0.5">
            <Label class="text-xs">Vibrant palette</Label>
            <Description class="text-[10px]">More saturated, less contrast</Description>
          </div>
          <Switch
            aria-label="Vibrant palette"
            :model-value="vibrant"
            @update:model-value="setStoredVibrantPalette(!!$event)"
          />
        </div>
      </div>
      <Button
        as="a"
        :href="themeBuilderHref"
        target="_blank"
        rel="noreferrer"
        full-width
        size="sm"
        variant="outline"
        class="mt-3 rounded-full text-[13px] text-muted"
      >
        <Icon icon="gravity-ui:palette" class="size-4" />
        Edit theme
      </Button>
    </template>
  </Popover>
</template>

<script setup lang="ts">
import { Button, Description, Label, Popover, Switch } from '@hareui/vue'
import { Icon } from '@iconify/vue'
// Port of HeroUI docs `components/design-theme-selector.tsx`.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import airbnb from '../assets/themes/airbnb.png'
import black from '../assets/themes/black.png'
import coinbase from '../assets/themes/coinbase.png'
import defaultImage from '../assets/themes/default.png'
import discord from '../assets/themes/discord.png'
import kumo from '../assets/themes/kumo.png'
import lavender from '../assets/themes/lavender.png'
import mint from '../assets/themes/mint.png'
import netflix from '../assets/themes/netflix.png'
import rabbit from '../assets/themes/rabbit.png'
import sky from '../assets/themes/sky.png'
import spotify from '../assets/themes/spotify.png'
import {
  DESIGN_THEME_CHANGE_EVENT,
  DESIGN_THEME_VALUES,
  getStoredDesignTheme,
  getStoredVibrantPalette,
  setStoredDesignTheme,
  setStoredVibrantPalette,
  type DesignThemeId,
} from '../design-theme'

const THEMES: { id: DesignThemeId; label: string; image: string }[] = [
  { id: 'default', image: defaultImage, label: 'Default' },
  { id: 'sky', image: sky, label: 'Sky' },
  { id: 'lavender', image: lavender, label: 'Lavender' },
  { id: 'mint', image: mint, label: 'Mint' },
  { id: 'netflix', image: netflix, label: 'Netflix' },
  { id: 'uber', image: black, label: 'Uber' },
  { id: 'spotify', image: spotify, label: 'Spotify' },
  { id: 'coinbase', image: coinbase, label: 'Coinbase' },
  { id: 'airbnb', image: airbnb, label: 'Airbnb' },
  { id: 'discord', image: discord, label: 'Discord' },
  { id: 'rabbit', image: rabbit, label: 'Rabbit' },
  { id: 'kumo', image: kumo, label: 'Kumo' },
]

const active = ref<DesignThemeId>('default')
const vibrant = ref(false)
const mounted = ref(false)

function syncAppearance() {
  active.value = getStoredDesignTheme()
  vibrant.value = getStoredVibrantPalette()
}
onMounted(() => {
  mounted.value = true
  syncAppearance()
  window.addEventListener(DESIGN_THEME_CHANGE_EVENT, syncAppearance)
})
onBeforeUnmount(() => window.removeEventListener(DESIGN_THEME_CHANGE_EVENT, syncAppearance))

const current = computed(() => THEMES.find((t) => t.id === active.value))
const showAvatar = computed(() => mounted.value && active.value !== 'default' && !!current.value)

// HeroUI links to its own /themes builder; HareUI ports it, so link to ours.
const themeBuilderHref = computed(() => {
  const values = DESIGN_THEME_VALUES[active.value]
  const params = new URLSearchParams({
    lightness: String(values.lightness),
    chroma: String(values.chroma),
    hue: String(values.hue),
  })
  return `/themes?${params}`
})

// HeroUI renders `ListBox` (layout="grid", selectionMode="single"); HareUI has no ListBox, so the
// option markup carries `.list-box` / `.list-box-item` classes from @heroui/styles plus the selector's overrides.
const options = ref<HTMLElement[]>([])
function focusOption(index: number) {
  options.value[(index + THEMES.length) % THEMES.length]?.focus()
}
function onOptionKeydown(event: KeyboardEvent, index: number) {
  const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 4, ArrowUp: -4 }[event.key]
  if (step) {
    event.preventDefault()
    focusOption(index + step)
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    setStoredDesignTheme(THEMES[index]!.id)
  }
}
</script>
