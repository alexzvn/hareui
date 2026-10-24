// Panel size animation shared by Disclosure and Accordion, ported from react-aria's
// `useDisclosure` so the `--disclosure-panel-height` variable HeroUI's CSS transitions follows
// the same auto -> px -> 0px sequence, and collapsed panels stay find-in-page searchable
// (`hidden="until-found"`).

const setSize = (el: HTMLElement, size: 'auto' | '0px' | 'measure') => {
  el.style.setProperty(
    '--disclosure-panel-width',
    size === 'measure' ? `${el.scrollWidth}px` : size,
  )

  el.style.setProperty(
    '--disclosure-panel-height',
    size === 'measure' ? `${el.scrollHeight}px` : size,
  )
}

const afterAnimations = (el: HTMLElement) => Promise.all(el.getAnimations().map((a) => a.finished))

/** Applies the open/closed state without animating (first render, or no Web Animations API). */
export const setPanelStatic = (el: HTMLElement, open: boolean) => {
  if (open) el.removeAttribute('hidden')
  else el.setAttribute('hidden', 'until-found')

  setSize(el, open ? 'auto' : '0px')
}

/** Animates the panel to its new open/closed state. */
export const animatePanel = (el: HTMLElement, open: boolean) => {
  if (typeof el.getAnimations !== 'function') return setPanelStatic(el, open)

  if (open) {
    el.removeAttribute('hidden')

    // Pixel size so it can animate; back to auto afterwards so the content can resize.
    setSize(el, 'measure')

    afterAnimations(el)
      .then(() => setSize(el, 'auto'))
      .catch(() => {})
  } else {
    setSize(el, 'measure')

    // Force style recalculation so the change to 0px animates.
    void getComputedStyle(el).height
    setSize(el, '0px')

    afterAnimations(el)
      .then(() => el.setAttribute('hidden', 'until-found'))
      .catch(() => {})
  }
}

/**
 * Opens the panel when find-in-page reveals it while collapsed. Returns the cleanup function.
 * `toggle` must flip the owner's open state.
 */
export const onPanelReveal = (el: HTMLElement, toggle: () => void) => {
  const handler = () => {
    // Restore `hidden` and let the state change open the panel.
    requestAnimationFrame(() => el.setAttribute('hidden', 'until-found'))
    toggle()
  }

  el.addEventListener('beforematch', handler)

  return () => el.removeEventListener('beforematch', handler)
}
