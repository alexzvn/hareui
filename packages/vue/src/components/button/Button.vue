<template>
  <LinkResolver v-slot="link" :link="linkTarget" :button="!isLink">
    <Primitive
      ref="self"
      :as="isLink ? link.as : as"
      v-bind="isLink ? toLinkAttrs(link.attrs) : attrs"
      data-slot="button"
      :data-active="isLink && link.active ? 'true' : undefined"
      :data-pending="isPending ? 'true' : undefined"
      :aria-busy="isPending ? 'true' : undefined"
      :class="ui.base({ class: groupClass })"
      @click.capture="onClickCapture"
      @click="onPress"
      @keydown="onKeydown"
      @keyup="onKeyup"
    >
      <span
        v-if="shouldShowSeparator"
        aria-hidden="true"
        data-slot="button-group-separator"
        :class="group!.ui.value.separator()"
      />
      <slot name="leading" :pending="isPending">
        <Spinner v-if="isPending" size="sm" color="current" :class="ui.spinner()" />
        <IconRenderer
          v-else-if="leadingIcon"
          :icon="leadingIcon"
          data-slot="button-leading-icon"
          :class="ui.leadingIcon()"
        />
        <Avatar
          v-else-if="avatar"
          v-bind="{ ...avatar, class: ui.avatar({ override: avatar.class }) }"
          data-slot="button-avatar"
        />
      </slot>
      <slot :pending="isPending">
        <span v-if="label" data-slot="button-label" :class="ui.label()">{{ label }}</span>
      </slot>
      <slot name="trailing" :pending="isPending">
        <IconRenderer
          v-if="trailingIcon"
          :icon="trailingIcon"
          data-slot="button-trailing-icon"
          :class="ui.trailingIcon()"
        />
      </slot>
    </Primitive>
  </LinkResolver>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, inject, provide, ref, useTemplateRef } from 'vue'

import Avatar from '@/components/avatar/Avatar.vue'
import { buttonGroupContextKey } from '@/components/button-group/context'
import { useFieldsetDisabled } from '@/components/fieldset/context'
import { formContextKey } from '@/components/form/context'
import Spinner from '@/components/spinner/Spinner.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { refElement } from '@/composables/useFirstChild'
import { IconRenderer } from '@/utils/icon'
import type { LinkTarget } from '@/utils/link'
import { LinkResolver } from '@/utils/link'

import type { ButtonProps, ButtonSlots } from './Button.types'
import theme from './theme'

const props = withDefaults(defineProps<ButtonProps>(), {
  as: 'button',
  type: 'button',
  disabled: undefined,
  fullWidth: undefined,
  external: undefined,
  download: undefined,
  replace: undefined,
  exact: undefined,
  active: undefined,
})

const slots = defineSlots<ButtonSlots>()

// A ButtonGroup's props apply to its own Buttons only (HeroUI marks direct children), so hide it from nested ones.
const group = inject(buttonGroupContextKey, null)
provide(buttonGroupContextKey, null)

const form = inject(formContextKey, null)

// `loadingAuto`: pending while the click handler's promise runs, or (submit buttons) while the parent Form submits.
const isClickPending = ref(false)

const isFormPending = computed(
  () => props.loadingAuto && props.type === 'submit' && !!form?.loading.value,
)

const isPending = computed(() => props.pending || isClickPending.value || isFormPending.value)

// An icon or avatar without a label or default slot makes the button square, like `iconOnly`.
const isIconOnly = computed(
  () =>
    props.iconOnly ||
    (!props.label && !slots.default && !!(props.leadingIcon || props.trailingIcon || props.avatar)),
)

const variant = computed(() => props.variant ?? group?.variant.value)
const ui = useComponentUI('button', {
  theme,
  variantProps: () => ({
    variant: variant.value,
    size: props.size ?? group?.size.value,
    fullWidth: props.fullWidth ?? group?.fullWidth.value,
    iconOnly: isIconOnly.value,
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

const ownDisabled = () => props.disabled ?? group?.disabled.value
const isFieldsetDisabled = useFieldsetDisabled(ownDisabled)

// A submitting Form disables its fields; its pending submit button stays enabled so it keeps focus (pending already
// blocks clicks). Its own `disabled` still applies.
const isDisabled = computed(
  () => isFieldsetDisabled.value && (!isFormPending.value || !!ownDisabled()),
)

const isLink = computed(() => props.to !== undefined || props.href !== undefined)
const isNativeButton = computed(() => !isLink.value && props.as === 'button')

const linkTarget = computed((): LinkTarget => ({
  as: props.as,
  to: props.to,
  href: props.href,
  target: props.target,
  rel: props.rel,
  download: props.download,
  external: props.external,
  replace: props.replace,
  exact: props.exact,
  active: props.active,
  disabled: isDisabled.value,
}))

const attrs = computed(() => {
  if (isNativeButton.value) {
    return {
      type: props.type,
      disabled: isDisabled.value || undefined,
      'aria-disabled': isPending.value ? 'true' : undefined,
    }
  }

  // React Aria `useButton`: non-button elements get `role="button"` and join the tab order. Disabled ones leave it
  // (-1 rather than omitted, so a disabled `<a href>` stays out too).
  return {
    role: 'button',
    'aria-disabled': isDisabled.value || isPending.value ? 'true' : undefined,
    tabindex: isDisabled.value ? -1 : 0,
  }
})

// A link keeps link semantics; a disabled one has no `href` (LinkResolver) and leaves the tab order.
const toLinkAttrs = (resolved: Record<string, unknown>) => ({
  ...resolved,
  'aria-disabled': isDisabled.value || isPending.value ? 'true' : undefined,
  tabindex: isDisabled.value ? -1 : undefined,
})

const onClickCapture = (event: MouseEvent) => {
  if (isPending.value || (isDisabled.value && !isNativeButton.value)) {
    event.preventDefault()
    event.stopImmediatePropagation()
  }
}

// Handlers run synchronously; awaiting them only drives `loadingAuto`, and a rejection still reaches Vue's error handler.
const onPress = async (event: MouseEvent) => {
  const handlers = [props.onClick ?? []].flat()
  if (props.loadingAuto) isClickPending.value = true

  try {
    await Promise.all(handlers.map((handler) => handler(event)))
  } finally {
    isClickPending.value = false
  }
}

// usePress keyboard activation for non-button elements: Enter clicks on keydown, Space on keyup; both prevent page scroll.
// Anchors with an href already activate natively on Enter, and links keep native link keys.
const isKeyboardTarget = (event: KeyboardEvent) => {
  return (
    !isLink.value &&
    !isNativeButton.value &&
    !isDisabled.value &&
    event.target === event.currentTarget
  )
}

const onKeydown = (event: KeyboardEvent) => {
  if (!isKeyboardTarget(event)) return
  const el = event.currentTarget as HTMLElement

  if (event.key === ' ') {
    event.preventDefault()
    return
  }

  const isAnchor = el instanceof HTMLAnchorElement && el.hasAttribute('href')
  if (event.key !== 'Enter' || isAnchor) return

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
