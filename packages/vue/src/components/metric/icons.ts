import { createSvgIcon } from '@/utils/icon'

// gravity-ui icons (MIT): `ellipsis-vertical`, the three-dot actions glyph.
const ELLIPSIS_VERTICAL =
  'M8 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0 5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0'

export const EllipsisVerticalIcon = createSvgIcon({ d: ELLIPSIS_VERTICAL })
