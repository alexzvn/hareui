import type { PrimitiveProps } from 'reka-ui'
import type { Component, VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Disclosure = typeof theme

/** Props of `Disclosure`, a collapsible section with a trigger that shows and hides its panel. */
export type DisclosureProps = {
  /**
   * The element or component to render the root as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /** Text rendered by the default trigger. Ignored when `#trigger` is used. */
  title?: string
  /**
   * Identifies this disclosure inside a `DisclosureGroup` (HeroUI's `id`): the group's
   * `v-model` holds these values. Defaults to a generated id.
   */
  value?: string | number
  /** The controlled expanded state of the disclosure. Use with `v-model:open`. */
  open?: boolean
  /**
   * The expanded state of the disclosure when it is initially rendered. Use when you do not
   * need to control its expanded state.
   * @defaultValue false
   */
  defaultOpen?: boolean
  /**
   * Whether the disclosure is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Disclosure>
}

/** Slots of `Disclosure`. */
export type DisclosureSlots = {
  /**
   * Replaces the whole trigger content (default: the `title` text followed by `#indicator`).
   * Compose it with your own interactive element (e.g. `Button`) for full control of the
   * trigger's look; the disclosure wires expand/collapse behavior onto that element.
   */
  trigger?: (props: {
    open: boolean
    /** The themed chevron (HeroUI's `Disclosure.Indicator`): render it with `<component :is="indicator" />`. */
    indicator: Component
  }) => VNode[]
  /** Replaces the chevron indicator rendered inside the default trigger. */
  indicator?: (props: { open: boolean }) => VNode[]
  /** The disclosure's panel content. */
  default?: () => VNode[]
}

/** Events emitted by `Disclosure`. */
export type DisclosureEmits = {
  /** Emitted when the expanded state changes. */
  'update:open': [value: boolean]
}
