<template>
  <StepperRoot
    :as="as"
    :model-value="currentIndex + 1"
    :orientation="orientation"
    :linear="linear"
    data-slot="stepper"
    :class="ui.root()"
  >
    <ol data-slot="stepper-header" :class="ui.header()">
      <StepperStep
        v-for="(item, index) in items"
        :key="index"
        v-slot="{ state }"
        as="li"
        :step="index + 1"
        :disabled="disabled || !!item.disabled"
        data-slot="stepper-item"
        :class="ui.item({ override: [item.ui?.item, item.class] })"
      >
        <StepperTrigger
          data-slot="stepper-trigger"
          v-bind="getLabelAttrs(item)"
          :class="ui.trigger({ override: item.ui?.trigger })"
          :data-pressed="spacePressedIndex === index ? 'true' : undefined"
          @click="selectStep(index)"
          @keydown.enter.exact="selectStep(index)"
          @keydown.space.exact="spacePressedIndex = index"
          @keyup.space="releaseSpace(index)"
          @blur="spacePressedIndex = undefined"
        >
          <StepperIndicator
            as="span"
            data-slot="stepper-indicator"
            :data-state="state"
            :data-settled="index < settledIndex ? 'true' : undefined"
            :class="ui.indicator({ override: item.ui?.indicator })"
          >
            <slot name="indicator" :item="item" :index="index" :state="state" :ui="ui">
              <IconRenderer
                v-if="item.icon"
                :icon="item.icon"
                data-slot="stepper-icon"
                :class="ui.icon({ override: item.ui?.icon })"
              />
              <svg
                v-else-if="state === 'completed'"
                aria-hidden="true"
                data-slot="stepper-check"
                :data-settled="index < settledIndex ? 'true' : undefined"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                viewBox="0 0 17 18"
                :class="ui.check({ override: item.ui?.check })"
              >
                <polyline points="1 9 7 14 15 4" />
              </svg>
              <template v-else>{{ index + 1 }}</template>
            </slot>
          </StepperIndicator>

          <span
            v-if="hasWrapper(item)"
            data-slot="stepper-wrapper"
            :class="ui.wrapper({ override: item.ui?.wrapper })"
          >
            <slot
              :name="getSlotName(item, 'wrapper')"
              :item="item"
              :index="index"
              :state="state"
              :ui="ui"
            >
              <StepperTitle
                v-if="item.title || hasSlot(item, 'title')"
                as="span"
                data-slot="stepper-title"
                :data-state="state"
                :class="ui.title({ override: item.ui?.title })"
              >
                <slot
                  :name="getSlotName(item, 'title')"
                  :item="item"
                  :index="index"
                  :state="state"
                  :ui="ui"
                >
                  {{ item.title }}
                </slot>
              </StepperTitle>

              <StepperDescription
                v-if="item.description || hasSlot(item, 'description')"
                as="span"
                data-slot="stepper-description"
                :data-state="state"
                :class="ui.description({ override: item.ui?.description })"
              >
                <slot
                  :name="getSlotName(item, 'description')"
                  :item="item"
                  :index="index"
                  :state="state"
                  :ui="ui"
                >
                  {{ item.description }}
                </slot>
              </StepperDescription>
            </slot>
          </span>
        </StepperTrigger>

        <StepperSeparator
          v-if="index < items.length - 1"
          data-slot="stepper-separator"
          :class="ui.separator({ override: item.ui?.separator })"
        >
          <span
            data-slot="stepper-separator-fill"
            :style="{ '--stepper-separator-progress': resolveProgress(item, state) }"
            :class="ui.separatorFill({ override: item.ui?.separatorFill })"
          />
        </StepperSeparator>
      </StepperStep>
    </ol>

    <div
      v-if="currentItem && hasContent(currentItem)"
      data-slot="stepper-content"
      :class="ui.content()"
    >
      <slot
        :name="getSlotName(currentItem, '')"
        :item="currentItem"
        :index="currentIndex"
        state="active"
        :ui="ui"
      >
        {{ currentItem.content }}
      </slot>
    </div>
  </StepperRoot>
</template>

