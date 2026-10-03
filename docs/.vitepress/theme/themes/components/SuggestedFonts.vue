<script setup lang="ts">
// Port of HeroUI docs `themes/components/suggested-fonts.tsx`.
import type { CustomFont } from '../composables/customFonts'
import { Icon } from '@iconify/vue'
import { Button, ListBox, ScrollShadow, Tooltip } from '@hareui/vue'
import { computed, onMounted, watch } from 'vue'
import { useCustomFonts } from '../composables/customFonts'
import { useVariableSetter } from '../composables/variables'
import { defaultThemeVariables, fonts } from '../constants'
import { injectFontLink, isCustomFontUrl } from '../utils/font-utils'

const props = defineProps<{
  customFonts: readonly CustomFont[]
}>()
const emit = defineEmits<{ goToCustom: [] }>()

const { setVariable, variables } = useVariableSetter()
const { removeCustomFont } = useCustomFonts()

// Inject font links for all suggested fonts so they can be previewed
onMounted(() => {
  fonts.forEach((font) => {
    injectFontLink(font.id, font.cdnUrl)
  })
})

// Inject font links for all custom fonts so they can be previewed
watch(() => props.customFonts, (customFonts) => {
  customFonts.forEach((font) => {
    injectFontLink(font.id, font.url)
  })
}, { immediate: true })

// Also inject font link if current selection is a URL-based font
watch(() => variables.value.fontFamily, (fontFamily) => {
  if (isCustomFontUrl(fontFamily)) {
    injectFontLink('current-url-font', fontFamily)
  }
}, { immediate: true })

// Combine suggested fonts with custom fonts for the list
// For custom fonts, use the URL as the ID (for shareable links)
const allFonts = computed(() => [
  ...fonts.map(f => ({ ...f, isCustom: false, url: f.cdnUrl })),
  ...props.customFonts.map(f => ({
    cdnUrl: f.url,
    id: f.url, // Use URL as ID so it's stored in the URL params
    isCustom: true,
    label: f.label,
    url: f.url,
    variable: f.variable,
  })),
])

const items = computed(() => allFonts.value.map(font => ({
  value: font.id,
  label: font.label,
  textValue: font.label,
  class: 'group border-separator-on-surface relative flex h-[83px] w-[95px] flex-col items-center justify-center gap-[5px] rounded-2xl border data-[selected=true]:border-foreground data-[hovered=true]:bg-default',
})))
const fontById = computed(() => new Map(allFonts.value.map(font => [font.id, font])))

// The selected key is the fontFamily value (either a font ID or a CDN URL)
const selectedKey = computed(() => variables.value.fontFamily)

function handleDeleteCustomFont(fontUrl: string) {
  // Find the font by URL and remove it
  const font = props.customFonts.find(f => f.url === fontUrl)

  if (font) {
    removeCustomFont(font.id)
  }
  // If the deleted font was selected, switch to Inter
  if (variables.value.fontFamily === fontUrl) {
    setVariable('fontFamily', defaultThemeVariables.fontFamily)
  }
}

function fontStyle(label?: string) {
  return { fontFamily: `"${label}", sans-serif` }
}

function onSelectionChange(selected: unknown) {
  // `disallowEmptySelection`: clicking the selected item keeps it selected
  if (selected) {
    setVariable('fontFamily', String(selected))
  }
}
</script>

<template>
  <div class="mb-2 flex items-center justify-between">
    <p class="text-sm font-medium capitalize">
      {{ customFonts.length > 0 ? 'All Fonts' : 'Suggested' }}
    </p>
    <Button size="sm" variant="ghost" @click="emit('goToCustom')">
      Add from CDN
      <Icon icon="gravity-ui:plus" class="size-4" />
    </Button>
  </div>
  <ScrollShadow hide-scroll-bar class="max-h-56 pb-3" :size="15">
    <ListBox
      aria-label="Font Family"
      class="grid grid-cols-3 gap-2 p-0"
      :items="items"
      :model-value="selectedKey"
      selection-mode="single"
      @update:model-value="onSelectionChange"
    >
      <template #item="{ item }">
        <!-- HeroUI sets `fontFamily` on the item itself; the children are its only text, so they carry it here -->
        <span class="text-xl font-medium" :style="fontStyle(item.label)">Ag</span>
        <p
          class="max-w-[80px] truncate text-[10px] text-muted group-data-[selected=true]:text-foreground"
          :style="fontStyle(item.label)"
        >
          {{ item.label }}
        </p>
        <Tooltip v-if="fontById.get(item.value as string)?.isCustom" :delay="100" arrow>
          <div
            data-slot="tooltip-trigger"
            class="absolute end-1 top-1 inline-block [transition:color_150ms_var(--ease-smooth),background-color_150ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none focus-visible:status-focused"
          >
            <Button
              icon-only
              class="size-5 min-h-0 min-w-0 p-0 opacity-0 group-data-[hovered=true]:opacity-100"
              size="sm"
              variant="ghost"
              @click.stop="handleDeleteCustomFont(fontById.get(item.value as string)!.url)"
              @keydown.stop
            >
              <Icon icon="gravity-ui:trash-bin" class="size-3 text-danger" />
            </Button>
          </div>
          <template #content>
            <p>Remove font</p>
          </template>
        </Tooltip>
      </template>
    </ListBox>
  </ScrollShadow>
</template>
