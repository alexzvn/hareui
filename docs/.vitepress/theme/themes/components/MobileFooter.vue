<script setup lang="ts">
// Port of HeroUI docs `themes/components/mobile-footer.tsx`.
import { ScrollShadow } from '@hareui/vue'
import { ref } from 'vue'

import { THEME_BUILDER_BOTTOM_SHEET_ID, formRadiusOptions, radiusOptions } from '../constants'
import AccentColorSelector from './AccentColorSelector.vue'
import BaseColorSlider from './BaseColorSlider.vue'
import BottomSheet from './BottomSheet.vue'
import FontFamilyPopover from './FontFamilyPopover.vue'
import RadiusPopover from './RadiusPopover.vue'
import ShuffleButton from './ShuffleButton.vue'
import ThemeInput from './ThemeInput.vue'
import ThemesList from './ThemesList.vue'

const isSheetOpen = ref(false)
</script>

<template>
  <div
    class="fixed start-0 end-0 bottom-0 z-50 flex w-full items-center justify-between gap-4 border-t border-separator bg-background px-6 pt-3 pb-4 sm:hidden"
  >
    <div class="w-full cursor-pointer" @click="isSheetOpen = true">
      <ThemeInput />
    </div>
    <ShuffleButton :enable-keyboard-shortcut="false" />
  </div>
  <BottomSheet v-model:isOpen="isSheetOpen" :id="THEME_BUILDER_BOTTOM_SHEET_ID">
    <div class="flex w-full flex-col items-start md:items-center">
      <div class="mb-4 flex w-full justify-center pb-2">
        <div class="h-1.5 w-9 rounded-sm bg-separator" />
      </div>
      <ThemesList />
      <div class="h-6" />
      <div class="flex w-full flex-wrap gap-4 gap-x-0 md:w-auto">
        <div class="mb-4 flex items-center gap-4 ps-4">
          <AccentColorSelector />
          <BaseColorSlider />
        </div>
        <ScrollShadow
          hide-scroll-bar
          class="flex w-full items-center gap-4 px-4 pb-4 md:w-auto"
          orientation="horizontal"
          visibility="none"
        >
          <FontFamilyPopover />
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
        </ScrollShadow>
      </div>
    </div>
  </BottomSheet>
</template>
