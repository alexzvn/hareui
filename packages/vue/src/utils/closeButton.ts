import type { CloseButtonOptions, CloseButtonProp } from '@/types/closeButton'

/** The options of a `closeButton` prop; `true`, `false` and `undefined` yield none. */
export const resolveCloseButton = (value: CloseButtonProp | undefined): CloseButtonOptions =>
  typeof value === 'object' && value !== null ? value : {}
