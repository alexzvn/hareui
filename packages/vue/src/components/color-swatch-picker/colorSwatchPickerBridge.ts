import { injectListboxRootContext } from 'reka-ui'
import { defineComponent, getCurrentInstance, onBeforeUnmount, onMounted, watch } from 'vue'

const ITEM = '[data-slot=color-swatch-picker-item]'

/**
 * Internal renderless child of Reka's `ColorSwatchPickerRoot` that patches its Listbox to behave like React Aria's
 * ColorSwatchPicker:
 *
 * - Focusing an item makes it the highlighted (roving tab stop) item, as React Aria's focus key follows focus.
 * - Reka only moves along its orientation and ignores PageUp/PageDown. React Aria also moves with ArrowLeft/ArrowRight
 *   in the stack layout and jumps to the first/last item on PageUp/PageDown.
 * - reka-limitation: Reka focuses (and scrolls to) the selected item whenever the value changes from outside, stealing
 *   focus from the area/slider/field that changed the colour. React Aria only moves its focus key. While focus is
 *   outside the picker, the items' `focus`/`scrollIntoView` are no-ops until Reka's deferred highlight has run.
 * - Reka keeps a disabled listbox in the tab order (its root stays `tabindex="0"` when no item can be highlighted),
 *   so a disabled picker turns the listbox's focusability off.
 */
export default defineComponent({
  name: 'ColorSwatchPickerBridge',
  props: {
    selected: { type: String, required: true },
    stack: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  setup(props) {
    const listbox = injectListboxRootContext()
    const instance = getCurrentInstance()

    // The renderless child's placeholder node sits directly inside the listbox element
    const root = () => (instance?.vnode.el as Node | null | undefined)?.parentElement ?? null

    watch(
      () => props.disabled,
      (disabled) => {
        listbox.focusable.value = !disabled
      },
      { immediate: true },
    )

    const onFocusIn = (event: FocusEvent) => {
      const item = event.target instanceof Element ? event.target.closest<HTMLElement>(ITEM) : null
      if (item && listbox.highlightedElement.value !== item)
        listbox.changeHighlight(item, false, false)
    }

    const findKeyTarget = (event: KeyboardEvent, items: HTMLElement[]) => {
      if (event.key === 'PageUp') return items[0]
      if (event.key === 'PageDown') return items.at(-1)

      const current =
        event.target instanceof Element ? event.target.closest<HTMLElement>(ITEM) : null

      const index = current ? items.indexOf(current) : -1
      if (index === -1) return undefined

      const isForward = (event.key === 'ArrowRight') !== (listbox.dir.value === 'rtl')

      return items[index + (isForward ? 1 : -1)]
    }

    // Moves through the rendered items rather than Reka's collection, which only fills in after mount
    const onKeydown = (event: KeyboardEvent) => {
      const el = root()
      if (!el || event.altKey || event.ctrlKey || event.metaKey || !listbox.focusable.value) return

      const isPageKey = event.key === 'PageUp' || event.key === 'PageDown'
      const isStackArrow = props.stack && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')
      if (!isPageKey && !isStackArrow) return

      const items = [...el.querySelectorAll<HTMLElement>(ITEM)].filter(
        (item) => !item.hasAttribute('data-disabled'),
      )

      const target = findKeyTarget(event, items)
      event.preventDefault()
      if (target) listbox.changeHighlight(target)
    }

    let restoreTimer: ReturnType<typeof setTimeout> | undefined
    watch(
      () => props.selected,
      () => {
        const el = root()
        if (!el || el.contains(document.activeElement)) return
        const items = [...el.querySelectorAll<HTMLElement>(ITEM)]
        for (const item of items) {
          item.focus = () => {}
          item.scrollIntoView = () => {}
        }

        clearTimeout(restoreTimer)

        restoreTimer = setTimeout(() => {
          for (const item of items) {
            delete (item as Partial<HTMLElement>).focus
            delete (item as Partial<HTMLElement>).scrollIntoView
          }
        })
      },
      { flush: 'sync' },
    )

    let attached: HTMLElement | null = null
    onMounted(() => {
      attached = root()
      attached?.addEventListener('focusin', onFocusIn)
      attached?.addEventListener('keydown', onKeydown)
    })

    onBeforeUnmount(() => {
      clearTimeout(restoreTimer)
      attached?.removeEventListener('focusin', onFocusIn)
      attached?.removeEventListener('keydown', onKeydown)
    })

    return () => null
  },
})
