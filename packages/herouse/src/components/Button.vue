<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { ComponentSlots, ComponentVariants } from '../types/tv'
import theme from '../theme/button'

type Button = typeof theme

export interface ButtonProps {
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
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Button>
}

export interface ButtonSlots {
  /** Content rendered before the label. Replaces the pending spinner. */
  leading?: (props: { pending: boolean }) => any
  /** The button label. */
  default?: (props: { pending: boolean }) => any
  /** Content rendered after the label. */
  trailing?: (props: { pending: boolean }) => any
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, inject, provide } from 'vue'
import { useComponentUI } from '../composables/useComponentUI'
import { buttonGroupContextKey } from './buttonGroupContext'
import Spinner from './Spinner.vue'
import { useFieldsetDisabled } from './fieldsetContext'

const props = withDefaults(defineProps<ButtonProps>(), { as: 'button', type: 'button', disabled: undefined, fullWidth: undefined })
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
  if (!group)
    return undefined
  const groupUI = group.ui.value
  const overrides = group.uiOverrides.value
  return [
    groupUI.button({ class: overrides?.button }),
    variant.value === 'outline' && groupUI.buttonOutline({ class: overrides?.buttonOutline }),
  ]
})

const isNativeButton = computed(() => props.as === 'button')
const isDisabled = useFieldsetDisabled(() => props.disabled ?? group?.disabled.value)

const attrs = computed(() => {
  if (isNativeButton.value) {
    return {
      'type': props.type,
      'disabled': isDisabled.value || undefined,
      'aria-disabled': props.pending ? 'true' : undefined,
    }
  }
  return {
    'aria-disabled': isDisabled.value || props.pending ? 'true' : undefined,
    'tabindex': isDisabled.value ? -1 : undefined,
  }
})

function onClickCapture(event: MouseEvent) {
  if (props.pending || (isDisabled.value && !isNativeButton.value)) {
    event.preventDefault()
    event.stopImmediatePropagation()
  }
}
</script>

<template>
  <Primitive
    :as="as"
    v-bind="attrs"
    data-slot="button"
    :data-pending="pending ? 'true' : undefined"
    :aria-busy="pending ? 'true' : undefined"
    :class="ui.base({ class: [groupClass, props.ui?.base, props.class] })"
    @click.capture="onClickCapture"
  >
    <span
      v-if="group?.separator.value"
      aria-hidden="true"
      data-slot="button-group-separator"
      :class="group.ui.value.separator({ class: group.uiOverrides.value?.separator })"
    />
    <slot name="leading" :pending="pending">
      <Spinner v-if="pending" size="sm" color="current" :class="ui.spinner({ class: props.ui?.spinner })" />
    </slot>
    <slot :pending="pending" />
    <slot name="trailing" :pending="pending" />
  </Primitive>
</template>
