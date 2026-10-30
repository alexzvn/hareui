// HareUI mark geometry: squares #2 and #3 of a 2x2 grid on a 32-unit canvas, overlapped and blended with
// squircle-style cubic corners. The shipped mark (docs/public/logo.svg, docs/.vitepress/theme/components/HareLogo.vue)
// is `logoPath(LOGO_DEFAULTS)` rotated by `LOGO_DEFAULTS.tilt` around the canvas centre.

export type LogoParams = {
  /** Side of each square. */
  s: number
  /** Horizontal overlap of the two squares. */
  ox: number
  /** Vertical overlap of the two squares. */
  oy: number
  /** Edge length consumed by each outer corner curve. */
  e: number
  /** Edge length consumed by each centre join curve. */
  b: number
  /** Control-point pull toward the corner: ~0.55 is a circular arc, higher is squircle-like. */
  t: number
  /** Radius of the round cut-out in the top square; 0 disables it. */
  eye: number
  /** Eye position across the top square, -1..1. */
  eyex: number
  /** Rotation in degrees around the canvas centre. */
  tilt: number
  /** Extra space around the mark in the favicon. */
  pad: number
  fill: LogoFill
}

export type LogoFill = 'mono' | 'accent' | 'gradient' | 'duo'

export const LOGO_DEFAULTS: LogoParams = { s: 16.25, ox: 3.75, oy: 2.5, e: 4.5, b: 5, t: 0.78, eye: 0, eyex: -0.45, tilt: -1.5, pad: 3, fill: 'mono' }

export const fmt = (n: number) => String(+n.toFixed(3))

type Pt = [number, number, number]

export function logoBox({ s, ox, oy }: Pick<LogoParams, 's' | 'ox' | 'oy'>) {
  const lx = (32 - (2 * s - ox)) / 2
  const ly = (32 - (2 * s - oy)) / 2
  return { lx, ly, hx: 32 - lx, hy: 32 - ly, ax: lx + s, ay: ly + s, cx: 32 - lx - s, cy: 32 - ly - s }
}

export function isValidLogo(p: LogoParams) {
  const { lx, ly } = logoBox(p)
  return p.ox < p.s && p.oy < p.s && lx >= 0 && ly >= 0
}

export function logoPath(p: LogoParams): string {
  const { s, e, b, t, eye, eyex } = p
  const { lx, ly, hx, hy, ax, ay, cx, cy } = logoBox(p)
  const pts: Pt[] = [[cx, ly, e], [hx, ly, e], [hx, ay, e], [ax, ay, b], [ax, hy, e], [lx, hy, e], [lx, cy, e], [cx, cy, b]]
  const n = pts.length
  const at = (i: number) => pts[(i + n) % n]!
  const dist = (a: Pt, c: Pt) => Math.hypot(a[0] - c[0], a[1] - c[1])
  // Shrink both curves on an edge proportionally when they would not fit its length.
  const scale = pts.map((a, i) => Math.min(1, dist(a, at(i + 1)) / ((a[2] + at(i + 1)[2]) || 1)))
  let d = ''
  pts.forEach((pt, i) => {
    const [x, y, k] = pt
    const toward = (q: Pt, len: number) => {
      const l = dist(pt, q)
      return [x + (q[0] - x) * len / l, y + (q[1] - y) * len / l] as const
    }
    const s0 = toward(at(i - 1), k * scale[(i - 1 + n) % n]!)
    const s1 = toward(at(i + 1), k * scale[i]!)
    const c0 = [s0[0] + (x - s0[0]) * t, s0[1] + (y - s0[1]) * t]
    const c1 = [s1[0] + (x - s1[0]) * t, s1[1] + (y - s1[1]) * t]
    d += `${i ? 'L' : 'M'}${fmt(s0[0])} ${fmt(s0[1])}C${fmt(c0[0]!)} ${fmt(c0[1]!)} ${fmt(c1[0]!)} ${fmt(c1[1]!)} ${fmt(s1[0])} ${fmt(s1[1])}`
  })
  d += 'Z'
  if (eye > 0) {
    const ex = cx + s / 2 + eyex * (s / 2 - eye - 2)
    const ey = ly + s * 0.4
    d += `M${fmt(ex - eye)} ${fmt(ey)}a${fmt(eye)} ${fmt(eye)} 0 1 0 ${fmt(2 * eye)} 0a${fmt(eye)} ${fmt(eye)} 0 1 0 ${fmt(-2 * eye)} 0Z`
  }
  return d
}

/** Standalone SVG as shipped in docs/public/logo.svg (minus its light/dark style block). */
export function logoSvg(p: LogoParams, fill = 'currentColor') {
  const rotate = p.tilt ? ` transform="rotate(${fmt(p.tilt)} 16 16)"` : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="${fill}" fill-rule="evenodd" d="${logoPath(p)}"${rotate}/></svg>`
}