<script setup lang="ts" generic="T extends StepperItem = StepperItem">
import {
  StepperDescription,
  StepperIndicator,
  StepperItem as StepperStep,
  StepperRoot,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from 'reka-ui'
import { computed, ref, watch } from 'vue'

import { useActiveIndex } from '@/composables/useActiveIndex'
import { useComponentUI } from '@/composables/useComponentUI'
import { IconRenderer } from '@/utils/icon'
import { resolveSlotName } from '@/utils/slotName'

import type {
  StepperEmits,
  StepperItemState,
  StepperItem,
  StepperProps,
  StepperSlots,
} from './Stepper.types'
import theme from './theme'

type SlotSuffix = '' | 'wrapper' | 'title' | 'description'

const GENERIC_SLOT: Record<SlotSuffix, string> = {
  '': 'content',
  wrapper: 'wrapper',
  title: 'title',
  description: 'description',
}

const resolveProgress = (item: StepperItem, state: StepperItemState) =>
  item.progress ?? (state === 'completed' ? 1 : 0)

// `modelValue: undefined` keeps the uncontrolled mode when no `v-model` is bound.
const props = withDefaults(defineProps<StepperProps<T>>(), {
  as: 'div',
  size: 'md',
  color: 'accent',
  orientation: 'horizontal',
  valueKey: 'value',
  modelValue: undefined,
  defaultValue: 0,
  linear: true,
  disabled: false,
})

const emit = defineEmits<StepperEmits<T>>()
const slots = defineSlots<StepperSlots<T>>()

const ui = useComponentUI('stepper', {
  theme,
  variantProps: () => ({ orientation: props.orientation, size: props.size, color: props.color }),
  props,
  classSlot: 'root',
})

const { activeIndex: currentIndex, setActiveIndex } = useActiveIndex({
  items: () => props.items,
  valueKey: () => props.valueKey,
  modelValue: () => props.modelValue,
  defaultValue: props.defaultValue,
})

const currentItem = computed<T | undefined>(() => props.items[currentIndex.value])
const hasNext = computed(() => currentIndex.value < props.items.length - 1)
const hasPrev = computed(() => currentIndex.value > 0)

const setIndex = (index: number) => emit('update:modelValue', setActiveIndex(index))

// Reka selects a step on mouse-down; a step is chosen on click (release), on Enter's keydown or on Space's
// keyup instead, as a native button does, so pressing a step only dims it until the press ends on it. Reka
// disables the steps a linear stepper can't reach yet, so they get neither event.
const selectStep = (index: number) => {
  if (index !== currentIndex.value) setIndex(index)
}

// Reka cancels the button's own Space activation, so the held key is tracked here; moving focus away cancels it.
const spacePressedIndex = ref<number>()

const releaseSpace = (index: number) => {
  if (spacePressedIndex.value !== index) return

  spacePressedIndex.value = undefined
  selectStep(index)
}

// Steps below this index have been complete since mount, so they show their check without the completion
// motion; it plays only for steps that become complete while the stepper is on screen.
const settledIndex = ref(currentIndex.value)
watch(currentIndex, (index) => {
  settledIndex.value = Math.min(settledIndex.value, index)
})

// An item's `slot` is an optional override: a step whose own slot isn't provided renders through the shared one.
const getSlotName = (item: StepperItem, suffix: SlotSuffix) => {
  const own = item.slot && resolveSlotName({ slot: item.slot, suffix })
  if (own && slots[own]) return own

  return GENERIC_SLOT[suffix]
}

const hasSlot = (item: StepperItem, suffix: SlotSuffix) => !!slots[getSlotName(item, suffix)]

const hasWrapper = (item: StepperItem) => {
  const hasTitle = !!item.title || hasSlot(item, 'title')
  const hasDescription = !!item.description || hasSlot(item, 'description')
  const hasCustomSlot = hasSlot(item, 'wrapper')

  return hasTitle || hasDescription || hasCustomSlot
}

const hasContent = (item: StepperItem) => !!item.content || hasSlot(item, '')

// The trigger is named and described by the step's title and description; drop the references when they
// aren't rendered, so they don't point at missing elements.
const getLabelAttrs = (item: StepperItem) => {
  const hasCustomWrapper = hasSlot(item, 'wrapper')
  const hasTitle = !!item.title || hasSlot(item, 'title')
  const hasDescription = !!item.description || hasSlot(item, 'description')

  return {
    ...(hasTitle && !hasCustomWrapper ? {} : { 'aria-labelledby': undefined }),
    ...(hasDescription && !hasCustomWrapper ? {} : { 'aria-describedby': undefined }),
  }
}

// Emits the step moved to; read before the parent updates a bound `v-model`.
const moveTo = (index: number, event: 'next' | 'prev') => {
  setIndex(index)

  const item = props.items[index] as T
  if (event === 'next') emit('next', item)
  if (event === 'prev') emit('prev', item)
}

defineExpose({
  next: () => {
    if (hasNext.value) moveTo(currentIndex.value + 1, 'next')
  },
  prev: () => {
    if (hasPrev.value) moveTo(currentIndex.value - 1, 'prev')
  },
  hasNext,
  hasPrev,
})
</script>
