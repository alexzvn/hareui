<template>
  <div
    v-if="shown || !root.unmountOnHide.value"
    :id="collapsible.contentId"
    ref="el"
    role="region"
    :aria-labelledby="item.triggerId || labelledby"
    :data-state="item.dataState.value"
    :data-disabled="item.dataDisabled.value"
    :data-orientation="root.orientation"
    :hidden="shown ? undefined : 'until-found'"
    @beforematch="root.changeModelValue(item.value.value)"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import {
  injectAccordionItemContext,
  injectAccordionRootContext,
  injectCollapsibleRootContext,
} from 'reka-ui'
import { computed, nextTick, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'

// The nested list of a vertical item, expanding and collapsing with these motion variants:
//   enter: height 0 -> auto as a `spring({ bounce: 0, duration: 0.24 })`, opacity 0 -> 1 over 220ms
//          `cubic-bezier(.16, 1, .3, 1)`, `overflow: hidden` until it settles, then `visible`;
//   exit:  height -> 0 over 180ms `cubic-bezier(.4, 0, 1, 1)`, opacity -> 0 over 100ms `cubic-bezier(.23, 1, .32, 1)`,
//          pointer events off; the rows unmount once it ends.
// Rows neither slide nor scale: the clipped box reveals them in place. The first render shows the open state as is
// (motion's `initial={false}`), and reduced motion (`data-reduce-motion` or the media query, like the `motion-reduce`
// variant) toggles instantly. Web Animations start from the current height and opacity, so a click mid-animation
// turns it around without a jump.
// It stands in for Reka's `AccordionContent` (same attributes and ids), whose presence mounts the rows a tick after
// opening and unmounts them at once on close (it only waits for CSS animations).

const props = defineProps<{
  /** The region id: the item's link or trigger points `aria-controls` at it. */
  id: string
  /** Labels the region when the item has no AccordionTrigger (a link or a group label). */
  labelledby: string
}>()

const root = injectAccordionRootContext()
const item = injectAccordionItemContext()
const collapsible = injectCollapsibleRootContext()
collapsible.contentId ||= props.id

const el = useTemplateRef<HTMLElement>('el')
const exiting = ref(false)
const shown = computed(() => item.open.value || exiting.value)
let running: Animation[] = []
let token = 0

// motion's critically damped spring for `duration: 0.24`: the natural frequency solves e^(-wd)(1 + wd) = 0.001.
const OMEGA = 9.2335 / 240
const springProgress = (t: number) => 1 - Math.exp(-OMEGA * t) * (1 + OMEGA * t)

// motion runs the spring until it is within 0.5px of the target and slower than 2px/s.
const springDuration = (distance: number) => {
  let t = 1
  while (
    t < 1000 &&
    (distance * (1 - springProgress(t)) > 0.5 ||
      distance * OMEGA * OMEGA * t * Math.exp(-OMEGA * t) * 1000 > 2)
  )
    t += 1

  return t
}

const springEasing = (duration: number) => {
  const end = springProgress(duration)
  const points = Array.from(
    { length: 33 },
    (_, i) => +(springProgress((duration * i) / 32) / end).toFixed(4),
  )

  return `linear(${points.join(', ')})`
}

const supportsLinear =
  typeof CSS !== 'undefined' && CSS.supports('transition-timing-function', 'linear(0, 1)')

const animatable = (): HTMLElement | undefined => {
  const node = el.value
  if (!node || typeof node.animate !== 'function') return undefined
  const flag = node.closest('[data-reduce-motion]')?.getAttribute('data-reduce-motion')
  const reduced =
    flag === 'true' ||
    (flag !== 'false' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)

  return reduced ? undefined : node
}

const settle = (node: HTMLElement) => {
  for (const animation of running) animation.cancel()
  running = []
  node.style.removeProperty('overflow')
  node.style.removeProperty('pointer-events')
}

// Before the render: a closing panel keeps its rows for the exit.
watch(
  item.open,
  (open) => {
    exiting.value = !open && !!animatable()
  },
  { flush: 'pre' },
)

// After the render: an opening panel's rows are in the DOM and measurable.
watch(
  item.open,
  (open) => {
    const node = el.value
    if (!node) return

    if (!animatable()) {
      token++
      settle(node)

      return
    }

    const interrupted = running.length > 0
    const fromHeight = interrupted || !open ? node.getBoundingClientRect().height : 0
    const fromOpacity = interrupted ? Number(getComputedStyle(node).opacity) : open ? 0 : 1
    settle(node)
    const toHeight = open ? node.getBoundingClientRect().height : 0

    // Nothing to travel (no layout, or a hidden ancestor): switch at once.
    if (toHeight === fromHeight) {
      token++
      exiting.value = false

      return
    }

    node.style.overflow = 'clip'
    if (!open) node.style.pointerEvents = 'none'

    const height = [{ height: `${fromHeight}px` }, { height: `${toHeight}px` }]
    const opacity = [{ opacity: fromOpacity }, { opacity: open ? 1 : 0 }]
    if (open) {
      const duration = springDuration(Math.abs(toHeight - fromHeight))
      running = [
        node.animate(height, {
          duration,
          easing: supportsLinear ? springEasing(duration) : 'cubic-bezier(0.25, 1, 0.5, 1)',
          fill: 'forwards',
        }),
        node.animate(opacity, {
          duration: 220,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'forwards',
        }),
      ]
    } else {
      running = [
        node.animate(height, {
          duration: 180,
          easing: 'cubic-bezier(0.4, 0, 1, 1)',
          fill: 'forwards',
        }),
        node.animate(opacity, {
          duration: 100,
          easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
          fill: 'forwards',
        }),
      ]
    }

    const current = ++token
    Promise.all(running.map((a) => a.finished)).then(
      () => {
        if (current !== token) return
        if (open) return settle(node)

        // Unmount (or hide) the rows first, then drop the held end state: no frame shows them at full height.
        exiting.value = false
        nextTick(() => current === token && settle(node))
      },
      () => {},
    )
  },
  { flush: 'post' },
)

onBeforeUnmount(() => {
  token++
  running = []
})
</script>
