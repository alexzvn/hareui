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
      :model-value="cdnUrl"
      @update:model-value="onCdnUrlChange"
    >
      <InputGroup variant="secondary" placeholder="Paste font URL..." @focusout="hasBlurred = true">
        <template #prefix>
          <Icon icon="gravity-ui:globe" class="size-4 text-muted" />
        </template>
      </InputGroup>
    </TextField>
    <Button
      class="w-full"
      :disabled="!cdnUrl.trim() || validationError !== null || isImporting"
      size="sm"
      variant="secondary"
      @click="handleImport"
    >
      {{ isImporting ? 'Importing...' : 'Import font' }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button, InputGroup, Link, TextField } from '@hareui/vue'
// Port of HeroUI docs `themes/components/custom-fonts.tsx`.
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'

import { useCustomFonts } from '../composables/customFonts'
import { useVariableSetter } from '../composables/variables'
import { extractFontFamilyFromUrl, isValidFontCdnUrl } from '../utils/font-utils'

const emit = defineEmits<{ goToSuggested: [] }>()

const cdnUrl = ref('')
const hasBlurred = ref(false)
const importError = ref<string | null>(null)
const isImporting = ref(false)
const { addCustomFont } = useCustomFonts()
const { setVariable } = useVariableSetter()

const validationError = computed<string | null>(() => {
  if (!cdnUrl.value.trim()) return null

  try {
    const parsedUrl = new URL(cdnUrl.value)

    if (parsedUrl.protocol !== 'https:') return 'URL must use https protocol'
    if (!isValidFontCdnUrl(cdnUrl.value))
      return 'URL must be from a supported CDN (Google Fonts, Fontsource, Bunny Fonts, etc.)'

    return null
  } catch {
    return 'Please enter a valid URL'
  }
})
const showValidationError = computed(() => hasBlurred.value && validationError.value !== null)
const showError = computed(() => showValidationError.value || importError.value !== null)
const errorMessage = computed(() => importError.value ?? validationError.value)

const onCdnUrlChange = (value: string | number | undefined) => {
  cdnUrl.value = String(value ?? '')
  importError.value = null
}

const handleImport = () => {
  if (validationError.value) return

  isImporting.value = true
  importError.value = null

  // Validate that we can extract a font family from the URL
  const fontFamily = extractFontFamilyFromUrl(cdnUrl.value)

  if (!fontFamily) {
    importError.value = 'Could not detect font family from URL. Please check the URL format.'
    isImporting.value = false

    return
  }

  // Add to localStorage for the font picker list
  const result = addCustomFont(cdnUrl.value)

  if ('error' in result) {
    const message =
      result.error === 'already-imported'
        ? 'This font is already imported as "{name}"'.replace('{name}', result.label)
        : 'Could not detect font family from URL. Please ensure the URL is a valid font stylesheet.'

    importError.value = message
    isImporting.value = false
  } else {
    // Store the URL directly in the query params (makes it shareable!)
    setVariable('fontFamily', cdnUrl.value)
    cdnUrl.value = ''
    hasBlurred.value = false
    isImporting.value = false
    emit('goToSuggested')
  }
}
</script>
