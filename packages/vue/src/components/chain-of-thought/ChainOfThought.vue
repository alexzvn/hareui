<template>
  <Disclosure
    data-slot="chain-of-thought"
    :data-streaming="streaming ? 'true' : undefined"
    :open="isOpen"
    :disabled="disabled"
    :ui="{
      base: ui.base(),
      heading: ui.heading(),
      content: ui.content(),
      body: ui.body(),
    }"
    @update:open="onUpdateOpen"
  >
    <template #trigger="{ indicator }">
      <button data-slot="chain-of-thought-trigger" :class="ui.trigger()">
        <slot name="label" :streaming="streaming" :duration="resolvedDuration">
          <TextShimmer v-if="streaming">{{ label }}</TextShimmer>
          <span v-else>{{ label }}</span>
        </slot>
        <component :is="indicator" :class="ui.indicator()" />
      </button>
    </template>
    <slot :open="isOpen">
      <div v-if="resolvedSteps.length" data-slot="chain-of-thought-steps" :class="ui.steps()">
        <div
          v-for="(step, index) in resolvedSteps"
          :key="index"
          data-slot="chain-of-thought-step"
          :data-status="step.status ?? 'done'"
          :class="ui.step({ status: step.status ?? 'done', override: step.class })"
        >
          <div v-if="step.label || slots['step-label']" :class="ui.stepHeader()">
            <IconRenderer
              v-if="step.icon"
              :icon="step.icon"
              data-slot="chain-of-thought-step-icon"
              aria-hidden="true"
              :class="ui.stepIcon()"
            />
            <span v-else aria-hidden="true" :class="ui.stepIndicator()" />
            <span :class="ui.stepLabel()">
              <slot name="step-label" :step="step" :index="index">
                <TextShimmer v-if="step.status === 'active'">{{ step.label }}</TextShimmer>
                <template v-else>{{ step.label }}</template>
              </slot>
            </span>
          </div>
          <div :class="ui.stepContent()">
            <slot name="step-content" :step="step" :index="index">{{ step.content }}</slot>
          </div>
        </div>
      </div>
    </slot>
  </Disclosure>
</template>

<script setup lang="ts">
import { defu } from 'defu'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import Disclosure from '@/components/disclosure/Disclosure.vue'
import TextShimmer from '@/components/text-shimmer/TextShimmer.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useControllableOpen } from '@/composables/useControllableOpen'
import { useLocale } from '@/composables/useLocale'
import { IconRenderer } from '@/utils/icon'

import type {
  ChainOfThoughtEmits,
  ChainOfThoughtProps,
  ChainOfThoughtSlots,
  ChainOfThoughtStep,
} from './ChainOfThought.types'
import theme from './theme'

// `open: undefined` keeps an absent prop uncontrolled instead of Vue's boolean `false`
const props = withDefaults(defineProps<ChainOfThoughtProps>(), {
  open: undefined,
  defaultOpen: undefined,
  streaming: false,
})

const emit = defineEmits<ChainOfThoughtEmits>()
const slots = defineSlots<ChainOfThoughtSlots>()

const { t, code } = useLocale()

const auto = computed(() => defu(props.auto, { open: true, closeDelay: 500 }))

const ui = useComponentUI('chainOfThought', {
  theme,
  variantProps: () => ({ streaming: props.streaming }),
  props,
})

const resolvedSteps = computed<ChainOfThoughtStep[]>(() => {
  if (props.steps?.length) return props.steps

  return props.text ? [{ content: props.text }] : []
})

const { isOpen, setOpen } = useControllableOpen({
  open: () => props.open,
  defaultOpen: props.defaultOpen ?? (props.streaming && auto.value.open),
  onUpdate: (open) => emit('update:open', open),
})

const startedAt = ref<number>()
const measuredDuration = ref<number>()

// Set when the user toggles while streaming, so the auto-collapse leaves their choice alone
const hasUserToggled = ref(false)
let closeTimer: ReturnType<typeof setTimeout> | undefined

const clearCloseTimer = () => {
  clearTimeout(closeTimer)
  closeTimer = undefined
}

watch(
  () => props.streaming,
  (streaming, wasStreaming) => {
    if (streaming) {
      clearCloseTimer()

      if (wasStreaming) return

      hasUserToggled.value = false
      startedAt.value = Date.now()

      if (auto.value.open && wasStreaming !== undefined) setOpen(true)

      return
    }

    if (!wasStreaming) return

    if (startedAt.value !== undefined) {
      measuredDuration.value = Math.max(1, Math.ceil((Date.now() - startedAt.value) / 1000))
      startedAt.value = undefined
    }

    if (auto.value.closeDelay > 0 && !hasUserToggled.value) {
      closeTimer = setTimeout(() => setOpen(false), auto.value.closeDelay)
    }
  },
  { immediate: true },
)

onBeforeUnmount(clearCloseTimer)

const onUpdateOpen = (open: boolean) => {
  if (props.streaming) hasUserToggled.value = true

  clearCloseTimer()
  setOpen(open)
}

const resolvedDuration = computed(() => props.duration ?? measuredDuration.value)

const label = computed(() => {
  if (props.label) return props.label

  const duration = resolvedDuration.value

  if (props.streaming) return t('chainOfThought.thinking')
  if (!duration) return t('chainOfThought.thought')

  const isSeconds = duration < 60
  const formatted = new Intl.NumberFormat(code.value, {
    style: 'unit',
    unit: isSeconds ? 'second' : 'minute',
    unitDisplay: 'long',
  }).format(isSeconds ? duration : Math.floor(duration / 60))

  return t('chainOfThought.thoughtFor', { duration: formatted })
})
</script>
