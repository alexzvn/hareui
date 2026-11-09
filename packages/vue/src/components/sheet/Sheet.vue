<template>
  <DialogRoot :open="isOpen" modal @update:open="onOpenChange">
    <DialogTrigger v-if="!!slots.default" as-child>
      <slot :open="isOpen" />
    </DialogTrigger>
    <DialogPortal :disabled="portalTarget.disabled" :to="portalTarget.to">
      <!-- Scrolling `scroller` moves the sheet in and out of view; sheetGeometry.ts lays it out -->
      <div
        v-if="isMounted"
        data-slot="sheet-overlay"
        :aria-hidden="isOpen ? undefined : 'true'"
        :data-closed="isOpen ? undefined : ''"
        :data-entering="isEntering ? '' : undefined"
        :data-exiting="isExiting ? '' : undefined"
        :inert="!isOpen"
        :style="overlayStyle(metrics, isOpen)"
        :class="ui.overlay({ class: 'data-[closed]:pointer-events-none' })"
      >
        <div
          data-slot="sheet-backdrop"
          :data-stack-index="stack.index"
          :style="backdrop"
          :class="ui.backdrop()"
        />
        <!-- A handle drag scrolls the scroller directly, so snapping pauses meanwhile -->
        <div
          ref="scroller"
          data-sheet-scroll
          :style="geometry.scroller"
          :class="ui.scroller({ class: 'data-[handle-dragging]:snap-none!' })"
        >
          <div
            data-sheet-snap
            :data-sheet-expanded="config.after ? undefined : ''"
            :style="geometry.startSnap"
          />
          <div ref="stage" :style="geometry.stage">
            <div
              data-slot="sheet-content"
              :data-placement="placement"
              :data-detached="detached ? '' : undefined"
              :data-snap-points="snapPoints.length ? '' : undefined"
              :data-expanded="isExpanded ? '' : undefined"
              :data-has-descendants="stack.descendants.length ? '' : undefined"
              :data-stack-index="stack.index"
              :style="contentStyle"
              :class="ui.content()"
            >
              <div v-if="snapPoints.length" :style="detentLayer">
                <div
                  v-for="(point, index) in snapPoints"
                  :key="index"
                  data-sheet-detent
                  data-sheet-snap
                  :style="detentStyle(config, point)"
                />
              </div>
              <DialogContent
                ref="dialogContent"
                force-mount
                data-slot="sheet-dialog"
                data-sheet-content
                :data-placement="placement"
                :aria-describedby="undefined"
                :style="dialogStyle(config, stack.index)"
                :class="ui.dialog()"
                @escape-key-down="onEscapeKeyDown"
                @interact-outside="onInteractOutside"
                @open-auto-focus="onOpenAutoFocus"
              >
                <VisuallyHidden v-if="slots.content && title" as-child>
                  <DialogTitle>{{ title }}</DialogTitle>
                </VisuallyHidden>
                <slot name="content" :close="close">
                  <div
                    v-if="showHandle && placement !== 'top'"
                    aria-hidden="true"
                    data-slot="sheet-handle"
                    :class="ui.handle({ class: 'touch-none select-none' })"
                    v-bind="handleDrag"
                  >
                    <span data-slot="sheet-handle-bar" :class="ui.handleBar()" />
                  </div>
                  <DialogClose v-if="closeButton" as-child>
                    <slot name="close" :close="close">
                      <ResolvedCloseButton
                        data-slot="sheet-close-trigger"
                        :close-button="closeButton"
                        label-key="closeButton.close"
                        :class="ui.closeTrigger()"
                      />
                    </slot>
                  </DialogClose>
                  <VisuallyHidden v-if="!showHeaderTitle" as-child>
                    <DialogTitle>{{ title }}</DialogTitle>
                  </VisuallyHidden>
                  <div v-if="hasHeader" data-slot="sheet-header" :class="ui.header()">
                    <slot name="header">
                      <DialogTitle
                        v-if="showHeaderTitle"
                        data-slot="sheet-heading"
                        :class="ui.heading()"
                      >
                        <slot name="title">
                          {{ title }}
                        </slot>
                      </DialogTitle>
                    </slot>
                  </div>
                  <div v-if="!!slots.body" data-slot="sheet-body" :class="ui.body()">
                    <slot name="body" :close="close" />
                  </div>
                  <div v-if="!!slots.footer" data-slot="sheet-footer" :class="ui.footer()">
                    <slot name="footer" :close="close" />
                  </div>
                  <div
                    v-if="showHandle && placement === 'top'"
                    aria-hidden="true"
                    data-slot="sheet-handle"
                    :class="ui.handle({ class: 'touch-none select-none' })"
                    v-bind="handleDrag"
                  >
                    <span data-slot="sheet-handle-bar" :class="ui.handleBar()" />
                  </div>
                </slot>
              </DialogContent>
            </div>
          </div>
          <div
            data-sheet-snap
            :data-sheet-expanded="config.after ? '' : undefined"
            :style="geometry.endSnap"
          />
        </div>
      </div>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  VisuallyHidden,
  useBodyScrollLock,
  useDirection,
} from 'reka-ui'
import { computed, onWatcherCleanup, reactive, useSlots, useTemplateRef, watch } from 'vue'

