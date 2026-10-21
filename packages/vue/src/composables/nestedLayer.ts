type OutsideEvent = CustomEvent<{ originalEvent: Event }>

function deepActiveElement(): Element | null {
  let active = document.activeElement
  while (active?.shadowRoot?.activeElement)
    active = active.shadowRoot.activeElement
  return active
}

/**
 * Keeps a dismissable layer open when an "outside" interaction actually landed in a layer stacked above it.
 *
 * Reka's DismissableLayer judges outside events by `event.target` at the document. Inside a shadow root that target is
 * retargeted to the shadow host and its layer lookup runs on the document, so a press in a nested layer (a Select
 * opened from a Modal, a Dropdown submenu) counts as outside and closes the parent. This re-runs Reka's check on the
 * real target: inside `content`'s layer, or inside a `[data-dismissable-layer]` after it in its root, is not outside.
 * `content` is the layer element or Reka's positioning wrapper directly around it.
 * Outside a shadow root it agrees with Reka, which never reports these events, so it never prevents.
 */
export function preventNestedLayerDismiss(event: OutsideEvent, content: Element | null | undefined): void {
  const selector = '[data-dismissable-layer]'
  // Not `closest`: with `portal: false` the content sits inside its parent's layer.
  const layer = content?.matches(selector) ? content : content?.querySelector(selector)
  const target = outsideEventTarget(event)
  if (layer && target instanceof Element && isInLayerOrAbove(layer, target))
    event.preventDefault()
}

/**
 * The element a Reka outside event really landed on. Inside a shadow root the original event's `target` is the
 * shadow host; its composed path still starts at the element. Focus-outside is reported a few ticks after the
 * `focusin`, when `composedPath()` is already empty, so it falls back to the deepest focused element.
 */
export function outsideEventTarget(event: OutsideEvent): EventTarget | null {
  const original = event.detail.originalEvent
  return original.composedPath()[0] ?? (event.type.endsWith('focusOutside') ? deepActiveElement() : original.target)
}

// Reka's `isLayerExist`, scoped to the layer's own root instead of its document.
function isInLayerOrAbove(layer: Element, target: Element): boolean {
  if (layer.contains(target))
    return true
  const targetLayer = target.closest('[data-dismissable-layer]')
  if (!targetLayer)
    return false
  const layers = Array.from((layer.getRootNode() as Document | ShadowRoot).querySelectorAll('[data-dismissable-layer]'))
  return layers.indexOf(layer) < layers.indexOf(targetLayer)
}
