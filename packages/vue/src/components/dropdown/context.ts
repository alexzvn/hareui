import type { InjectionKey } from 'vue'
import type { ResolvedPortal } from '../../composables/usePortal'
import type { DropdownItem, DropdownItemSlotProps, DropdownSection, DropdownSlots, DropdownValue } from './Dropdown.vue'

/** One selection scope: the menu itself, or a section with its own `selectionMode` (RAC's `GroupSelectionManager`). */
export interface DropdownSelectionGroup {
  mode: 'none' | 'single' | 'multiple'
  indicator: 'checkmark' | 'dot' | false
  isSelected: (value: DropdownValue) => boolean
  toggle: (value: DropdownValue) => void
}

export interface DropdownContext {
  /** Slot class functions of the Dropdown theme; `variant` is applied per item. */
  classes: () => Record<string, (options?: { variant?: string, class?: any }) => string>
  ui: () => Record<string, any> | undefined
  /** Item label / description classes, resolved once per menu instead of mounting Label / Description per item. */
  labelClass: (disabled?: boolean) => string
  descriptionClass: () => string
  /** Resolved portal of the root menu; submenus portal to the same target. */
  portal: () => ResolvedPortal
  slots: DropdownSlots
  rootGroup: () => DropdownSelectionGroup
  sectionGroup: (section: DropdownSection, parent: DropdownSelectionGroup) => DropdownSelectionGroup
  /** Whether the last interaction was a keyboard one, and which key (RAC's interaction modality). */
  lastKey: () => string | null
  action: (item: DropdownItem) => void
  slotProps: (item: DropdownItem, group: DropdownSelectionGroup) => DropdownItemSlotProps
  /** Keydown on a menu (root or submenu) content: PageUp / PageDown paging. */
  onMenuKeydown: (event: KeyboardEvent) => void
}

/** The enabled items of one menu content (submenus are portalled, so they are not included). */
export function enabledMenuItems(menu: Element): HTMLElement[] {
  return [...menu.querySelectorAll<HTMLElement>('[data-slot=menu-item]:not([data-disabled])')]
}

export const dropdownContextKey: InjectionKey<DropdownContext> = Symbol('hareui-dropdown')
