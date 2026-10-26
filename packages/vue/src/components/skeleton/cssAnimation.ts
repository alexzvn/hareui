// `null` = not read yet. Read once per page, like HeroUI's cached `useCSSVariable`.
let cssAnimationCache: string | undefined | null = null

/** Reads the page's `--skeleton-animation` CSS variable once and caches it. */
export const readCssAnimation = (): string | undefined => {
  if (cssAnimationCache !== null) return cssAnimationCache

  const rootStyle = getComputedStyle(document.documentElement)
  const value = rootStyle.getPropertyValue('--skeleton-animation').trim()
  cssAnimationCache = value || undefined

  return cssAnimationCache
}
