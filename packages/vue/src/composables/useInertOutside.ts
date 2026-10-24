import type { MaybeRefOrGetter } from 'vue'
import { onScopeDispose, toValue, watch } from 'vue'

type Target = Element | { $el: Element | null } | null | undefined

/**
 * Reka's modal overlays hide the rest of the page with `aria-hidden`, which leaves its buttons and links
 * focusable inside an aria-hidden tree (axe `aria-hidden-focus`). React Aria makes the outside `inert`
 * instead, so nothing there can be focused or clicked. This sets `inert` on the same nodes Reka hides
 * (every sibling along the path from the overlay content up to `<body>`, keeping live regions such as
 * toasts) while the content is mounted and `open` is true, and removes only the `inert` it added.
 *
 * `open` must turn false synchronously when the overlay starts closing (a `flush: 'sync'` source such as
 * the component's `update:open` handler): Reka returns focus to the trigger in a pre-flush watcher, which an
 * `inert` trigger would ignore.
 */
export function useInertOutside(target: MaybeRefOrGetter<Target>, open: MaybeRefOrGetter<boolean>) {
  let added: Element[] = []
  const release = () => {
    for (const node of added)
      node.removeAttribute('inert')
    added = []
  }
  const apply = (el: Element) => {
    const body = el.ownerDocument.body
    const keep = new Set<Element>()
    for (const kept of [el, ...body.querySelectorAll('[aria-live], script')]) {
      for (let node: Element | null = kept; node && !keep.has(node); node = node.parentElement)
        keep.add(node)
    }
    const walk = (parent: Element) => {
      for (const child of parent.children) {
        if (child === el)
          continue
        if (keep.has(child)) {
          walk(child)
        }
        else if (!child.hasAttribute('inert')) {
          child.setAttribute('inert', '')
          added.push(child)
        }
      }
    }
    if (keep.has(body))
      walk(body)
  }

  const element = () => {
    const value = toValue(target)
    return value && '$el' in value ? value.$el : value
  }
  const sync = (el: Element | null | undefined) => {
    release()
    if (el instanceof Element && el.isConnected && toValue(open))
      apply(el)
  }
  // Reopening while the content is still mounted (a close animation held by Presence) keeps the same element, so the
  // element watcher doesn't fire: the open watcher re-applies in that case.
  watch(() => toValue(open), isOpen => isOpen ? sync(element()) : release(), { flush: 'sync' })
  watch(element, sync, { flush: 'post', immediate: true })
  onScopeDispose(release)
}
