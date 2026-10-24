<template>
  <div class="flex flex-col gap-1">
    <LockableLabel
      label="Base"
      tooltip="Controls how much gray is used in neutrals like backgrounds and surfaces"
      variable="base"
    />
    <ChromaSlider
      class="h-6 w-[160px]"
      :hue="variables.hue"
      :value="variables.base"
      @change="handleBaseSliderChange"
    />
  </div>
</template>

<script setup lang="ts">
// Port of HeroUI docs `themes/components/base-color-slider.tsx`.
import { useVariablesState } from '../composables/variables'
import ChromaSlider from './ChromaSlider.vue'
import LockableLabel from './LockableLabel.vue'

const [variables, setVariables] = useVariablesState()

const handleBaseSliderChange = (value: number) => {
  setVariables({
    ...variables.value,
    base: value,
  })
}
</script>
