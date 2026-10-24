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
  let observer: IntersectionObserver | undefined

  const collect = () => {
    observer?.disconnect()
    // Headings rendered by live demos belong to the demo, not the page outline.
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>('#nd-page .prose h2[id], #nd-page .prose h3[id]'),
    ).filter((h) => !h.closest('.component-preview-container'))
    items.value = headings.map((h) => ({
      id: h.id,
      text: (h.querySelector('a[data-card]')?.textContent ?? h.textContent ?? '').trim(),
      depth: Number(h.tagName.slice(1)),
    }))
    const visible = new Set<string>()
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        if (visible.size > 0) {
          active.value = items.value.filter((item) => visible.has(item.id)).map((item) => item.id)
        } else if (active.value.length > 1) {
          active.value = active.value.slice(-1)
        }
      },
      { rootMargin: '0px', threshold: 0.98 },
    )
    for (const h of headings) observer.observe(h)
    active.value = items.value.length ? [items.value[0].id] : []
  }

  onMounted(collect)
  watch(
    () => route.path,
    () => nextTick(collect),
  )
  onBeforeUnmount(() => observer?.disconnect())

  return { items, active }
}
