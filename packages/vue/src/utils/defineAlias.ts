import type { Component } from 'vue'
import { defineComponent, h, shallowRef } from 'vue'

import type { ComponentProps } from '@/types/component'
import type { ClassValue } from '@/utils/tv'

/** The type of a component's `ui` prop, or `never` when it has none. */
type ComponentUIProp<T> = ComponentProps<T> extends { ui?: infer U } ? U : never

type SlotClassMap = Record<string, ClassValue>

/** Preset defaults of a component made with `defineAlias`. */
export type AliasPreset<T extends Component> = {
  /** Default props, listeners and attributes. Values the instance passes win. */
  props?: Partial<Omit<ComponentProps<T>, 'class' | 'ui'>>
  /** Per-slot classes, applied under the instance's own `ui` for the same slot. */
  ui?: ComponentUIProp<T>
  /** Root classes, applied before the instance's own `class`. */
  class?: ClassValue
}

// Per slot, the instance's classes come after the preset's, so tailwind-merge lets them win on conflicts.
const mergeUI = (preset?: SlotClassMap, instance?: SlotClassMap) => {
  if (!preset || !instance) return preset ?? instance

  const slots = new Set([...Object.keys(preset), ...Object.keys(instance)])

  return Object.fromEntries([...slots].map((slot) => [slot, [preset[slot], instance[slot]]]))
}

/**
 * Creates a preset of a component: a component that renders `component` with preset `props`, `ui` and `class`.
 * Props, listeners and attributes passed to the preset win over its defaults; `ui` merges per slot and `class`
 * adds to the preset's. Slots, `v-model` and the wrapped component's exposed methods are forwarded.
 * @example
 * ```ts
 * const DangerButton = defineAlias(Button, { props: { variant: 'danger' }, class: 'uppercase' })
 * ```
 */
export const defineAlias = <T extends Component>(component: T, preset: AliasPreset<T> = {}): T => {
  // Every component's `ui` prop maps slot names to class values; `T` is unresolved here.
  const presetUI = preset.ui as SlotClassMap | undefined

  const alias = defineComponent({
    inheritAttrs: false,
    setup(_, { attrs, slots, expose }) {
      const inner = shallowRef<Record<PropertyKey, unknown> | null>(null)

      // Template refs on the preset reach the wrapped component's exposed API.
      expose(
        new Proxy(
          {},
          {
            get: (_target, key) => inner.value?.[key],
            has: (_target, key) => !!inner.value && key in inner.value,
          },
        ),
      )

      return () => {
        // Spread, not mergeProps: an instance listener replaces the preset's (Button's loadingAuto awaits one
        // handler's promise), and instance keys come last, so Vue resolves a kebab-case one over a camelCase preset.
        const props: Record<string, unknown> = { ...preset.props, ...attrs }
        const ui = mergeUI(presetUI, attrs.ui as SlotClassMap | undefined)
        if (preset.class !== undefined) props.class = [preset.class, attrs.class]
        if (ui) props.ui = ui

        return h(component, { ...props, ref: inner }, slots)
      }
    },
  })

  // Renders `component` with the same props, slots and events, so it is typed as the component itself.
  return alias as unknown as T
}
