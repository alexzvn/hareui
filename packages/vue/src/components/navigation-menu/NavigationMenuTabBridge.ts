import { injectNavigationMenuItemContext } from 'reka-ui'
import { defineComponent, watchPostEffect } from 'vue'

const isTab = (event: KeyboardEvent): boolean => {
  return (
    event.key === 'Tab' &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.defaultPrevented
  )
}

/**
 * Reka bridges Tab between an open trigger and its content (teleported into the viewport) with a focus
 * proxy right after the trigger: a `tabindex="0"` span inside `aria-hidden`, a tab stop that assistive
 * tech can't see (axe `aria-hidden-focus`). This takes the proxy out of the tab order and keeps the bridge
 * without it: Tab on the open trigger enters the content the way the proxy did, and Shift+Tab before the
 * content's first tabbable, which Reka sends to the proxy, goes on to the trigger. Tab past the last one
 * still lands on the proxy and continues from its place after the trigger. Renders nothing; it goes inside
 * the Reka `NavigationMenuItem` that owns the trigger and the content.
 */
export default defineComponent({
  name: 'NavigationMenuTabBridge',
  setup() {
    const item = injectNavigationMenuItemContext()

    // Reka renders a new proxy each time the item opens; after the render, the trigger and content are mounted.
    watchPostEffect((onCleanup) => {
      const proxy = item.focusProxyRef.value
      const trigger = item.triggerRef.value
      const content = document.getElementById(item.contentId)
      if (!proxy?.isConnected || !trigger || !content) return
      proxy.tabIndex = -1

      const onTriggerKeydown = (event: KeyboardEvent) => {
        if (!isTab(event) || event.shiftKey || !proxy.isConnected) return
        item.onFocusProxyEnter('start')
        // Without a tabbable in the content, Tab goes on from the trigger as usual.
        if (content.contains(document.activeElement)) event.preventDefault()
      }
      // Added after Reka's own listener, so it sees where Reka's Tab handling left focus.
      const onContentKeydown = (event: KeyboardEvent) => {
        if (isTab(event) && event.shiftKey && document.activeElement === proxy) {
          event.preventDefault()
          trigger.focus()
        }
      }
      trigger.addEventListener('keydown', onTriggerKeydown)
      content.addEventListener('keydown', onContentKeydown)
      onCleanup(() => {
        trigger.removeEventListener('keydown', onTriggerKeydown)
        content.removeEventListener('keydown', onContentKeydown)
      })
    })

    return () => null
  },
})
