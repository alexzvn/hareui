import { getCurrentInstance, onBeforeUnmount, watchEffect } from 'vue'

import type { MapContext } from './context'
import { injectMapContext } from './context'
import type { LineKind, LineShape } from './lineLayers'
import type { MapPoint } from './types'

type LineEmit = {
  (event: 'click', position: MapPoint, mouseEvent: MouseEvent): void
  (event: 'hover', isHovered: boolean): void
}

/** A line part: its name for errors, its kind, how it reads its shape and how it emits pointer events. */
type LinePart = {
  part: string
  kind: LineKind
  shape: (context: MapContext) => LineShape
  emit: LineEmit
}

/**
 * Draws the shape `shape` reads in the map's shared `kind` layer, again whenever it changes. The shape reacts to the
 * pointer only while the part has a `click` or `hover` listener.
 */
export const useLineLayer = ({ part, kind, shape, emit }: LinePart) => {
  const context = injectMapContext(part)
  const listeners = getCurrentInstance()?.vnode.props ?? {}
  const handlers = {
    click: listeners.onClick
      ? (position: MapPoint, event: MouseEvent) => emit('click', position, event)
      : undefined,
    hover: listeners.onHover ? (isHovered: boolean) => emit('hover', isHovered) : undefined,
  }

  let id: number | undefined

  watchEffect(() => {
    const entry = { kind, shape: shape(context), handlers }

    if (id === undefined) {
      id = context.lines.add(entry)
      return
    }

    context.lines.update(id, entry)
  })

  onBeforeUnmount(() => {
    if (id !== undefined) context.lines.remove(id)
  })
}
