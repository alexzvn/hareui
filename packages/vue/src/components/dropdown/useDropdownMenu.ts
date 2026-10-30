import { computed, onBeforeUnmount, onMounted, provide, ref } from 'vue'

import descriptionTheme from '@/components/description/theme'
import labelTheme from '@/components/label/theme'
import { useComponentUI } from '@/composables/useComponentUI'
import { useInertOutside } from '@/composables/useInertOutside'
import { useLayerDismiss } from '@/composables/useLayerDismiss'
import { usePortal } from '@/composables/usePortal'
import type { PortalTarget } from '@/config'

import type { DropdownContext, DropdownSelectionGroup } from './context'
import { dropdownContextKey, enabledMenuItems } from './context'
import type { DropdownEntry, DropdownSection, DropdownValue } from './Dropdown.types'
import { isSection } from './dropdown.utils'

type UseDropdownMenuOptions = {
  /** The root menu's entries: its items and the sections without their own mode share its selection scope. */
  entries: () => DropdownEntry[]
  /** The root menu's selection mode and indicator. */
  selection: () => Pick<DropdownSelectionGroup, 'mode' | 'indicator'>
  /** The controlled selected values, `undefined` when uncontrolled. */
  modelValue: () => DropdownValue[] | undefined
  /** The selected values when uncontrolled, read once. */
  defaultValue?: DropdownValue[]
  /** Receives every new selection. */
  onUpdateModelValue: (value: DropdownValue[]) => void
  /** Receives the value of a chosen action item. */
  onAction: (value: DropdownValue) => void
  /** Whether the root menu is open. */
  isOpen: () => boolean
  /**
   * Whether the rest of the page is inert while the root menu is open.
   * @defaultValue true
   */
  isModal?: () => boolean
  /** The root menu content: the `$el` of its Reka `*Content` component. */
  content: () => HTMLElement | undefined
  /** The menu's `portal` prop; submenus portal to the same target. */
  portal: () => PortalTarget | undefined
  /** The parts of the context that differ between the menus built on these internals. */
  context: Pick<DropdownContext, 'classes' | 'slots' | 'submenuSideOffset' | 'submenuClearsTrigger'>
}

type SelectionScope = Pick<DropdownSelectionGroup, 'mode' | 'indicator'> & {
  /** The values this scope owns: `single` mode replaces only these. */
  values: () => DropdownValue[]
}

/** Returns the item matching the focus strategy the menu was opened with. */
type FocusFallback = (items: HTMLElement[]) => HTMLElement | undefined

/**
 * The menu state shared by `Dropdown` and `ContextMenu`: selection scopes, interaction modality, keyboard
 * paging, the portal target and the page outside an open menu. Provides the context the menu internals
 * (`DropdownMenuItems`) read.
 */
