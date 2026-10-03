// Internal: RAC press-drag-release for option popovers (Select, ComboBox, Autocomplete). Options select on mouse
// release wherever the press started (`shouldSelectOnPressUp`), e.g. press the trigger, drag onto an option, release.
// A press that starts and ends on the same option is left to the option's own click.

const optionAt = (target: EventTarget | null) => target instanceof Element
  ? target.closest<HTMLElement>('[role=option]:not([data-disabled])')
  : null

export function usePressRelease() {
  let pressed: HTMLElement | null = null
  return {
    onPointerdown(event: PointerEvent) {
      pressed = optionAt(event.target)
    },
    onPointerup(event: PointerEvent) {
      const option = optionAt(event.target)
      const from = pressed
      pressed = null
      if (event.pointerType === 'mouse' && event.button === 0 && option && option !== from)
        option.click()
    },
  }
}
