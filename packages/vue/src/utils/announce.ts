let region: HTMLElement | undefined

// Hidden from sight but not from screen readers; inline, so it works without the library's CSS.
const VISUALLY_HIDDEN = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  padding: '0',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: '0',
}

const getRegion = () => {
  if (region?.isConnected) return region

  region = document.createElement('div')
  region.dataset.slot = 'live-announcer'
  region.setAttribute('role', 'log')
  region.setAttribute('aria-live', 'assertive')
  region.setAttribute('aria-relevant', 'additions')
  Object.assign(region.style, VISUALLY_HIDDEN)
  document.body.append(region)

  return region
}

/**
 * Reads `message` out through a page-wide live region, for feedback that has no visible element of its own. Each
 * message replaces the previous one, so a repeated message is read again.
 */
export const announce = (message: string) => {
  if (typeof document === 'undefined') return

  const node = document.createElement('div')
  node.textContent = message
  getRegion().replaceChildren(node)
}
