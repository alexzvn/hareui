<template>
  <div v-if="hasHeader" data-slot="sidebar-header" :class="ui.header()">
    <slot name="header" v-bind="sectionProps">
      <div v-if="hasTitle || hasDescription" data-slot="sidebar-wrapper" :class="ui.wrapper()">
        <p v-if="hasTitle" data-slot="sidebar-title" :class="ui.title()">
          <slot name="title" :state="state">{{ title }}</slot>
        </p>

        <p v-if="hasDescription" data-slot="sidebar-description" :class="ui.description()">
          <slot name="description" :state="state">{{ description }}</slot>
        </p>
      </div>

      <div v-if="!!slots.actions || canClose" data-slot="sidebar-actions" :class="ui.actions()">
        <slot name="actions" :state="state" />

        <slot name="close" :state="state" :ui="ui">
          <Button
            v-if="canClose"
            variant="ghost"
            size="sm"
            icon-only
            :aria-label="t('sidebar.close')"
            v-bind="closeAttrs"
            data-slot="sidebar-close"
            :class="ui.close({ override: closeClass })"
            @click="emit('close')"
          >
            <IconRenderer v-if="closeIcon" :icon="closeIcon" />
            <svg v-else aria-hidden="true" viewBox="0 0 16 16">
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L9.06 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L6.94 8L3.47 4.53a.75.75 0 0 1 0-1.06"
                clip-rule="evenodd"
              />
            </svg>
          </Button>
        </slot>
      </div>
    </slot>
  </div>

  <ScrollShadow data-slot="sidebar-body" hide-scroll-bar :class="ui.body()">
    <slot v-bind="sectionProps" />
  </ScrollShadow>

  <div v-if="!!slots.footer" data-slot="sidebar-footer" :class="ui.footer()">
    <slot name="footer" v-bind="sectionProps" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import Button from '@/components/button/Button.vue'
import ScrollShadow from '@/components/scroll-shadow/ScrollShadow.vue'
import { useLocale } from '@/composables/useLocale'
import { IconRenderer } from '@/utils/icon'

import type {
  SidebarCloseProps,
  SidebarSectionSlotProps,
  SidebarSlots,
  SidebarState,
  SidebarUI,
} from './Sidebar.types'

// The header, body and footer of a `Sidebar`, rendered in the desktop panel and again inside the mobile menu.
const props = defineProps<{
  ui: SidebarUI
  state: SidebarState
  open: boolean
  title?: string
  description?: string
  canClose: boolean
  closeButton: boolean | SidebarCloseProps
}>()

const emit = defineEmits<{ close: [] }>()

const slots = defineSlots<Omit<SidebarSlots, 'rail' | 'content'>>()
const { t } = useLocale()

const hasTitle = computed(() => !!props.title || !!slots.title)
const hasDescription = computed(() => !!props.description || !!slots.description)

const hasHeader = computed(
  () =>
    !!slots.header ||
    hasTitle.value ||
    hasDescription.value ||
    !!slots.actions ||
    !!slots.close ||
    props.canClose,
)

const closeOptions = computed<SidebarCloseProps>(() =>
  typeof props.closeButton === 'object' ? props.closeButton : {},
)

const closeIcon = computed(() => closeOptions.value.icon)
const closeClass = computed(() => closeOptions.value.class)

const closeAttrs = computed(() => {
  const { icon: _icon, class: _class, ...rest } = closeOptions.value
  return rest
})

const sectionProps = computed<SidebarSectionSlotProps>(() => ({
  state: props.state,
  open: props.open,
  close: () => emit('close'),
}))
</script>
