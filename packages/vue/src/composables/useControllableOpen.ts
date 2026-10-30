import { computed, ref } from 'vue'

type UseControllableOpenOptions = {
  /** The controlled open state, `undefined` when uncontrolled. */
  open: () => boolean | undefined
  /** The open state when uncontrolled, read once. */
  defaultOpen?: boolean
  /** Receives every change of the open state (`update:open`). */
  onUpdate: (open: boolean) => void
}

/**
 * An overlay's open state: the `open` prop while it is bound, its own state otherwise. A request that
 * matches the current state isn't emitted, so a menu that echoes the `open` prop back doesn't re-emit it.
 */
export const useControllableOpen = ({
  open,
  defaultOpen = false,
  onUpdate,
}: UseControllableOpenOptions) => {
  const openState = ref(defaultOpen)
  const isOpen = computed(() => open() ?? openState.value)

  const setOpen = (value: boolean) => {
    const isChange = value !== isOpen.value
    openState.value = value
    if (isChange) onUpdate(value)
  }

  return { isOpen, setOpen }
}
