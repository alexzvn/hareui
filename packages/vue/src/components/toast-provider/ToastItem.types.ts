import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'

import type theme from './theme'
import type { QueuedToast, ToastContentValue } from './toastQueue'

type Toast = typeof theme

// Not exported: HeroUI's Toast/ToastContent/ToastIndicator/Toast* compound parts collapse
// into ToastProvider's single `#toast` slot (see ToastProvider.vue), per the "no compound
// parts" rule. This renders one stack entry, used only from ToastProvider's `v-for`.
export type ToastItemProps = {
  toast: QueuedToast<ToastContentValue>
  index: number
  isFrontmost: boolean
  isExiting: boolean
  isHidden: boolean
  isExpanded: boolean
  isMobile: boolean
  placement: 'bottom' | 'bottom start' | 'bottom end' | 'top' | 'top start' | 'top end'
  zIndex: number
  offsetCollapsed: number
  offsetExpanded: number
  scaleCollapsed: number
  frontHeight: number
  /** Closes this toast on its owning queue. */
  close: () => void
  providerUi?: ComponentSlots<Toast>
  toastSlot?: (props: {
    content: ToastContentValue
    close: () => void
    titleId: string
    descriptionId: string
  }) => VNode[]
}
