/**
 * A route location object. Shaped like vue-router's `RouteLocationPathRaw` / `RouteLocationNamedRaw` (declared as
 * interfaces, so they have no index signature) so a location held in a variable is assignable without vue-router.
 */
type RouteLocation = {
  /** The path to go to. */
  path?: string
  /** The name of a named route. */
  name?: string | symbol
  /** The params of a named route. */
  params?: object
  /** The query string as key-value pairs. */
  query?: object
  /** The hash, starting with `#`. */
  hash?: string
  /** Replace the history entry instead of pushing. */
  replace?: boolean
  /** Navigate even when the location is the current one. */
  force?: boolean
  /** The history state saved with the entry. */
  state?: object
}

/**
 * The link fields shared by every component that can render as a link. With vue-router installed (the app registered
 * `RouterLink`), `to` navigates client-side and drives the active state; without it, `to` and `href` render a plain
 * `<a>`.
 */
export type LinkBaseProps = {
  /**
   * A route location (vue-router) or URL. Goes through `RouterLink` when the app has it, unless the link is external:
   * `external`, `target="_blank"`, or a string with a protocol (`https:`, `mailto:`, …) or starting with `//`. An
   * external route location gets its `href` from the router; without a router it renders no link.
   */
  to?: string | RouteLocation
  /** The URL to link to. Always renders a plain `<a>`; `to` wins when both are set and the router handles it. */
  href?: string
  /** The link `target`. */
  target?: '_blank' | '_parent' | '_self' | '_top' | (string & {}) | null
  /** The link `rel`. Defaults to `noopener noreferrer` when `target` is `_blank`. */
  rel?: string | null
  /** The link `download` attribute: `true` downloads under the URL's file name, a string sets the file name. */
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
