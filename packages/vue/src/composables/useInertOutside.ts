import type { MaybeRefOrGetter } from 'vue'
import { onScopeDispose, toValue, watch } from 'vue'

type Target = Element | { $el: Element | null } | null | undefined

// At the top of a shadow tree `parentElement` is null: continue from the shadow host.
const parentAcrossShadow = (node: Element) =>
  node.parentElement ?? (node.parentNode instanceof ShadowRoot ? node.parentNode.host : null)

/**
 * Reka's modal overlays hide the rest of the page with `aria-hidden`, which leaves its buttons and links
 * focusable inside an aria-hidden tree (axe `aria-hidden-focus`). React Aria makes the outside `inert`
 * instead, so nothing there can be focused or clicked. This sets `inert` on the same nodes Reka hides
 * (every sibling along the path from the overlay content up to `<body>`, keeping live regions such as
 * toasts) while the content is mounted and `open` is true, and removes only the `inert` it added. The path
 * crosses shadow roots, so an overlay inside a shadow tree keeps its host, and the host's other shadow
 * children turn inert like any other sibling.
 *
 * `open` must turn false synchronously when the overlay starts closing (a `flush: 'sync'` source such as
 * the component's `update:open` handler): Reka returns focus to the trigger in a pre-flush watcher, which an
 * `inert` trigger would ignore.
 */
export const useInertOutside = (
  target: MaybeRefOrGetter<Target>,
  open: MaybeRefOrGetter<boolean>,
) => {
  let added: Element[] = []
  const release = () => {
    for (const node of added) node.removeAttribute('inert')
    added = []
  }

  const apply = (el: Element) => {
    const body = el.ownerDocument.body
    const root = el.getRootNode()
    const liveRoots = root instanceof ShadowRoot ? [body, root] : [body]
    const keep = new Set<Element>()

    const keptRoots = [
      el,
      ...liveRoots.flatMap((r) => [...r.querySelectorAll('[aria-live], script')]),
    ]

    for (const kept of keptRoots) {
      for (
        let node: Element | null = kept;
        node && !keep.has(node);
        node = parentAcrossShadow(node)
      )
        keep.add(node)
    }

    // A host is walked through its shadow root only when the kept path runs through it.
    const walk = (parent: Element) => {
      const shadow = parent.shadowRoot
      const isOnPath = shadow && [...shadow.children].some((c) => keep.has(c))
      const children = isOnPath ? [...shadow.children, ...parent.children] : parent.children
      for (const child of children) {
        if (child === el) continue

        if (keep.has(child)) {
          walk(child)
          continue
        }

        if (child.hasAttribute('inert')) continue
        child.setAttribute('inert', '')
        added.push(child)
      }
    }

    if (keep.has(body)) walk(body)
  }

  const element = () => {
    const value = toValue(target)
    return value && '$el' in value ? value.$el : value
  }

  const sync = (el: Element | null | undefined) => {
    release()

    // The immediate watcher also runs during server rendering, where `el` is always empty and `Element` is undefined:
    // check emptiness first so the global is never read there.
    if (el && el instanceof Element && el.isConnected && toValue(open)) apply(el)
  }

  // Reopening while the content is still mounted (a close animation held by Presence) keeps the same element, so the
  // element watcher doesn't fire: the open watcher re-applies in that case.
  watch(
    () => toValue(open),
    (isOpen) => (isOpen ? sync(element()) : release()),
    { flush: 'sync' },
  )

  watch(element, sync, { flush: 'post', immediate: true })
  onScopeDispose(release)
}
