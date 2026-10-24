import { converter, parse } from 'culori'

const toOklch = converter('oklch')

const formatNumber = (value: number | undefined): string => {
  if (typeof value !== 'number') return '0'
  return Number(value.toFixed(4)).toString()
}

/** Converts any CSS color string (resolved rgb/hex/etc.) into an `oklch(...)` string. */
export const toOklchCss = (value: string): string => {
  const parsed = parse(value)
  if (!parsed) return value

  const oklch = toOklch(parsed)
  if (!oklch) return value

  if (typeof oklch.alpha === 'number' && oklch.alpha < 1) {
    return `oklch(${formatNumber(oklch.l)} ${formatNumber(oklch.c)} ${formatNumber(oklch.h)} / ${formatNumber(oklch.alpha)})`
  }

  return `oklch(${formatNumber(oklch.l)} ${formatNumber(oklch.c)} ${formatNumber(oklch.h)})`
}

/** Reads the computed background color of the clicked element, converts it to oklch, and copies it. */
export const copyColorValue = async (event: MouseEvent, fallback?: string): Promise<void> => {
  const target = event.currentTarget as HTMLElement
  const computedValue = getComputedStyle(target).backgroundColor || fallback
  const value = computedValue ? toOklchCss(computedValue) : fallback || ''

  if (!value) return

  await navigator.clipboard.writeText(value)
  flashSwatch(target)
}

/** Briefly pulses the clicked swatch to indicate the value was copied, without disturbing its label. */
const flashSwatch = (target: HTMLElement): void => {
  target.classList.add('outline', 'outline-2', 'outline-offset-2', 'outline-current')
  window.setTimeout(() => {
    target.classList.remove('outline', 'outline-2', 'outline-offset-2', 'outline-current')
  }, 600)
}

export const getTokenName = (content: string | undefined, fallback: string): string => {
  if (!content) return fallback
  return content.split(':')[0]?.trim() || fallback
}

export const contrastStyle = (bgVar: string): Record<string, string> => {
  return {
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    backgroundColor: `var(${bgVar})`,
    color: 'transparent',
    filter: 'invert(1) grayscale(1) contrast(100)',
  }
}
