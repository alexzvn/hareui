<template>
  <div
    :id="THEME_BUILDER_PAGE_ID"
    class="grid h-dvh grid-rows-[auto_1fr_auto] bg-background px-4 sm:overflow-hidden sm:px-6"
  >
    <template v-if="isMounted">
      <h1 class="sr-only">Theme Builder</h1>
      <BuilderHeader />
      <ThemeBuilderContent />
      <div
        class="mx-auto hidden items-center justify-between gap-4 py-6 max-[1200px]:flex-col sm:flex"
      >
        <div class="flex items-center gap-4">
          <AccentColorSelector />
          <BaseColorSlider />
          <FontFamilyPopover />
        </div>
        <div class="flex items-center gap-4">
          <RadiusPopover
            description="Affects the overall UI, like menus and modals"
            label="Radius"
            :radius-options="radiusOptions"
            variable-key="radius"
          />
          <RadiusPopover
            description="Affects form elements, like inputs and selects"
            label="Radius Form"
            :radius-options="formRadiusOptions"
            variable-key="formRadius"
          />
          <ThemePopover />
        </div>
      </div>
      <div class="h-20 w-full sm:hidden" />
      <MobileFooter />
    </template>
  </div>
  <Onboarding v-if="isMounted" />
</template>

<script setup lang="ts">
// Theme builder (`layout: themes`): port of HeroUI docs `app/[lang]/themes/page.tsx`.
// Left out: metadata (frontmatter in docs/themes.md), `ProBanner`, `DictionaryProvider` (strings are inlined).
// The builder state lives in the URL query, which only exists on the client, so the page body renders after mount
// (the server markup is the empty page shell) instead of hydrating against defaults.
import { onMounted, ref } from 'vue'

import AccentColorSelector from './components/AccentColorSelector.vue'
import BaseColorSlider from './components/BaseColorSlider.vue'
import BuilderHeader from './components/BuilderHeader.vue'
import FontFamilyPopover from './components/FontFamilyPopover.vue'
import MobileFooter from './components/MobileFooter.vue'
import Onboarding from './components/Onboarding.vue'
import RadiusPopover from './components/RadiusPopover.vue'
import ThemeBuilderContent from './components/ThemeBuilderContent.vue'
import ThemePopover from './components/ThemePopover.vue'
import { THEME_BUILDER_PAGE_ID, formRadiusOptions, radiusOptions } from './constants'

const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
</script>
