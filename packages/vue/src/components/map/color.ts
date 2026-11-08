import type { MapColor } from './types'

const THEME_COLORS: Record<string, string> = {
  default: 'var(--muted)',
  accent: 'var(--accent)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
}

/** `color` as a CSS color: a theme color name becomes its variable, anything else stays as is. */
export const toCssColor = (color: MapColor) => THEME_COLORS[color] ?? color

/**
 * Resolves CSS colors to the `rgb()`/`rgba()` form maplibre-gl parses. A hidden `probe` element inside the map computes
 * the color, so variables resolve in the map's own color scheme; colors in other spaces (`oklch()`, `color-mix()`) are
 * drawn on a 1×1 canvas and read back. Results are cached until `clear()`.
 */
export const createColorResolver = (probe: () => HTMLElement | null | undefined) => {
  const cache = new Map<string, string>()
  let context: OffscreenCanvasRenderingContext2D | null | undefined

  const rasterize = (color: string) => {
    if (context === undefined) {
      context =
        typeof OffscreenCanvas === 'undefined'
          ? null
          : new OffscreenCanvas(1, 1).getContext('2d', { willReadFrequently: true })
    }

    if (!context) return color

    context.clearRect(0, 0, 1, 1)
    context.fillStyle = color
    context.fillRect(0, 0, 1, 1)
    const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data

    return `rgba(${red}, ${green}, ${blue}, ${Math.round((alpha! / 255) * 1000) / 1000})`
  }

  const compute = (element: HTMLElement, color: string) => {
    element.style.color = color
    const computed = getComputedStyle(element).color
    element.style.color = ''

    return /^rgba?\(/.test(computed) ? computed : rasterize(computed)
  }

  return {
    /** `color` (a theme color name or any CSS color) as `rgb()`/`rgba()`. */
    resolve: (color: MapColor) => {
      const css = toCssColor(color)
      const element = probe()
      if (!element) return css

      let resolved = cache.get(css)
      if (resolved === undefined) cache.set(css, (resolved = compute(element, css)))

      return resolved
    },
    clear: () => cache.clear(),
  }
}
