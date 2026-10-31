<template>
  <LinkResolver v-slot="link" :link="linkTarget">
    <Primitive
      :as="link.as"
      v-bind="toAttrs(link)"
      data-slot="link"
      :class="ui.base()"
      @click="onClick"
      @keydown="onKeydown($event, isHrefless(link))"
    >
      <Icon v-if="showIcon && iconPlacement === 'start'" />
      <slot />
      <Icon v-if="showIcon && iconPlacement === 'end'" />
    </Primitive>
  </LinkResolver>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, h } from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import { useComponentUI } from '@/composables/useComponentUI'
import type { LinkTarget, ResolvedLink } from '@/utils/link'
import { LinkResolver } from '@/utils/link'

import type { LinkProps, LinkSlots } from './Link.types'
import theme from './theme'

const props = withDefaults(defineProps<LinkProps>(), {
  as: 'a',
  iconPlacement: 'end',
  download: undefined,
  external: undefined,
  replace: undefined,
  exact: undefined,
  active: undefined,
})

const slots = defineSlots<LinkSlots>()

const ui = useComponentUI('link', { theme: theme, variantProps: () => ({}), props })
const isDisabled = useFieldsetDisabled(() => props.disabled)
const showIcon = computed(() => props.icon || !!slots.icon)

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

// HeroUI's ExternalLinkIcon (9×9, viewBox 0 0 7 7).
const defaultIcon = () =>
  h(
    'svg',
    {
      'aria-hidden': 'true',
      'data-slot': 'link-default-icon',
      fill: 'none',
      height: '9',
      role: 'presentation',
      viewBox: '0 0 7 7',
      width: '9',
      xmlns: 'http://www.w3.org/2000/svg',
    },
    [
      h('path', {
        d: 'M1.20592 6.84333L0.379822 6.01723L4.52594 1.8672H1.37819L1.38601 0.731812H6.48742V5.83714H5.34421L5.35203 2.6933L1.20592 6.84333Z',
        fill: 'currentColor',
      }),
    ],
  )

const Icon = () =>
  h(
    'span',
    {
      class: ui.value.icon(),
      'data-default-icon': slots.icon ? undefined : 'true',
      'data-slot': 'link-icon',
    },
    slots.icon ? slots.icon() : defaultIcon(),
  )

// React Aria renders a Link without an href (or a disabled one) as `role="link"`, focusable unless disabled and
// activated by Enter; a native anchor only gets that from its href.
const isHrefless = (link: ResolvedLink) => link.as === 'a' && !link.attrs.href

const toAttrs = (link: ResolvedLink) => {
  const isBare = isHrefless(link)

  return {
    ...link.attrs,
    role: isBare ? 'link' : undefined,
    tabindex: isBare && !isDisabled.value ? 0 : undefined,
    'aria-disabled': isDisabled.value ? 'true' : undefined,
    'data-disabled': isDisabled.value ? 'true' : undefined,
    'data-active': link.active ? 'true' : undefined,
  }
}

const onClick = (event: MouseEvent) => {
  if (!isDisabled.value) return

  event.preventDefault()
  event.stopImmediatePropagation()
}

const onKeydown = (event: KeyboardEvent, isBare: boolean) => {
  const isEnterPress = event.key === 'Enter' && !event.repeat
  if (!isBare || isDisabled.value || !isEnterPress) return

  const link = event.currentTarget as HTMLElement
  event.preventDefault()
  link.click()
}
</script>
