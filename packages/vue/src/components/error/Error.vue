<template>
  <Primitive
    :as="as.root"
    data-slot="error"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <div
      v-if="slots.leading"
      data-slot="error-leading"
      :class="ui.leading({ class: props.ui?.leading })"
    >
      <slot name="leading" :ui="ui" />
    </div>
    <p
      v-if="statusCode || slots.statusCode"
      data-slot="error-status-code"
      :class="ui.statusCode({ class: props.ui?.statusCode })"
    >
      <slot name="statusCode">
        {{ statusCode }}
      </slot>
    </p>
    <Primitive
      v-if="statusMessage || slots.statusMessage"
      :as="as.statusMessage"
      data-slot="error-status-message"
      :class="ui.statusMessage({ class: props.ui?.statusMessage })"
    >
      <slot name="statusMessage">
        {{ statusMessage }}
      </slot>
    </Primitive>
    <p
      v-if="(error?.message && error.message !== statusMessage) || slots.message"
      data-slot="error-message"
      :class="ui.message({ class: props.ui?.message })"
    >
      <slot name="message">
        {{ error?.message }}
      </slot>
    </p>
    <div
      v-if="clear || slots.links"
      data-slot="error-links"
      :class="ui.links({ class: props.ui?.links })"
    >
      <slot name="links">
        <Button
          v-if="clear"
          :as="redirect ? 'a' : 'button'"
          size="lg"
          v-bind="clearButtonProps"
          :href="redirect || undefined"
          @click="emit('clear', $event)"
        >
          {{ clearLabel }}
        </Button>
      </slot>
    </div>
    <slot />
  </Primitive>
</template>

<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'

import type { ButtonProps } from '@/components/button/Button.vue'
import type { ComponentSlots, ComponentUI } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'

type ErrorTheme = typeof theme

/** The error to display. Accepts Nuxt's `NuxtError` (`statusCode`/`statusMessage`) and H3's `status`/`statusText` alike. */
export interface ErrorValue {
  statusCode?: number
  status?: number
  statusMessage?: string
  statusText?: string
  message?: string
}

/** Props of the clear button: those of `Button`, plus its `label`. */
export type ErrorClearProps = ButtonProps & { label?: string }

export interface ErrorProps {
  /**
   * The element or component to render as. An object sets the element per part (`{ root, statusMessage }`).
   * @defaultValue 'main'
   */
  as?: PrimitiveProps['as'] | { root?: PrimitiveProps['as']; statusMessage?: PrimitiveProps['as'] }
  /** The error to display: status code, status message and message. */
  error?: ErrorValue
  /**
   * The URL the clear button links to. Set it to an empty string to render a plain button and handle `clear` yourself.
   * @defaultValue '/'
   */
  redirect?: string
  /**
   * The button that clears the error. An object is forwarded to the `Button` (`label` sets its text); `false` hides it.
   * `{ size: 'lg', variant: 'primary', label: 'Back to home' }`
   * @defaultValue true
   */
  clear?: boolean | ErrorClearProps
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ErrorTheme>
}

export interface ErrorSlots {
  /** Content rendered after the links. */
  default?: () => unknown
  /** Content above the status code, e.g. an icon. */
  leading?: (props: { ui: ComponentUI<ErrorTheme> }) => unknown
  /** The status code. Defaults to `error.statusCode`. */
  statusCode?: () => unknown
  /** The status message heading. Defaults to `error.statusMessage`. */
  statusMessage?: () => unknown
  /** The error message. Defaults to `error.message`. */
  message?: () => unknown
  /** Replaces the clear button. */
  links?: () => unknown
}

export interface ErrorEmits {
  /** Fired when the clear button is clicked, before it follows `redirect`. Call `event.preventDefault()` to navigate yourself. */
  clear: [event: MouseEvent]
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed } from 'vue'

import Button from '@/components/button/Button.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { resolveAs } from '@/utils/resolveAs'

const props = withDefaults(defineProps<ErrorProps>(), {
  as: 'main',
  redirect: '/',
  clear: true,
})
const emit = defineEmits<ErrorEmits>()
const slots = defineSlots<ErrorSlots>()

const ui = useComponentUI('error', theme, () => ({}))

const as = computed(() => resolveAs(props.as, { root: 'main', statusMessage: 'h1' }))
const statusCode = computed(() => props.error?.statusCode || props.error?.status)
const statusMessage = computed(() => props.error?.statusMessage || props.error?.statusText)
const clearProps = computed<ErrorClearProps>(() =>
  typeof props.clear === 'object' ? props.clear : {},
)
const clearLabel = computed(() => clearProps.value.label ?? 'Back to home')
const clearButtonProps = computed(() => {
  const { label: _label, ...button } = clearProps.value
  return button
})
</script>
