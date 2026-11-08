import { h } from 'vue'
import type { FunctionalComponent } from 'vue'

import type { DropdownEntry } from '@/components/dropdown/Dropdown.types'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import Tooltip from '@/components/tooltip/Tooltip.vue'

type ActionMenuProps = {
  items?: DropdownEntry[]
  disabled?: boolean
  label?: string
}

// An action with menu entries opens a Dropdown; any other gets a tooltip. Both wrap the button through `as-child`,
// which can't pass through the other's multi-root output, so a menu button goes without a tooltip.
export const ActionMenu: FunctionalComponent<ActionMenuProps> = (
  { items, disabled, label },
  { slots },
) =>
  items?.length
    ? h(Dropdown, { items, disabled }, { default: slots.default })
    : h(Tooltip, { text: label }, { default: slots.default })

ActionMenu.props = ['items', 'disabled', 'label']
