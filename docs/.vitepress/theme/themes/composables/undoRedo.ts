// Port of HeroUI docs `themes/hooks/use-undo-redo.ts`: tracks our own history stack of query strings
// (browsers don't expose theirs) and moves through it with history.back()/forward().
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { search } from './variables'

export function useUndoRedo() {
  const canUndo = ref(false)
  const canRedo = ref(false)
  let historyStack: string[] = []
  let currentIndex = -1
  let isNavigating = false
  let lastSearch: string | null = null

  watch(
    search,
    (current) => {
      if (current === lastSearch) return
      lastSearch = current
      if (isNavigating) {
        // This change came from our own undo/redo navigation.
        isNavigating = false
        return
      }
      // A new change from the user: drop any forward history and add the entry.
      historyStack = historyStack.slice(0, currentIndex + 1)
      historyStack.push(current)
      currentIndex = historyStack.length - 1
      canUndo.value = currentIndex > 0
      canRedo.value = false
    },
    { immediate: true },
  )

  // Browser back/forward buttons.
  const onPopState = () => {
    const current = window.location.search.slice(1)
    const newIndex = historyStack.indexOf(current)
    if (newIndex !== -1 && newIndex !== currentIndex) {
      currentIndex = newIndex
      lastSearch = current
      canUndo.value = newIndex > 0
      canRedo.value = newIndex < historyStack.length - 1
    }
  }
  onMounted(() => window.addEventListener('popstate', onPopState))
  onBeforeUnmount(() => window.removeEventListener('popstate', onPopState))

  const undo = () => {
    if (currentIndex <= 0) return
    isNavigating = true
    currentIndex--
    canUndo.value = currentIndex > 0
    canRedo.value = true
    window.history.back()
  }

  const redo = () => {
    if (currentIndex >= historyStack.length - 1) return
    isNavigating = true
    currentIndex++
    canUndo.value = true
    canRedo.value = currentIndex < historyStack.length - 1
    window.history.forward()
  }

  return { canRedo, canUndo, redo, undo }
}
