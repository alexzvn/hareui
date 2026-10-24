/** A Reka DismissableLayer outside event: `pointerDownOutside`, `focusOutside` or `interactOutside`. */
export type OutsideEvent = CustomEvent<{ originalEvent: Event }>

/**
 * What a Layer tells the dismiss policy. Booleans are already resolved; `useLayerDismiss` reads them from props.
 */
export type LayerDismissPolicy = {
  /**
   * The Layer's `[data-dismissable-layer]` element, or Reka's positioning wrapper directly around it (a
   * `*Content` component's `$el`). Anything else, a comment node of an unmounted `$el` included, means no Layer.
   */
  content: Node | null | undefined
  /**
   * Whether presses and focus outside the Layer stack dismiss it.
   * @defaultValue true
   */
  isDismissible?: boolean
  /**
   * Whether Escape dismisses the Layer. Reka only reports Escape to the topmost Layer.
   * @defaultValue isDismissible
   */
  isKeyboardDismissible?: boolean
  /**
   * Whether presses with any button but the primary one keep the Layer open, as React Aria's `useInteractOutside`.
   * @defaultValue false
   */
  shouldIgnoreSecondaryButton?: boolean
}

const LAYER_SELECTOR = '[data-dismissable-layer]'

/**
 * Reka's `TOOLTIP_OPEN` document event (reka-ui doesn't export it): dispatching it closes every open Tooltip at once.
 */
export const TOOLTIP_OPEN_EVENT = 'tooltip.open'

const getDeepActiveElement = (): Element | null => {
  let active = document.activeElement
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement
  return active
}

/**
 * The element a Reka outside event really landed on. Inside a shadow root the original event's `target` is the
 * shadow host; its composed path still starts at the element. Focus-outside is reported a few ticks after the
 * `focusin`, when `composedPath()` is already empty, so it falls back to the deepest focused element.
 */
export const outsideEventTarget = (event: OutsideEvent): EventTarget | null => {
  const original = event.detail.originalEvent
  const fallback = event.type.endsWith('focusOutside') ? getDeepActiveElement() : original.target
  return original.composedPath()[0] ?? fallback
}

/**
 * The `[data-dismissable-layer]` element of a Layer's content. Not `closest`: with `portal: false` the content
 * sits inside its parent's Layer.
 */
export const resolveLayer = (content: Node | null | undefined): Element | null => {
  // Checked for emptiness first: `Element` is undefined during server rendering.
  if (!content || !(content instanceof Element)) return null
  return content.matches(LAYER_SELECTOR) ? content : content.querySelector(LAYER_SELECTOR)
}

/**
 * Reka's `isLayerExist`, scoped to the Layer's own root instead of its document: whether `target` is inside `layer`
 * or inside a Layer mounted after it (stacked above it).
 */
const isInLayerOrAbove = (layer: Element, target: Element): boolean => {
  if (layer.contains(target)) return true
  const targetLayer = target.closest(LAYER_SELECTOR)
  if (!targetLayer) return false
  const layers = [...(layer.getRootNode() as Document | ShadowRoot).querySelectorAll(LAYER_SELECTOR)]
  return layers.indexOf(layer) < layers.indexOf(targetLayer)
}

/** Whether `layer` is the last Layer mounted in its root, the one an outside press is meant for. */
const isTopmostLayer = (layer: Element): boolean =>
  [...(layer.getRootNode() as Document | ShadowRoot).querySelectorAll(LAYER_SELECTOR)].at(-1) === layer

const isKeptOpen = (event: Event, policy: LayerDismissPolicy): boolean => {
  if (!(policy.isDismissible ?? true)) return true
  return !!policy.shouldIgnoreSecondaryButton && event instanceof MouseEvent && event.button > 0
}

const isInLayerStack = (layer: Element | null, target: EventTarget | null): boolean =>
  !!layer && target instanceof Element && isInLayerOrAbove(layer, target)

/** Whether Escape dismisses the Layer. */
export const shouldDismissOnEscape = (policy: LayerDismissPolicy): boolean =>
  policy.isKeyboardDismissible ?? policy.isDismissible ?? true

/**
 * Whether an outside event Reka reported dismisses the Layer. Reka judges `event.target` at the document: inside a
 * shadow root that target is the shadow host, so a press in a nested Layer (a Select opened from a Modal, a Dropdown
 * submenu) counts as outside. This re-runs the check on the real target; outside a shadow root it agrees with Reka,
 * which never reports those events.
 */
export const shouldDismissOnOutside = (event: OutsideEvent, policy: LayerDismissPolicy): boolean => {
  if (isKeptOpen(event.detail.originalEvent, policy)) return false
  return !isInLayerStack(resolveLayer(policy.content), outsideEventTarget(event))
}

/**
 * Whether a document `pointerdown` Reka didn't report dismisses the Layer: only the topmost Layer reacts, and only
 * to a press outside it.
 */
export const shouldDismissOnPress = (event: PointerEvent, policy: LayerDismissPolicy): boolean => {
  const layer = resolveLayer(policy.content)
  // The composed path's first node: inside a shadow root `event.target` is the shadow host.
  const target = event.composedPath()[0] ?? null
  if (!layer || !(target instanceof Element) || isKeptOpen(event, policy)) return false
  return isTopmostLayer(layer) && !isInLayerStack(layer, target)
}

/**
 * Keeps a Layer open when an outside interaction actually landed in its Layer stack (see `shouldDismissOnOutside`).
 * For Layers without their own dismiss options, e.g. Dropdown submenus.
 */
export const preventNestedLayerDismiss = (event: OutsideEvent, content: Node | null | undefined): void => {
  if (isInLayerStack(resolveLayer(content), outsideEventTarget(event))) event.preventDefault()
}
