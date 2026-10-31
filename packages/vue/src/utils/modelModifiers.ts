import type { DirectiveBinding, ObjectDirective, RendererNode, VNode } from 'vue'
import { vModelDynamic } from 'vue'

/**
 * `v-model` modifiers of a text control (`v-model.trim`, `v-model.number`, …). Each is `true` when set, as
 * `defineModel`'s modifier object types it.
 */
export type ModelModifiers = {
  /** Removes whitespace from both ends of the value. */
  trim?: true
  /** Converts the value with `parseFloat`; text that doesn't start with a number stays text. */
  number?: true
  /** Updates the value on `change` (blur or Enter) instead of on every keystroke. */
  lazy?: true
  /** Sets the value to `null` when the control is empty. */
  nullable?: true
  /** Sets the value to `undefined` when the control is empty; `nullable` takes precedence. */
  optional?: true
}

/** Name of a {@link ModelModifiers} key, for `defineModel`'s modifier type. */
export type ModelModifier = keyof ModelModifiers

// `0` and `false` are values of their own; whitespace-only text counts as empty, with or without `trim`
const isEmpty = (value: unknown) =>
  value === null || value === undefined || (typeof value === 'string' && value.trim() === '')

/**
 * Applies `nullable` / `optional`: an empty value (`null`, `undefined`, whitespace-only text) becomes `null` or
 * `undefined`; any other value passes through. Pass it as `defineModel`'s `set`.
 */
export const emptyModelValue = <T>(value: T, modifiers: ModelModifiers): T | null | undefined => {
  if (!isEmpty(value)) return value
  if (modifiers.nullable) return null
  if (modifiers.optional) return undefined

  return value
}

type TextControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
type ModelHook = 'created' | 'mounted' | 'beforeUpdate' | 'updated'
type TextVNode = VNode<RendererNode, TextControl>

type HookArgs = [
  el: TextControl,
  binding: DirectiveBinding,
  vnode: TextVNode,
  prevVNode: TextVNode | null,
]

const forwardHook = (hook: ModelHook, modifiers: () => ModelModifiers) => {
  return (...[el, binding, ...rest]: HookArgs) => {
    const { lazy = false, trim = false, number = false } = modifiers()
    const run = vModelDynamic[hook] as ((...args: HookArgs) => void) | undefined
    run?.(el, { ...binding, modifiers: { lazy, trim, number } }, ...rest)
  }
}

/**
 * `v-model` for a native `<input>` / `<textarea>` whose `lazy`, `trim` and `number` modifiers come from the
 * component at runtime (a template `v-model` only takes literal ones). Like `v-model` it reads them once, when the
 * element is created, waits for IME composition to end, casts `type="number"` values, and keeps a focused control's
 * text while it differs from the model only by surrounding whitespace or number formatting. It writes through the
 * element's `@update:model-value` listener, the one `v-model` generates.
 */
export const textModelDirective = (
  modifiers: () => ModelModifiers,
): ObjectDirective<TextControl> => ({
  created: forwardHook('created', modifiers),
  mounted: forwardHook('mounted', modifiers),
  beforeUpdate: forwardHook('beforeUpdate', modifiers),
  updated: forwardHook('updated', modifiers),
  // SSR calls this without a vnode, which `vModelDynamic` needs; text controls render their value as `v-model` does
  getSSRProps: ({ value }) => ({ value }),
})