export const useDropdownMenu = ({
  entries,
  selection,
  modelValue,
  defaultValue = [],
  onUpdateModelValue,
  onAction,
  isOpen,
  isModal = () => true,
  content,
  portal,
  context,
}: UseDropdownMenuOptions) => {
  const portalTarget = usePortal(portal)

  // A modal menu makes the rest of the page inert, not only `aria-hidden`. Reka hides the page for the root menu
  // only (submenus portal in later, after this runs, and stay interactive). The content instance stays mounted
  // while closed and its `$el` isn't reactive, so it is re-read on every open.
  const isInert = () => isOpen() && isModal()
  useInertOutside(() => (isInert() ? content() : null), isInert)

  // Reka's menu dismisses on any button outside (unlike Popover) and on every Escape; only the Layer stack is checked here.
  const { onInteractOutside } = useLayerDismiss({ content })

  // Same classes the Label / Description components would build, resolved once for every item.
  const labelUI = useComponentUI('label', { theme: labelTheme, variantProps: () => ({}) })

  const disabledLabelUI = useComponentUI('label', {
    theme: labelTheme,
    variantProps: () => ({ disabled: true }),
  })

  const descriptionUI = useComponentUI('description', {
    theme: descriptionTheme,
    variantProps: () => ({}),
  })

  const selectedState = ref<DropdownValue[]>(defaultValue)
  const selected = computed(() => modelValue() ?? selectedState.value)

  const setSelected = (value: DropdownValue[]) => {
    selectedState.value = value
    onUpdateModelValue(value)
  }

  /**
   * A selection scope (RAC's `SelectionManager` / `GroupSelectionManager`). `single` replaces only
   * this scope's values and deselects on re-select, as React Aria does without `disallowEmptySelection`.
   */
  const createGroup = ({ mode, indicator, values }: SelectionScope): DropdownSelectionGroup => ({
    mode,
    indicator,
    isSelected: (value) => selected.value.includes(value),
    toggle: (value) => {
      const current = selected.value
      if (current.includes(value)) {
        setSelected(current.filter((v) => v !== value))
        return
      }

      const kept = mode === 'single' ? current.filter((v) => !values().includes(v)) : current
      setSelected([...kept, value])
    },
  })

  const rootValues = computed(() =>
    entries().flatMap((entry) => {
      if (isSection(entry)) return entry.selectionMode ? [] : entry.items.map((item) => item.value)
      return 'value' in entry ? [entry.value] : []
    }),
  )

  const rootGroup = computed(() => createGroup({ ...selection(), values: () => rootValues.value }))

  const sectionGroups = new WeakMap<DropdownSection, DropdownSelectionGroup>()

  const resolveSectionGroup = (section: DropdownSection, parent: DropdownSelectionGroup) => {
    if (!section.selectionMode) return parent

    const indicator = section.indicator ?? 'checkmark'
    const cached = sectionGroups.get(section)
    if (cached?.mode === section.selectionMode && cached.indicator === indicator) return cached

    const group = createGroup({
      mode: section.selectionMode,
      indicator,
      values: () => section.items.map((item) => item.value),
    })

    sectionGroups.set(section, group)

    return group
  }

  // RAC's global interaction modality: the key of the last keyboard interaction, `null` after a pointer one.
  const lastKey = ref<string | null>(null)

  const onKeydown = (event: KeyboardEvent) => {
    lastKey.value = event.key
  }

  const onPointerdown = () => {
    lastKey.value = null
  }

  // RAC pages through the menu with PageUp / PageDown; the menu never outgrows one page, so that is the
  // first / last enabled item (as in ComboBox). Reka only handles them while the content itself is focused.
  const onMenuKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'PageUp' && event.key !== 'PageDown') return

    const items = enabledMenuItems(event.currentTarget as HTMLElement)
    const item = event.key === 'PageUp' ? items[0] : items.at(-1)
    if (!item) return

    event.preventDefault()
    item.focus()
  }

  // RAC's `useSelectableCollection` focuses the first selected item whenever the menu opens (pointer or
  // keyboard), else the item of the focus strategy; Reka focuses the content, or the first item when
  // opened from the keyboard.
  const focusInitialItem = (event: Event, fallback?: FocusFallback) => {
    const menu = event.target as HTMLElement
    const selectedItem = menu.querySelector<HTMLElement>(
      '[data-slot=menu-item][aria-checked=true]:not([data-disabled])',
    )

    const item = selectedItem ?? fallback?.(enabledMenuItems(menu))
    if (!item) return

    event.preventDefault()
    item.focus()
  }

  provide(dropdownContextKey, {
    ...context,
    portal: () => portalTarget.value,
    labelClass: (disabled) => (disabled ? disabledLabelUI : labelUI).value.base(),
    descriptionClass: () => descriptionUI.value.base(),
    rootGroup: () => rootGroup.value,
    sectionGroup: resolveSectionGroup,
    lastKey: () => lastKey.value,
    action: (item) => onAction(item.value),
    slotProps: (item, group) => ({
      item,
      selected: group.mode !== 'none' && group.isSelected(item.value),
      disabled: !!item.disabled,
    }),
    onMenuKeydown,
  })

  onMounted(() => {
    document.addEventListener('keydown', onKeydown, true)
    document.addEventListener('pointerdown', onPointerdown, true)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown, true)
    document.removeEventListener('pointerdown', onPointerdown, true)
  })

  return { portalTarget, onInteractOutside, rootGroup, onMenuKeydown, focusInitialItem }
}
