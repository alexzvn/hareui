import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'

import type { LayerDismissPolicy, OutsideEvent } from '@/composables/nestedLayer'
import {
  resolveLayer,
  shouldDismissOnEscape,
  shouldDismissOnOutside,
  shouldDismissOnPress,
} from '@/composables/nestedLayer'
import { useLayerDismiss } from '@/composables/useLayerDismiss'

const createLayer = (parent: ParentNode = document.body) => {
  const layer = document.createElement('div')
  layer.setAttribute('data-dismissable-layer', '')
  layer.append(document.createElement('button'))
  parent.append(layer)
  return layer
}

const toOutsideEvent = (
  originalEvent: Event,
  type = 'dismissableLayer.pointerDownOutside',
): OutsideEvent => new CustomEvent(type, { detail: { originalEvent }, cancelable: true })

// `composedPath()` is only filled while the event dispatches, so decide from a document listener, as Reka does.
const press = <T>(
  target: Element,
  decide: (event: PointerEvent) => T,
  init: PointerEventInit = {},
): T => {
  let result: T | undefined
  const listener = (event: Event) => {
    result = decide(event as PointerEvent)
  }
  document.addEventListener('pointerdown', listener, { capture: true, once: true })
  target.dispatchEvent(
    new PointerEvent('pointerdown', { bubbles: true, composed: true, button: 0, ...init }),
  )
  return result as T
}

const pressOutside = (target: Element, policy: LayerDismissPolicy, init?: PointerEventInit) =>
  press(target, (event) => shouldDismissOnOutside(toOutsideEvent(event), policy), init)

afterEach(() => {
  document.body.replaceChildren()
})

describe('resolveLayer', () => {
  it('accepts the Layer itself or the positioning wrapper around it', () => {
    const wrapper = document.createElement('div')
    const layer = createLayer(wrapper)
    expect(resolveLayer(layer)).toBe(layer)
    expect(resolveLayer(wrapper)).toBe(layer)
  })

  it('treats an empty or unmounted `$el` as no Layer', () => {
    expect(resolveLayer(null)).toBeNull()
    expect(resolveLayer(document.createComment('v-if'))).toBeNull()
  })
})

describe('shouldDismissOnOutside', () => {
  it('dismisses on a press outside every Layer', () => {
    const layer = createLayer()
    const outside = document.body.appendChild(document.createElement('button'))
    expect(pressOutside(outside, { content: layer })).toBe(true)
  })

  it('keeps the Layer open for a press inside it or inside a Layer stacked above it', () => {
    const layer = createLayer()
    const nested = createLayer()
    expect(pressOutside(layer.firstElementChild!, { content: layer })).toBe(false)
    expect(pressOutside(nested.firstElementChild!, { content: layer })).toBe(false)
  })

  it('dismisses on a press inside a Layer below it', () => {
    const below = createLayer()
    const layer = createLayer()
    expect(pressOutside(below.firstElementChild!, { content: layer })).toBe(true)
  })

  it('judges a press inside a shadow root by its real target, not the shadow host', () => {
    const host = document.body.appendChild(document.createElement('div'))
    const root = host.attachShadow({ mode: 'open' })
    const layer = createLayer(root)
    const nested = createLayer(root)
    const outside = root.appendChild(document.createElement('button'))
    // What a document listener sees in a browser (happy-dom doesn't retarget): the host as `target`, the real
    // element first in the composed path.
    const retargeted = (inner: Element) => {
      const event = new PointerEvent('pointerdown', { button: 0 })
      Object.defineProperty(event, 'target', { value: host })
      Object.defineProperty(event, 'composedPath', {
        value: () => [inner, root, host, document.body],
      })
      return event
    }
    const policy = { content: layer }
    expect(
      shouldDismissOnOutside(toOutsideEvent(retargeted(nested.firstElementChild!)), policy),
    ).toBe(false)
    expect(shouldDismissOnOutside(toOutsideEvent(retargeted(outside)), policy)).toBe(true)
    expect(shouldDismissOnPress(retargeted(layer.firstElementChild!), { content: nested })).toBe(
      true,
    )
    expect(shouldDismissOnPress(retargeted(nested.firstElementChild!), { content: nested })).toBe(
      false,
    )
  })

  it('judges a focus-outside inside a shadow root by the deepest focused element', () => {
    const host = document.body.appendChild(document.createElement('div'))
    const root = host.attachShadow({ mode: 'open' })
    const layer = createLayer(root)
    const nested = createLayer(root)
    ;(nested.firstElementChild as HTMLElement).focus()
    const event = toOutsideEvent(new FocusEvent('focusin'), 'dismissableLayer.focusOutside')
    expect(shouldDismissOnOutside(event, { content: layer })).toBe(false)
  })

  it('ignores non-primary buttons only with `shouldIgnoreSecondaryButton`', () => {
    const layer = createLayer()
    const outside = document.body.appendChild(document.createElement('button'))
    const policy = { content: layer, shouldIgnoreSecondaryButton: true }
    expect(pressOutside(outside, policy, { button: 2 })).toBe(false)
    expect(pressOutside(outside, policy, { button: 1 })).toBe(false)
    expect(pressOutside(outside, policy, { button: 0 })).toBe(true)
    expect(pressOutside(outside, { content: layer }, { button: 2 })).toBe(true)
  })

  it('never dismisses a non-dismissible Layer', () => {
    const layer = createLayer()
    const outside = document.body.appendChild(document.createElement('button'))
    expect(pressOutside(outside, { content: layer, isDismissible: false })).toBe(false)
  })
})

