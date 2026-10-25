<template>
  <Primitive
    ref="self"
    :as="as"
    v-bind="attrs"
    data-slot="button"
    :data-pending="pending ? 'true' : undefined"
    :aria-busy="pending ? 'true' : undefined"
    :class="ui.base({ class: groupClass })"
    @click.capture="onClickCapture"
    @keydown="onKeydown"
    @keyup="onKeyup"
  >
    <span
      v-if="shouldShowSeparator"
      aria-hidden="true"
      data-slot="button-group-separator"
      :class="group!.ui.value.separator()"
    />
    <slot name="leading" :pending="pending">
      <Spinner v-if="pending" size="sm" color="current" :class="ui.spinner()" />
    </slot>
    <slot :pending="pending" />
    <slot name="trailing" :pending="pending" />
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, inject, provide, useTemplateRef } from 'vue'

import { buttonGroupContextKey } from '@/components/button-group/context'
import { useFieldsetDisabled } from '@/components/fieldset/context'
import Spinner from '@/components/spinner/Spinner.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { refElement } from '@/composables/useFirstChild'

import type { ButtonProps, ButtonSlots } from './Button.types'
import theme from './theme'

const props = withDefaults(defineProps<ButtonProps>(), {
  as: 'button',
  type: 'button',
  disabled: undefined,
  fullWidth: undefined,
})

defineSlots<ButtonSlots>()

// A ButtonGroup's props apply to its own Buttons only (HeroUI marks direct children), so hide it from nested ones.
const group = inject(buttonGroupContextKey, null)
provide(buttonGroupContextKey, null)

const variant = computed(() => props.variant ?? group?.variant.value)
const ui = useComponentUI('button', {
  theme,
  variantProps: () => ({
    variant: variant.value,
    size: props.size ?? group?.size.value,
    fullWidth: props.fullWidth ?? group?.fullWidth.value,
    iconOnly: props.iconOnly,
  }),
  props,
})

const groupClass = computed(() => {
  if (!group) return undefined
  const groupUI = group.ui.value

  return [groupUI.button(), variant.value === 'outline' && groupUI.buttonOutline()]
})

// HeroUI renders `ButtonGroup.Separator` in every grouped Button except the first.
const self = useTemplateRef<unknown>('self')
const shouldShowSeparator = computed(
  (): boolean => !!group?.separator.value && group.firstChild.value !== refElement(self.value),
)

const isNativeButton = computed(() => props.as === 'button')
const isDisabled = useFieldsetDisabled(() => props.disabled ?? group?.disabled.value)

const attrs = computed(() => {
  if (isNativeButton.value) {
    return {
      type: props.type,
      disabled: isDisabled.value || undefined,
      'aria-disabled': props.pending ? 'true' : undefined,
    }
  }

  // React Aria `useButton`: non-button elements get `role="button"` and join the tab order. Disabled ones leave it
  // (-1 rather than omitted, so a disabled `<a href>` stays out too).
  return {
    role: 'button',
    'aria-disabled': isDisabled.value || props.pending ? 'true' : undefined,
    tabindex: isDisabled.value ? -1 : 0,
  }
})

const onClickCapture = (event: MouseEvent) => {
  if (props.pending || (isDisabled.value && !isNativeButton.value)) {
    event.preventDefault()
    event.stopImmediatePropagation()
  }
}

// usePress keyboard activation for non-button elements: Enter clicks on keydown, Space on keyup; both prevent page scroll.
// Anchors with an href already activate natively on Enter.
const isKeyboardTarget = (event: KeyboardEvent) => {
  return !isNativeButton.value && !isDisabled.value && event.target === event.currentTarget
}

const onKeydown = (event: KeyboardEvent) => {
  if (!isKeyboardTarget(event)) return
  const el = event.currentTarget as HTMLElement

  if (event.key === ' ') {
    event.preventDefault()
    return
  }

  const isLink = el instanceof HTMLAnchorElement && el.hasAttribute('href')
  if (event.key !== 'Enter' || isLink) return

  event.preventDefault()
  if (!event.repeat) el.click()
}

const onKeyup = (event: KeyboardEvent) => {
  if (isKeyboardTarget(event) && event.key === ' ') {
    event.preventDefault()
    ;(event.currentTarget as HTMLElement).click()
  }
}
</script>
