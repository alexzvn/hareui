import { h } from 'vue'
import { gearPath } from '../../../parity/icons'

export const gear = () => h('svg', { 'viewBox': '0 0 16 16', 'fill': 'currentColor', 'aria-hidden': 'true' }, [h('path', { 'fill-rule': 'evenodd', 'd': gearPath, 'clip-rule': 'evenodd' })])
