import type { ClassValue } from '@/utils/tv'

/** The classes of a variant value or compound variant: one class value, or class values per slot. */
type VariantClasses = ClassValue | Record<string, ClassValue>

/** A compound variant: the variant values it matches (a value or a list of them) plus the classes it adds. */
type CompoundVariant = {
  class?: VariantClasses
  className?: VariantClasses
  [variant: string]: unknown
}

/** The shape of a component theme (tailwind-variants options): per-slot base classes, variants, compound variants and defaults. */
export type ThemeShape = {
  /** Base classes of each slot (element) of the component. */
  slots: Record<string, ClassValue>
  /** Classes added per variant value, keyed by variant name then value. */
  variants?: Record<string, Record<string, VariantClasses>>
  /** Classes added when several variant values match together. */
  compoundVariants?: CompoundVariant[]
  /** The variant values used when a prop is not set. */
  defaultVariants?: Record<string, unknown>
}

/** The value each variant of a theme accepts, e.g. `{ size: 'sm' | 'md' | 'lg' }`. */
export type ComponentVariants<T extends ThemeShape> = {
  [K in keyof T['variants']]: keyof T['variants'][K]
}

/** Extra classes per slot of a theme: the type of a component's `ui` prop. */
export type ComponentSlots<T extends ThemeShape> = {
  [K in keyof T['slots']]?: ClassValue
}

/**
 * Classes a slot call adds over the resolved theme. `class` holds the component's own additions, below the
 * user's `ui` and `class` props; `override` holds a more specific user input (a column's or an item's own
 * classes) that must beat them.
 */
export type SlotClasses = {
  /** Component-internal classes, applied over the theme and under the `ui` / `class` props. */
  class?: ClassValue
  /** Classes applied last, over the `ui` / `class` props. */
  override?: ClassValue
}

/** A variant's value as a slot call accepts it: one of its keys, or a boolean for a `true` / `false` variant. */
type SlotVariantValue<V> = keyof V | ('true' extends keyof V ? boolean : never)

/** The per-call variant values a slot function accepts, e.g. `{ active?: boolean; size?: 'sm' | 'md' }`. */
export type SlotVariants<T extends ThemeShape> = {
  [K in keyof T['variants']]?: SlotVariantValue<T['variants'][K]>
}

/**
 * The resolved theme: one function per slot returning its class string, layered with the `ui` / `class` props.
 * Keys besides `class` / `override` are per-call variant values of the theme (e.g. a list item's own `variant`).
 */
export type ComponentUI<T extends ThemeShape> = {
  [K in keyof T['slots']]: (classes?: SlotClasses & SlotVariants<T>) => string
}

/**
 * A partial theme merged over a component's default theme, as passed to `createHareUI({ ui })` or the Vite
 * plugin's `ui` option.
 */
export type ThemeOverride<T extends ThemeShape> = {
  /** Classes appended to each slot's base classes. */
  slots?: ComponentSlots<T>
  /** Classes appended per variant value. */
  variants?: {
    [K in keyof T['variants']]?: Record<string, VariantClasses>
  }
  /** Compound variants added to the theme's own. */
  compoundVariants?: CompoundVariant[]
  /** Replacement default variant values. */
  defaultVariants?: { [K in keyof T['variants']]?: keyof T['variants'][K] }
}
