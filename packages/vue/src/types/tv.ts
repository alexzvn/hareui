import type { ClassValue } from '@/utils/tv'

/** The classes of a variant value or compound variant: one class value, or class values per slot. */
type VariantClasses = ClassValue | Record<string, ClassValue>

/** A compound variant: the variant values it matches (a value or a list of them) plus the classes it adds. */
type CompoundVariant = {
  class?: VariantClasses
  className?: VariantClasses
  [variant: string]: unknown
}

export type ThemeShape = {
  slots: Record<string, ClassValue>
  variants?: Record<string, Record<string, VariantClasses>>
  compoundVariants?: CompoundVariant[]
  defaultVariants?: Record<string, unknown>
}

export type ComponentVariants<T extends ThemeShape> = {
  [K in keyof T['variants']]: keyof T['variants'][K]
}

export type ComponentSlots<T extends ThemeShape> = {
  [K in keyof T['slots']]?: ClassValue
}

export type ComponentUI<T extends ThemeShape> = {
  [K in keyof T['slots']]: (props?: { class?: ClassValue }) => string
}

export type ThemeOverride<T extends ThemeShape> = {
  slots?: ComponentSlots<T>
  variants?: {
    [K in keyof T['variants']]?: Record<string, VariantClasses>
  }
  compoundVariants?: CompoundVariant[]
  defaultVariants?: { [K in keyof T['variants']]?: keyof T['variants'][K] }
}
