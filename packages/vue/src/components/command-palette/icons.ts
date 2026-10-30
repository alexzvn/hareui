import { CHECK_ICON_PATH } from '@/utils/checkIcon'
import { createSvgIcon } from '@/utils/icon'

// Gravity UI icons (MIT), 16×16.
const MAGNIFIER =
  'M11.5 7a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m-.82 4.74a6 6 0 1 1 1.06-1.06l2.79 2.79a.75.75 0 1 1-1.06 1.06z'

const ARROW_LEFT =
  'M14.75 8a.75.75 0 0 1-.75.75H3.81l2.72 2.72a.75.75 0 1 1-1.06 1.06l-4-4a.75.75 0 0 1 0-1.06l4-4a.75.75 0 0 1 1.06 1.06L3.81 7.25H14a.75.75 0 0 1 .75.75'

const CHEVRON_RIGHT =
  'M5.47 13.03a.75.75 0 0 1 0-1.06L9.44 8L5.47 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0'

/** gravity-ui `magnifier`. */
export const SearchIcon = createSvgIcon({ d: MAGNIFIER })

/** gravity-ui `arrow-left`. */
export const BackIcon = createSvgIcon({ d: ARROW_LEFT })

/** gravity-ui `chevron-right`. */
export const ChildrenIcon = createSvgIcon({ d: CHEVRON_RIGHT })

/** gravity-ui `check`. */
export const SelectedIcon = createSvgIcon({ d: CHECK_ICON_PATH })
