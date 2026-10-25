<template>
  <Primitive :as="as" :class="ui.base()">
    <abbr
      v-for="(key, index) in keyList"
      :key="index"
      :class="ui.abbr()"
      :title="kbdKeysLabelMap[key]"
      >{{ kbdKeysMap[key] }}</abbr
    ><span v-if="slots.default" :class="ui.content()"><slot /></span>
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import type { KbdProps, KbdSlots } from './Kbd.types'
import { kbdKeysLabelMap, kbdKeysMap } from './kbdKeys'
import theme from './theme'

const props = withDefaults(defineProps<KbdProps>(), { as: 'kbd' })
const slots = defineSlots<KbdSlots>()

const ui = useComponentUI('kbd', { theme, variantProps: () => ({ variant: props.variant }), props })

const keyList = computed(() => {
  if (props.keys === undefined) return []

  return Array.isArray(props.keys) ? props.keys : [props.keys]
})
</script>
