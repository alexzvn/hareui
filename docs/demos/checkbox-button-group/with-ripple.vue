<template>
  <CheckboxButtonGroup
    class="w-[320px]"
    name="backup-folders"
    label="Back up these folders"
    variant="secondary"
    :default-value="['camera']"
  >
    <CheckboxButtonGroupItem
      v-for="folder in folders"
      :key="folder.value"
      :value="folder.value"
      :label="folder.label"
      :description="folder.description"
      v-on="ripple"
    />
  </CheckboxButtonGroup>
</template>

<script setup lang="ts">
import { CheckboxButtonGroup, CheckboxButtonGroupItem } from '@hareui/vue'

const folders = [
  { value: 'camera', label: 'Camera roll', description: 'Photos and videos from this phone' },
  { value: 'screenshots', label: 'Screenshots', description: 'Captured screens and recordings' },
  { value: 'downloads', label: 'Downloads', description: 'Files saved from the browser' },
]

// Material-style press feedback: an 8% overlay while hovered, and a ripple that grows from the pointer
// while pressed and fades out after release. Both use the card's text color.
const HOVER_OPACITY = '0.08'
const PRESSED_OPACITY = '0.12'
const MIN_PRESS_MS = 225

// A clipping layer inside the card, so the card itself keeps `overflow: visible`.
const layer = (card: HTMLElement) => {
  let root = card.querySelector<HTMLElement>(':scope > [data-ripple]')
  if (root) return root
  root = document.createElement('span')
  root.dataset.ripple = ''
  root.setAttribute('aria-hidden', 'true')

  Object.assign(root.style, {
    position: 'absolute',
    inset: '0',
    overflow: 'hidden',
    borderRadius: 'inherit',
    pointerEvents: 'none',
  })

  const hover = document.createElement('span')
  Object.assign(hover.style, {
    position: 'absolute',
    inset: '0',
    background: 'currentColor',
    opacity: '0',
    transition: 'opacity 150ms',
  })

  root.append(hover)
  card.prepend(root)

  return root
}

const setHover = (card: HTMLElement, on: boolean) => {
  ;(layer(card).firstElementChild as HTMLElement).style.opacity = on ? HOVER_OPACITY : '0'
}

const press = (card: HTMLElement, x: number, y: number) => {
  const { width, height } = card.getBoundingClientRect()
  const maxDim = Math.max(width, height)
  const size = Math.floor(maxDim * 0.2)
  const scale = (Math.hypot(width, height) + 12 + Math.max(maxDim * 0.35, 75)) / size
  const wave = document.createElement('span')
  wave.dataset.wave = String(performance.now())

  Object.assign(wave.style, {
    position: 'absolute',
    left: '0',
    top: '0',
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    background:
      'radial-gradient(closest-side, currentColor max(100% - 70px, 65%), transparent 100%)',
    opacity: '0',
    transition: 'opacity 75ms',
  })

  layer(card).append(wave)

  wave.animate(
    {
      transform: [
        `translate(${x - size / 2}px, ${y - size / 2}px) scale(1)`,
        `translate(${(width - size) / 2}px, ${(height - size) / 2}px) scale(${scale})`,
      ],
    },
    { duration: 150, fill: 'forwards' },
  )

  requestAnimationFrame(() => (wave.style.opacity = PRESSED_OPACITY))
}

const release = (card: HTMLElement) => {
  for (const wave of card.querySelectorAll<HTMLElement>(
    '[data-ripple] > [data-wave]:not([data-released])',
  )) {
    wave.dataset.released = ''

    setTimeout(
      () => {
        wave.style.transition = 'opacity 375ms'
        wave.style.opacity = '0'
        setTimeout(() => wave.remove(), 375)
      },
      Math.max(0, MIN_PRESS_MS - (performance.now() - Number(wave.dataset.wave))),
    )
  }
}

const ripple = {
  pointerenter: (e: PointerEvent) =>
    e.pointerType !== 'touch' && setHover(e.currentTarget as HTMLElement, true),
  pointerleave: (e: PointerEvent) => {
    setHover(e.currentTarget as HTMLElement, false)
    release(e.currentTarget as HTMLElement)
  },
  pointerdown: (e: PointerEvent) => {
    if (!e.isPrimary || e.button !== 0) return
    const card = e.currentTarget as HTMLElement
    const rect = card.getBoundingClientRect()
    press(card, e.clientX - rect.left, e.clientY - rect.top)
  },
  pointerup: (e: PointerEvent) => release(e.currentTarget as HTMLElement),
  pointercancel: (e: PointerEvent) => release(e.currentTarget as HTMLElement),
  // Keyboard activation (Space) ripples from the center.
  click: (e: MouseEvent) => {
    if (e.detail !== 0) return
    const card = e.currentTarget as HTMLElement
    press(card, card.offsetWidth / 2, card.offsetHeight / 2)
    release(card)
  },
}
</script>
