import type { ClassValue } from 'tailwind-variants'

export type ThemeShape = {
  slots: Record<string, ClassValue>
  variants?: Record<string, Record<string, any>>
  compoundVariants?: any[]
  defaultVariants?: Record<string, any>
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
    [K in keyof T['variants']]?: Record<string, ClassValue | Record<string, ClassValue>>
  }
  compoundVariants?: any[]
  defaultVariants?: { [K in keyof T['variants']]?: keyof T['variants'][K] }
}
