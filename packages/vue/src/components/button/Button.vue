<template>
  <Primitive
    ref="self"
    :as="as"
    v-bind="attrs"
    data-slot="button"
    :data-pending="pending ? 'true' : undefined"
    :aria-busy="pending ? 'true' : undefined"
    :class="ui.base({ class: [groupClass, props.ui?.base, props.class] })"
    @click.capture="onClickCapture"
    @keydown="onKeydown"
    @keyup="onKeyup"
  >
    <span
      v-if="showSeparator"
      aria-hidden="true"
      data-slot="button-group-separator"
      :class="group!.ui.value.separator({ class: group!.uiOverrides.value?.separator })"
    />
    <slot name="leading" :pending="pending">
      <Spinner
        v-if="pending"
        size="sm"
        color="current"
        :class="ui.spinner({ class: props.ui?.spinner })"
      />
    </slot>
    <slot :pending="pending" />
    <slot name="trailing" :pending="pending" />
  </Primitive>
</template>

<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'

type Button = typeof theme

export type ButtonProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'button'
   */
  as?: PrimitiveProps['as']
  /**
   * The native button type. Only applied when rendered as a `button`.
   * @defaultValue 'button'
   */
  type?: 'button' | 'submit' | 'reset'
  /**
   * Visual style of the button.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<Button>['variant']
  /**
   * Size of the button.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<Button>['size']
  /**
   * Whether the button takes the full width of its container.
   * @defaultValue false
   */
  fullWidth?: boolean
  /**
   * Whether the button only contains an icon (square shape).
   * @defaultValue false
   */
  iconOnly?: boolean
  /**
   * Whether the button is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the button is in a pending state: shows a spinner, blocks clicks, stays focusable.
   * @defaultValue false
   */
  pending?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Button>
}

export type ButtonSlots = {
  /** Content rendered before the label. Replaces the pending spinner. */
  leading?: (props: { pending: boolean }) => VNode[]
  /** The button label. */
  default?: (props: { pending: boolean }) => VNode[]
  /** Content rendered after the label. */
  trailing?: (props: { pending: boolean }) => VNode[]
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, inject, provide, useTemplateRef } from 'vue'

import { buttonGroupContextKey } from '@/components/button-group/context'
import { useFieldsetDisabled } from '@/components/fieldset/context'
import Spinner from '@/components/spinner/Spinner.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { refElement } from '@/composables/useFirstChild'

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
const ui = useComponentUI('button', theme, () => ({
  variant: variant.value,
  size: props.size ?? group?.size.value,
  fullWidth: props.fullWidth ?? group?.fullWidth.value,
  iconOnly: props.iconOnly,
}))

const groupClass = computed(() => {
  if (!group) return undefined
  const groupUI = group.ui.value
  const overrides = group.uiOverrides.value

  return [
    groupUI.button({ class: overrides?.button }),
    variant.value === 'outline' && groupUI.buttonOutline({ class: overrides?.buttonOutline }),
  ]
})

// HeroUI renders `ButtonGroup.Separator` in every grouped Button except the first.
const self = useTemplateRef<unknown>('self')
const showSeparator = computed(
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
  } else if (
    event.key === 'Enter' &&
    !(el instanceof HTMLAnchorElement && el.hasAttribute('href'))
  ) {
    event.preventDefault()
    if (!event.repeat) el.click()
  }
}

const onKeyup = (event: KeyboardEvent) => {
  if (isKeyboardTarget(event) && event.key === ' ') {
    event.preventDefault()
    ;(event.currentTarget as HTMLElement).click()
  }
}
</script>
