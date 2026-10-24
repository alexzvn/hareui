import type { TypographyProps } from './Typography.types'

/** The semantic element each `type` renders by default (overridden by `as`). */
export const defaultElementByType: Record<NonNullable<TypographyProps['type']>, string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body: 'p',
  'body-sm': 'p',
  'body-xs': 'p',
  code: 'code',
}
