import type { FunctionalComponent } from 'vue'
import { h } from 'vue'

import { createSvgIcon } from '@/utils/icon'

// gravity-ui icons (MIT): `plus`, `minus`, `location-arrow`, `chevrons-expand-up-right`, `chevrons-collapse-up-right`.
const PLUS =
  'M8 1.75a.75.75 0 0 1 .75.75v4.75h4.75a.75.75 0 0 1 0 1.5H8.75v4.75a.75.75 0 0 1-1.5 0V8.75H2.5a.75.75 0 0 1 0-1.5h4.75V2.5A.75.75 0 0 1 8 1.75'

const MINUS = 'M1.75 8a.75.75 0 0 1 .75-.75h11a.75.75 0 0 1 0 1.5h-11A.75.75 0 0 1 1.75 8'

const LOCATION_ARROW =
  'M7.16 13.134L6.5 9.5l-3.634-.66a2.272 2.272 0 0 1-.355-4.377l9.358-3.327a2.346 2.346 0 0 1 2.996 2.995l-3.328 9.358a2.272 2.272 0 0 1-4.376-.355m2.964-.148L13.45 3.63a.844.844 0 0 0-1.08-1.08L3.014 5.876a.772.772 0 0 0 .12 1.487l3.634.661l1.022.186l.186 1.022l.66 3.634a.772.772 0 0 0 1.488.12'

const EXPAND =
  'M7.754 2.004a.75.75 0 0 0 0 1.5h4.75v4.742a.75.75 0 0 0 1.5 0V2.754a.75.75 0 0 0-.75-.75zm.492 11.992a.75.75 0 0 0 0-1.5h-4.75V7.754a.75.75 0 0 0-1.5 0v5.492a.75.75 0 0 0 .75.75z'

const COLLAPSE =
  'M15.25 6.993a.75.75 0 0 0 0-1.5H10.5V.75a.75.75 0 1 0-1.5 0v5.493c0 .414.336.75.75.75zM.75 9.007a.75.75 0 1 0 0 1.5H5.5v4.743a.75.75 0 0 0 1.5 0V9.757a.75.75 0 0 0-.75-.75z'

/** gravity-ui `plus`. */
export const ZoomInIcon = createSvgIcon({ d: PLUS })

/** gravity-ui `minus`. */
export const ZoomOutIcon = createSvgIcon({ d: MINUS })

/** gravity-ui `location-arrow`. */
export const LocateIcon = createSvgIcon({ d: LOCATION_ARROW })

/** gravity-ui `chevrons-expand-up-right`. */
export const FullscreenIcon = createSvgIcon({ d: EXPAND })

/** gravity-ui `chevrons-collapse-up-right`. */
export const ExitFullscreenIcon = createSvgIcon({ d: COLLAPSE })

// A compass needle on a 20px grid: each half is split down the middle into a lit and a shaded side.
const NEEDLE = [
  { d: 'M10 2l3.5 8H10z', class: 'fill-danger' },
  { d: 'M10 2L6.5 10H10z', class: 'fill-danger/75' },
  { d: 'M10 18l3.5-8H10z', class: 'fill-muted/70' },
  { d: 'M10 18l-3.5-8H10z', class: 'fill-muted/40' },
]

/** A compass needle, north in red. Attributes fall through onto the `svg`. */
export const CompassIcon: FunctionalComponent = (_, { attrs }) =>
  h(
    'svg',
    { 'aria-hidden': 'true', viewBox: '0 0 20 20', xmlns: 'http://www.w3.org/2000/svg', ...attrs },
    NEEDLE.map((path) => h('path', path)),
  )

CompassIcon.inheritAttrs = false
