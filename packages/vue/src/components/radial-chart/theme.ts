import { polarCenterSlots, polarSlots } from '@/components/chart/polar-theme'
import { chartSlots } from '@/components/chart/theme'

export default {
  slots: {
    ...chartSlots,
    ...polarSlots,
    ...polarCenterSlots,
  },
}
