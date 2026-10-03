import type { InjectionKey } from 'vue'
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
  slots: DropdownSlots
  rootGroup: () => DropdownSelectionGroup
  sectionGroup: (section: DropdownSection, parent: DropdownSelectionGroup) => DropdownSelectionGroup
  /** Whether the last interaction was a keyboard one, and which key (RAC's interaction modality). */
  lastKey: () => string | null
  action: (item: DropdownItem) => void
  slotProps: (item: DropdownItem, group: DropdownSelectionGroup) => DropdownItemSlotProps
}

export const dropdownContextKey: InjectionKey<DropdownContext> = Symbol('hareui-dropdown')
