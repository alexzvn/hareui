import { useRoute } from 'vitepress'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export type TocItem = {
  id: string
  text: string
  depth: number
}

export const useToc = () => {
  const route = useRoute()
  const items = ref<TocItem[]>([])
  const active = ref<string[]>([])
  let headings: HTMLElement[] = []
  let frame = 0

  // The headings fully in view are active. With none in view (a tall demo fills the screen, or the page jumped
  // there), the current section is the last heading above the viewport, never a heading the reader left behind.
  const update = () => {
    frame = 0

    const viewportHeight = window.innerHeight

    const rects = headings.map((heading) => ({
      id: heading.id,
      rect: heading.getBoundingClientRect(),
    }))

    const inView = rects.filter(({ rect }) => rect.top >= 0 && rect.bottom <= viewportHeight)
    if (inView.length > 0) {
      active.value = inView.map(({ id }) => id)
      return
    }

    const current = rects.filter(({ rect }) => rect.top < 0).at(-1) ?? rects[0]
    active.value = current ? [current.id] : []
  }

  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(update)
  }

  const collect = () => {
    // Headings rendered by live demos belong to the demo, not the page outline.
    headings = Array.from(
      document.querySelectorAll<HTMLElement>('#nd-page .prose h2[id], #nd-page .prose h3[id]'),
    ).filter((h) => !h.closest('.component-preview-container'))

    items.value = headings.map((h) => ({
      id: h.id,
      text: (h.querySelector('a[data-card]')?.textContent ?? h.textContent ?? '').trim(),
      depth: Number(h.tagName.slice(1)),
    }))

    update()
  }

  onMounted(() => {
    collect()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
  })

  watch(
    () => route.path,
    () => nextTick(collect),
  )

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    cancelAnimationFrame(frame)
  })

  return { items, active }
}
