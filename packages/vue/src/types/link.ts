/**
 * The link fields shared by every component that can render as a link. With vue-router installed (the app registered
 * `RouterLink`), `to` navigates client-side and drives the active state; without it, `to` and `href` render a plain
 * `<a>`.
 */
export type LinkBaseProps = {
  /**
   * A route location (vue-router) or URL. Goes through `RouterLink` when the app has it, unless the link is external:
   * `external`, `target="_blank"`, or a string with a protocol (`https:`, `mailto:`, …) or starting with `//`.
   */
  to?: string | Record<string, unknown>
  /** The URL to link to. Always renders a plain `<a>`; `to` wins when both are set and the router handles it. */
  href?: string
  /** The link `target`. */
  target?: '_blank' | '_parent' | '_self' | '_top' | (string & {}) | null
  /** The link `rel`. Defaults to `noopener noreferrer` when `target` is `_blank`. */
  rel?: string | null
  /** The link `download` attribute. */
  download?: boolean | string
  /** Treat the link as external: never route it through `RouterLink`. */
  external?: boolean
  /** With a router, replace the history entry instead of pushing. */
  replace?: boolean
  /** With a router, only match the exact route as active. */
  exact?: boolean
  /** Whether the link is the current location. Overrides the router match. */
  active?: boolean
  /** Whether the link is disabled: it drops `href`, gets `aria-disabled="true"` and never navigates. */
  disabled?: boolean
}
