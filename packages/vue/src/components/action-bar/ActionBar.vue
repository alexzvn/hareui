<template>
  <Presence :present="isOpen">
    <div data-slot="action-bar" :data-state="isOpen ? 'open' : 'closed'" :class="ui.base()">
      <Toolbar
        v-bind="$attrs"
        :aria-label="props.ariaLabel ?? t('actionBar.label')"
        :orientation="orientation"
        :attached="attached"
        :class="ui.toolbar()"
      >
        <div v-if="$slots.prefix" data-slot="action-bar-prefix" :class="ui.prefix()">
          <slot name="prefix" v-bind="slotProps" />
        </div>
        <Separator v-if="$slots.prefix && ($slots.default || $slots.suffix)" />
        <div v-if="$slots.default" data-slot="action-bar-content" :class="ui.content()">
          <slot v-bind="slotProps" />
        </div>
        <Separator v-if="$slots.default && $slots.suffix" />
        <div v-if="$slots.suffix" data-slot="action-bar-suffix" :class="ui.suffix()">
          <slot name="suffix" v-bind="slotProps" />
        </div>
      </Toolbar>
    </div>
  </Presence>
</template>

<script setup lang="ts">
import { Presence } from 'reka-ui'
import { computed } from 'vue'

import Separator from '@/components/separator/Separator.vue'
import Toolbar from '@/components/toolbar/Toolbar.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useControllableOpen } from '@/composables/useControllableOpen'
import { useLocale } from '@/composables/useLocale'

import type {
  ActionBarEmits,
  ActionBarProps,
  ActionBarSlotProps,
  ActionBarSlots,
} from './ActionBar.types'
import theme from './theme'

// `$attrs` (id, data-*, listeners) belong on the toolbar, next to its role and label.
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ActionBarProps>(), {
  open: undefined,
  attached: true,
  orientation: 'horizontal',
})

const emit = defineEmits<ActionBarEmits>()
defineSlots<ActionBarSlots>()

const { t } = useLocale()

const { isOpen, setOpen } = useControllableOpen({
  open: () => props.open,
  defaultOpen: props.defaultOpen,
  onUpdate: (value) => emit('update:open', value),
})

const ui = useComponentUI('actionBar', {
  theme,
  variantProps: () => ({ orientation: props.orientation }),
  props,
  classSlot: 'toolbar',
})

const slotProps = computed<ActionBarSlotProps>(() => ({
  labelClass: ui.value.label(),
  close: () => setOpen(false),
}))
</script>