import ResolvedCloseButton from '@/components/close-button/ResolvedCloseButton.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useDialogShell } from '@/composables/useDialogShell'

import type { SheetEmits, SheetProps, SheetSlots } from './Sheet.types'
import {
  backdropStyle,
  detentLayerStyle,
  detentStyle,
  dialogStyle,
  getSwipeConfig,
  normalizeSnapPoints,
  overlayStyle,
  sheetGeometry,
  sheetStyle,
  swipeRange,
} from './sheetGeometry'
import { registerSheet, useSheetStack } from './sheetStack'
import theme from './theme'
import { useSheetHandleDrag } from './useSheetHandleDrag'
import { useSheetMotion } from './useSheetMotion'

// `undefined` defaults stop Vue casting absent boolean props to `false`, so uncontrolled mode and the placement-based
// handle default apply.
const props = withDefaults(defineProps<SheetProps>(), {
  open: undefined,
  portal: undefined,
  handle: undefined,
  dismissible: true,
  keyboardDismissible: true,
  closeButton: false,
  placement: 'bottom',
})

const emit = defineEmits<SheetEmits>()
const slots = useSlots()
defineSlots<SheetSlots>()

const snapPoints = computed(() => normalizeSnapPoints(props.snapPoints))

const ui = useComponentUI('sheet', {
  theme,
  variantProps: () => ({
    placement: props.placement,
    variant: props.variant,
    detached: props.detached,
    snap: snapPoints.value.length > 0,
  }),
  props,
  classSlot: 'content',
})

const dialogContent = useTemplateRef<{ $el: HTMLElement }>('dialogContent')
const scroller = useTemplateRef<HTMLElement>('scroller')
const stage = useTemplateRef<HTMLElement>('stage')

const {
  isOpen,
  portalTarget,
  showHeaderTitle,
  hasHeader,
  onOpenChange,
  onEscapeKeyDown,
  onInteractOutside,
  onOpenAutoFocus,
  presenceListeners,
} = useDialogShell({
  props,
  slots,
  emit,
  dialogContent,
  keyboardDismissible: () => props.keyboardDismissible,
})

const close = () => onOpenChange(false)
const config = computed(() => getSwipeConfig(props.placement))
const showHandle = computed(() => props.handle ?? config.value.axis === 'y')
const direction = useDirection()
const scrollLock = useBodyScrollLock(isOpen.value)

watch(isOpen, (open) => {
  scrollLock.value = open
})

const {
  isMounted,
  isExpanded,
  isEntering,
  isExiting,
  isTransitioning,
  isClamped,
  snapTravel,
  metrics,
  viewportPadding,
} = useSheetMotion({
  open: isOpen,
  config,
  scroller,
  stage,
  dialog: () => dialogContent.value?.$el,
  dismissible: () => props.dismissible,
  onSwipeAway: close,
  snapPoint: () => props.snapPoint,
  onSnapPointChange: (index) => emit('update:snapPoint', index),
  lifecycle: presenceListeners,
})

// Nested sheets stack by mount order: the sheets below follow the timelines of the ones above.
const stackEntry = reactive({
  range: computed(() => swipeRange(config.value, undefined)),
  direction: computed(() => config.value.viewDirection),
})

const stack = useSheetStack(stackEntry)

watch(
  isMounted,
  (mounted) => {
    if (mounted) onWatcherCleanup(registerSheet(stackEntry))
  },
  { immediate: true, flush: 'sync' },
)

const geometry = computed(() =>
  sheetGeometry({
    placement: props.placement,
    config: config.value,
    clamped: isClamped.value,
    snapDisabled: !props.dismissible && isTransitioning.value,
    travel: `${snapTravel.value}px`,
    padding: viewportPadding.value,
    scrollX: metrics.value.scrollX,
    scrollY: metrics.value.scrollY,
  }),
)

// Detached sheets float with a margin, so only attached ones extend their edge under an overscroll.
const hasOverscroll = computed(() => !props.detached)

const contentStyle = computed(() =>
  sheetStyle({
    placement: props.placement,
    config: config.value,
    direction: direction.value,
    hasOverscroll: hasOverscroll.value,
    index: stack.value.index,
    descendants: stack.value.descendants,
  }),
)

const detentLayer = computed(() => detentLayerStyle(props.placement, hasOverscroll.value))

// With snap points, the backdrop stays clear until the sheet passes the last one.
const backdrop = computed(() =>
  backdropStyle({
    config: config.value,
    range: swipeRange(config.value, snapPoints.value.at(-1)),
    index: stack.value.index,
    entering: isEntering.value,
    exiting: isExiting.value,
  }),
)

const handleDrag = useSheetHandleDrag({
  config: () => config.value,
  hasSnapPoints: () => snapPoints.value.length > 0,
  dismissible: () => props.dismissible,
  open: () => isOpen.value,
  close,
})
</script>
