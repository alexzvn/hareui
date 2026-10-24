// Stand-in for HeroUI's `next-themes` `useTheme()` (resolvedTheme / setTheme) on top of the docs' appearance handling.
// The docs' ThemeToggle flips `html.dark` and writes `vitepress-theme-appearance` directly, bypassing VitePress'
// `isDark` ref, so the DOM class is the source of truth here.
import { onBeforeUnmount, onMounted, ref } from 'vue'

const STORAGE_KEY = 'vitepress-theme-appearance'

export function useColorMode() {
  const isDark = ref(
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
  )
  let observer: MutationObserver | undefined

  const read = () => (isDark.value = document.documentElement.classList.contains('dark'))

  function setDark(dark: boolean) {
    const root = document.documentElement
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
    root.classList.toggle('dark', dark)
    root.style.colorScheme = dark ? 'dark' : 'light'
  }

  onMounted(() => {
    read()
    observer = new MutationObserver(read)
    observer.observe(document.documentElement, { attributeFilter: ['class'], attributes: true })
  })
  onBeforeUnmount(() => observer?.disconnect())

  return { isDark, setDark, toggle: () => setDark(!isDark.value) }
}
