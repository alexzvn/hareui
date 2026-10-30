import { h } from 'vue'
import type { Component, FunctionalComponent } from 'vue'

import { createSvgIcon } from '@/utils/icon'

// gravity-ui icons (MIT): `chevron-right`, `folder`, `folder-open`.
const CHEVRON_RIGHT =
  'M5.47 13.03a.75.75 0 0 1 0-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0'

const FOLDER =
  'm6.44 4.06.439.44H12.5A1.5 1.5 0 0 1 14 6v5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11V4.5A1.5 1.5 0 0 1 3.5 3h1.257a1.5 1.5 0 0 1 1.061.44zM.5 4.5a3 3 0 0 1 3-3h1.257a3 3 0 0 1 2.122.879L7.5 3h5a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3zm4.25 2a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5z'

const FOLDER_OPEN =
  'm6.379 4.5-.44-.44-.621-.62A1.5 1.5 0 0 0 4.258 3H3a1.5 1.5 0 0 0-1.5 1.5v5.25l1.376-2.293A3 3 0 0 1 5.45 6h7.05A1.5 1.5 0 0 0 11 4.5zM14 6.026V6a3 3 0 0 0-3-3H7l-.621-.621A3 3 0 0 0 4.257 1.5H3a3 3 0 0 0-3 3V11a3 3 0 0 0 3 3h8.301a3 3 0 0 0 2.573-1.457l1.791-2.985A2.35 2.35 0 0 0 14 6.026M10 12.5h1.301a1.5 1.5 0 0 0 1.287-.728l1.791-2.986 1.286.772-1.286-.772a.85.85 0 0 0-.728-1.286H5.449a1.5 1.5 0 0 0-1.287.728l-1.791 2.986a.85.85 0 0 0 .728 1.286z'

export const ChevronRightIcon = createSvgIcon({ d: CHEVRON_RIGHT, size: 16 })
export const FolderIcon = createSvgIcon({ d: FOLDER, size: 16 })
export const FolderOpenIcon = createSvgIcon({ d: FOLDER_OPEN, size: 16 })

/** Renders an icon prop: an icon class on an empty `span`, or a component, passing the attributes on. */
export const TreeIcon: FunctionalComponent<{ icon: string | Component }> = (
  { icon },
  { attrs },
) => {
  if (typeof icon === 'string')
    return h('span', { ...attrs, class: [icon, attrs.class], 'aria-hidden': 'true' })

  return h(icon, attrs)
}

TreeIcon.props = ['icon']
TreeIcon.inheritAttrs = false
