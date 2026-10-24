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

/** The resolved theme: one function per slot returning its class string, with optional extra classes. */
export type ComponentUI<T extends ThemeShape> = {
  [K in keyof T['slots']]: (props?: { class?: ClassValue }) => string
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