describe('shouldDismissOnEscape', () => {
  it('follows `isDismissible` unless `isKeyboardDismissible` is set', () => {
    expect(shouldDismissOnEscape({ content: null })).toBe(true)
    expect(shouldDismissOnEscape({ content: null, isDismissible: false })).toBe(false)
    expect(
      shouldDismissOnEscape({ content: null, isDismissible: false, isKeyboardDismissible: true }),
    ).toBe(true)
    expect(shouldDismissOnEscape({ content: null, isKeyboardDismissible: false })).toBe(false)
  })
})

describe('shouldDismissOnPress', () => {
  const pressRaw = (target: Element, policy: LayerDismissPolicy, init?: PointerEventInit) =>
    press(target, (event) => shouldDismissOnPress(event, policy), init)

  it('dismisses the topmost Layer on a press outside the stack', () => {
    const layer = createLayer()
    const outside = document.body.appendChild(document.createElement('button'))
    expect(pressRaw(outside, { content: layer })).toBe(true)
    expect(pressRaw(layer.firstElementChild!, { content: layer })).toBe(false)
  })

  it('leaves a Layer with another Layer stacked above it to that Layer', () => {
    const layer = createLayer()
    createLayer()
    const outside = document.body.appendChild(document.createElement('button'))
    expect(pressRaw(outside, { content: layer })).toBe(false)
  })

  it('applies the button and dismissible options', () => {
    const layer = createLayer()
    const outside = document.body.appendChild(document.createElement('button'))
    expect(
      pressRaw(outside, { content: layer, shouldIgnoreSecondaryButton: true }, { button: 2 }),
    ).toBe(false)
    expect(pressRaw(outside, { content: layer, isDismissible: false })).toBe(false)
  })
})

describe('useLayerDismiss', () => {
  it('prevents Escape and outside dismissal from the policy', () => {
    const layer = createLayer()
    const isDismissible = ref(false)
    const scope = effectScope()
    const { onEscapeKeyDown, onInteractOutside } = scope.run(() =>
      useLayerDismiss({ content: layer, isDismissible }),
    )!
    const escape = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true })
    onEscapeKeyDown(escape)
    expect(escape.defaultPrevented).toBe(true)
    const outside = document.body.appendChild(document.createElement('button'))
    const prevented = press(outside, (event) => {
      const outsideEvent = toOutsideEvent(event)
      onInteractOutside(outsideEvent)
      return outsideEvent.defaultPrevented
    })
    expect(prevented).toBe(true)
    scope.stop()
  })

  it('with `earlyPress`, dismisses on an outside press once open and keeps Reka from dismissing it again', async () => {
    const layer = createLayer()
    const isOpen = ref(false)
    const onDismiss = vi.fn()
    const scope = effectScope()
    const { onInteractOutside } = scope.run(() =>
      useLayerDismiss({ content: layer, earlyPress: { isOpen, onDismiss } }),
    )!
    const outside = document.body.appendChild(document.createElement('button'))
    press(outside, () => undefined)
    expect(onDismiss).not.toHaveBeenCalled()

    isOpen.value = true
    await nextTick()
    const isPreventedByReka = press(outside, (event) => {
      const outsideEvent = toOutsideEvent(event)
      onInteractOutside(outsideEvent)
      return outsideEvent.defaultPrevented
    })
    expect(onDismiss).toHaveBeenCalledOnce()
    expect(isPreventedByReka).toBe(true)

    scope.stop()
    press(outside, () => undefined)
    expect(onDismiss).toHaveBeenCalledOnce()
  })
})
