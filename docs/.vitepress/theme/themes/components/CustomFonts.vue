<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <Link
        as="span"
        role="link"
        tabindex="0"
        class="flex items-center gap-1 no-underline"
        @click="emit('goToSuggested')"
        @keydown.enter="emit('goToSuggested')"
      >
        <Icon icon="gravity-ui:arrow-left" class="size-4" />
        Back
      </Link>
    </div>
    <TextField
      label="Font URL"
      description="Supports G Fonts, Fontsource and Fontshare"
      :invalid="showError"
      :error-message="errorMessage ?? undefined"
      :model-value="importForm.cdnUrl"
      @update:model-value="onCdnUrlChange"
    >
      <InputGroup
        variant="secondary"
        placeholder="Paste font URL..."
        @focusout="importForm.hasBlurred = true"
      >
        <template #prefix>
          <Icon icon="gravity-ui:globe" class="size-4 text-muted" />
        </template>
      </InputGroup>
    </TextField>
    <Button
      class="w-full"
      :disabled="!importForm.cdnUrl.trim() || validationError !== null || importForm.isImporting"
      size="sm"
      variant="secondary"
      @click="onImport"
    >
      {{ importForm.isImporting ? 'Importing...' : 'Import font' }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button, InputGroup, Link, TextField } from '@hareui/vue'
// Port of HeroUI docs `themes/components/custom-fonts.tsx`.
import { Icon } from '@iconify/vue'
import { computed, shallowReactive } from 'vue'

import { useCustomFonts } from '../composables/customFonts'
import { useVariableSetter } from '../composables/variables'
import { extractFontFamilyFromUrl, isValidFontCdnUrl } from '../utils/font-utils'

const emit = defineEmits<{ goToSuggested: [] }>()

const importForm = shallowReactive({
  cdnUrl: '',
  hasBlurred: false,
  importError: null as string | null,
  isImporting: false,
})

const { addCustomFont } = useCustomFonts()
const { setVariable } = useVariableSetter()

const validationError = computed<string | null>(() => {
  if (!importForm.cdnUrl.trim()) return null

  try {
    const parsedUrl = new URL(importForm.cdnUrl)

    if (parsedUrl.protocol !== 'https:') return 'URL must use https protocol'

    if (!isValidFontCdnUrl(importForm.cdnUrl))
      return 'URL must be from a supported CDN (Google Fonts, Fontsource, Bunny Fonts, etc.)'

    return null
  } catch {
    return 'Please enter a valid URL'
  }
})

const showValidationError = computed(() => importForm.hasBlurred && validationError.value !== null)
const showError = computed(() => showValidationError.value || importForm.importError !== null)
const errorMessage = computed(() => importForm.importError ?? validationError.value)

const onCdnUrlChange = (value: string | number | undefined) => {
  importForm.cdnUrl = String(value ?? '')
  importForm.importError = null
}

const onImport = () => {
  if (validationError.value) return

  importForm.isImporting = true
  importForm.importError = null

  // Validate that we can extract a font family from the URL
  const fontFamily = extractFontFamilyFromUrl(importForm.cdnUrl)

  if (!fontFamily) {
    importForm.importError = 'Could not detect font family from URL. Please check the URL format.'
    importForm.isImporting = false

    return
  }

  // Add to localStorage for the font picker list
  const result = addCustomFont(importForm.cdnUrl)

  if ('error' in result) {
    const message =
      result.error === 'already-imported'
        ? 'This font is already imported as "{name}"'.replace('{name}', result.label)
        : 'Could not detect font family from URL. Please ensure the URL is a valid font stylesheet.'

    importForm.importError = message
    importForm.isImporting = false

    return
  }

  // Store the URL directly in the query params (makes it shareable!)
  setVariable('fontFamily', importForm.cdnUrl)
  importForm.cdnUrl = ''
  importForm.hasBlurred = false
  importForm.isImporting = false
  emit('goToSuggested')
}
</script>
