<template>
  <Primitive ref="menu" :as="wrapper" v-bind="wrapperProps">
    <Toolbar
      :as="as"
      v-bind="layout === 'fixed' ? $attrs : {}"
      data-slot="editor-toolbar"
      :data-layout="layout"
      :class="ui.base()"
    >
      <template v-for="(group, groupIndex) in groups" :key="groupIndex">
        <div role="group" data-slot="editor-toolbar-group" :class="ui.group()">
          <template v-for="(item, index) in group" :key="index">
            <slot
              :name="item.slot ?? 'item'"
              :item="item"
              :index="index"
              :is-active="isActive"
              :is-disabled="isDisabled"
              :on-click="onClick"
            >
              <Dropdown
                v-if="isDropdownItem(item)"
                v-bind="item.dropdown"
                selection-mode="single"
                indicator="checkmark"
                :items="toDropdownEntries(item)"
                :model-value="getActiveEntryValues(item)"
                @update:model-value="(next) => onEntrySelect(item, next)"
              >
                <!-- The menu trigger forwards its listeners to one element, so it carries no tooltip. -->
                <Button
                  v-bind="getButtonProps(item)"
                  :class="ui.button({ class: 'gap-0.5 px-2', override: item.class })"
                  @click="onClick($event, item)"
                >
                  <IconRenderer
                    v-if="getDropdownTriggerIcon(item)"
                    :icon="getDropdownTriggerIcon(item)!"
                  />
                  <span v-if="item.label">{{ item.label }}</span>
                  <component :is="chevronIcon" class="size-3" />
                </Button>

                <template #item-leading="{ item: entry }">
                  <IconRenderer
                    v-if="getEntryIcon(entry)"
                    :icon="getEntryIcon(entry)!"
                    class="size-4 shrink-0"
                  />
                </template>
              </Dropdown>

              <!-- The popover trigger takes the button; the tooltip sits on a wrapper around it. -->
              <Tooltip v-else-if="getUrlKind(item)" v-bind="getTooltipProps(item)">
                <span data-slot="editor-toolbar-url-trigger" :class="ui.urlTrigger()">
                  <EditorToolbarUrlPopover
                    :editor="editor"
                    :kind="getUrlKind(item)!"
                    :portal="urlPopoverPortal"
                    :ui="urlPopoverUI"
                    @apply="(url) => applyUrl(item, url)"
                  >
                    <component
                      :is="isToggleItem(item) ? ToggleButton : Button"
                      v-bind="isToggleItem(item) ? getToggleProps(item) : getButtonProps(item)"
                      :class="ui.button({ override: item.class })"
                    >
                      <IconRenderer v-if="getItemIcon(item)" :icon="getItemIcon(item)!" />
                      <span v-if="item.label">{{ item.label }}</span>
                    </component>
                  </EditorToolbarUrlPopover>
                </span>
              </Tooltip>

              <Tooltip v-else v-bind="getTooltipProps(item)">
                <component
                  :is="isToggleItem(item) ? ToggleButton : Button"
                  v-bind="isToggleItem(item) ? getToggleProps(item) : getButtonProps(item)"
                  :class="ui.button({ override: item.class })"
                  @click="onClick($event, item)"
                >
                  <IconRenderer v-if="getItemIcon(item)" :icon="getItemIcon(item)!" />
                  <span v-if="item.label">{{ item.label }}</span>
                </component>
              </Tooltip>
            </slot>
          </template>
        </div>

        <div
          v-if="groupIndex < groups.length - 1"
          role="separator"
          aria-orientation="vertical"
          data-slot="editor-toolbar-separator"
          :class="ui.separator()"
        />
      </template>
    </Toolbar>
  </Primitive>
</template>

<script setup lang="ts" generic="H extends EditorCustomHandlers = EditorCustomHandlers">
import { BubbleMenu, FloatingMenu } from '@tiptap/vue-3/menus'
import { defu } from 'defu'
import { Primitive } from 'reka-ui'
import type { ComponentPublicInstance } from 'vue'
import { computed, inject, useAttrs, useTemplateRef } from 'vue'

import type { ButtonProps } from '@/components/button/Button.types'
import Button from '@/components/button/Button.vue'
import type { DropdownEntry, DropdownValue } from '@/components/dropdown'
import { isSection, isSeparator, joinGroups, toGroups } from '@/components/dropdown/dropdown.utils'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import { editorHandlersKey } from '@/components/editor/context'
import type { EditorCommand, EditorCustomHandlers } from '@/components/editor/Editor.types'
import { createEditorHandlers } from '@/components/editor/handlers'
import ToggleButton from '@/components/toggle-button/ToggleButton.vue'
import Toolbar from '@/components/toolbar/Toolbar.vue'
import type { TooltipProps } from '@/components/tooltip/Tooltip.types'
import Tooltip from '@/components/tooltip/Tooltip.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useLocale } from '@/composables/useLocale'
import type { IconValue } from '@/types/icon'
import { IconRenderer } from '@/utils/icon'

import { getCommandDefaults } from './defaults'
import type {
  EditorToolbarButtonBase,
  EditorToolbarDropdownChildItem,
  EditorToolbarDropdownItem,
  EditorToolbarDropdownMenuItem,
  EditorToolbarItem,
  EditorToolbarProps,
  EditorToolbarSlots,
} from './EditorToolbar.types'
import EditorToolbarUrlPopover from './EditorToolbarUrlPopover.vue'
import { getEditorToolbarIcon } from './icons'
import theme from './theme'

defineOptions({ inheritAttrs: false })

const { t } = useLocale()

const props = withDefaults(defineProps<EditorToolbarProps<H>>(), {
  as: 'div',
  layout: 'fixed',
  size: 'sm',
  items: () => [],
})

defineSlots<EditorToolbarSlots<H>>()

const attrs = useAttrs()

const ui = useComponentUI('editorToolbar', {
  theme,
  variantProps: () => ({ layout: props.layout }),
  props,
})

const handlers = inject(
  editorHandlersKey,
  computed(() => createEditorHandlers()),
)

const chevronIcon = getEditorToolbarIcon('chevronDown')

const MENU_OPTIONS_DEFAULTS = { offset: 8, shift: { padding: 8 } }

const wrapper = computed(() => {
  if (props.layout === 'bubble') return BubbleMenu
  if (props.layout === 'floating') return FloatingMenu

  return 'template'
})

const wrapperProps = computed(() => {
  if (props.layout === 'fixed') return {}

  const shared = {
    ...attrs,
    editor: props.editor,
    pluginKey: props.pluginKey,
    shouldShow: props.shouldShow,
    resizeDelay: props.resizeDelay,
    appendTo: props.appendTo,
    options: defu(props.options, MENU_OPTIONS_DEFAULTS),
    tabindex: -1,
    'data-slot': 'editor-toolbar-menu',
    class: ui.value.root(),
  }

  return props.layout === 'bubble' ? { ...shared, updateDelay: props.updateDelay } : shared
})

const groups = computed(() => toGroups<EditorToolbarItem<H>>(props.items))

const isDropdownItem = (item: EditorToolbarItem<H>): item is EditorToolbarDropdownItem<H> =>
  'items' in item && Array.isArray(item.items) && item.items.length > 0

const getCommand = (item: object) => ('kind' in item ? (item as EditorCommand) : undefined)

// The editor's reactive state is read first, so callers re-run on every transaction.
const isEditable = () => !!props.editor.state && props.editor.isEditable

const isCommandActive = (command: EditorCommand) =>
  handlers.value[command.kind]?.isActive(props.editor, command) ?? false

const isCommandDisabled = (command: EditorCommand) => {
  const handler = handlers.value[command.kind]
  if (!handler) return false
  if (handler.isDisabled?.(props.editor, command)) return true

  return !handler.canExecute(props.editor, command)
}

const getEntries = (item: EditorToolbarDropdownItem<H>) =>
  item.items
    .flat()
    .flatMap((entry) => (isSection(entry) ? entry.items : [entry]))
    .filter((entry) => !isSeparator(entry))

const isActive = (item: EditorToolbarItem<H>): boolean => {
  if (!isEditable()) return false

  if (isDropdownItem(item)) {
    return getEntries(item).some((entry) => isActive(entry as EditorToolbarItem<H>))
  }

  const command = getCommand(item)

  return command ? isCommandActive(command) : !!item.active
}

const isDisabled = (item: EditorToolbarItem<H>): boolean => {
  if (!isEditable() || item.disabled) return true

  if (isDropdownItem(item)) {
    return getEntries(item).every((entry) => isDisabled(entry as EditorToolbarItem<H>))
  }

  const command = getCommand(item)

  return command ? isCommandDisabled(command) : false
}

const runCommand = (command: EditorCommand) =>
  handlers.value[command.kind]?.execute(props.editor, command).run()

const onClick = (event: MouseEvent, item: EditorToolbarItem<H>) => {
  if (isDisabled(item)) return

  const command = getCommand(item)
  if (!command || isDropdownItem(item)) {
    item.onClick?.(event)
    return
  }

  runCommand(command)
}

// A link item without a fixed `href`, or an image item without a fixed `src`, asks for the URL in a popover.
const getUrlKind = (item: EditorToolbarItem<H>) => {
  const command = getCommand(item)
  if (command?.kind === 'link' && !command.href) return 'link'
  if (command?.kind === 'image' && !command.src) return 'image'

  return undefined
}

const applyUrl = (item: EditorToolbarItem<H>, url: string) => {
  const command = getCommand(item)
  if (command?.kind === 'link') runCommand({ ...command, href: url })
  if (command?.kind === 'image') runCommand({ ...command, src: url })
}

const urlPopoverUI = computed(() => ({
  popover: ui.value.urlPopover(),
  form: ui.value.urlForm(),
  actions: ui.value.urlActions(),
}))

const menu = useTemplateRef<ComponentPublicInstance>('menu')

const urlPopoverPortal = computed<HTMLElement | undefined>(() =>
  props.layout === 'fixed' ? undefined : menu.value?.$el,
)

const isToggleItem = (item: EditorToolbarItem<H>) => {
  const command = getCommand(item)
  if (!command) return item.active !== undefined

  return !!handlers.value[command.kind]?.isToggle
}

const getItemIcon = (item: object): IconValue | undefined => {
  if ('icon' in item && item.icon) return item.icon as IconValue

  const command = getCommand(item)
  const defaults = command && getCommandDefaults(command)

  return defaults && getEditorToolbarIcon(defaults.icon)
}

// The built-in, translated name of a command.
const getCommandLabel = (command: EditorCommand) => {
  const defaults = getCommandDefaults(command)

  return defaults && t(defaults.label, defaults.params)
}

const getItemName = (item: EditorToolbarButtonBase) => {
  if (item.label) return item.label
  if (typeof item.tooltip === 'string') return item.tooltip
  if (item.tooltip && item.tooltip.text) return item.tooltip.text

  const command = getCommand(item)

  return command && getCommandLabel(command)
}

const getTooltipProps = (item: EditorToolbarItem<H>): TooltipProps => {
  if (item.tooltip === false) return { disabled: true }

  const text = getItemName(item)
  const base: TooltipProps = { text, disabled: !text || !!item.label, delay: 500 }

  return typeof item.tooltip === 'object' ? { ...base, ...item.tooltip } : base
}

const getSharedProps = (item: EditorToolbarItem<H>) => ({
  size: props.size,
  iconOnly: !item.label && !isDropdownItem(item),
  disabled: isDisabled(item),
  'aria-label': item['aria-label'] ?? (item.label ? undefined : getItemName(item)),
  'data-active': isActive(item) ? 'true' : undefined,
})

const getToggleProps = (item: EditorToolbarItem<H>) => ({
  ...getSharedProps(item),
  variant: item.variant ?? 'ghost',
  modelValue: isActive(item),
})

// `default` only exists on ToggleButton, so a plain button falls back to its own default variant.
const getButtonVariant = (item: EditorToolbarItem<H>): ButtonProps['variant'] => {
  if (item.variant && item.variant !== 'default') return item.variant
  if (isDropdownItem(item)) return 'ghost'

  return 'tertiary'
}

const getButtonProps = (item: EditorToolbarItem<H>) => ({
  ...getSharedProps(item),
  type: 'button' as const,
  variant: getButtonVariant(item),
})

// Dropdown entries are keyed by position; the key maps back to the entry that was chosen.
const toMenuItem = (
  entry: EditorToolbarDropdownChildItem<H>,
  value: string,
): EditorToolbarDropdownMenuItem => {
  const command = getCommand(entry)
  const menuItem = entry as EditorToolbarDropdownMenuItem
  const label = menuItem.label ?? (command && getCommandLabel(command)) ?? ''

  return {
    ...menuItem,
    label,
    value,
    command,
    disabled: !!menuItem.disabled || (command ? isCommandDisabled(command) : false),
  }
}

const toDropdownGroup = (entries: EditorToolbarDropdownChildItem<H>[], groupIndex: number) =>
  entries.map((entry, index): DropdownEntry<EditorToolbarDropdownMenuItem> => {
    const value = `${groupIndex}-${index}`
    if (isSeparator(entry)) return entry
    if (!isSection(entry)) return toMenuItem(entry, value)

    const items = entry.items.map((child, childIndex) =>
      toMenuItem(child as EditorToolbarDropdownChildItem<H>, `${value}-${childIndex}`),
    )

    return { ...entry, items }
  })

const toDropdownEntries = (item: EditorToolbarDropdownItem<H>) =>
  joinGroups(
    toGroups<EditorToolbarDropdownChildItem<H>>(item.items).map((entries, groupIndex) =>
      toDropdownGroup(entries, groupIndex),
    ),
  )

const getMenuItems = (item: EditorToolbarDropdownItem<H>) =>
  toDropdownEntries(item).flatMap((entry) => {
    if (isSection(entry)) return entry.items

    return isSeparator(entry) ? [] : [entry]
  })

const getActiveEntry = (item: EditorToolbarDropdownItem<H>) => {
  if (!isEditable()) return undefined

  return getMenuItems(item).find((entry) => entry.command && isCommandActive(entry.command))
}

const getActiveEntryValues = (item: EditorToolbarDropdownItem<H>) =>
  getMenuItems(item)
    .filter((entry) => isEditable() && entry.command && isCommandActive(entry.command))
    .map((entry) => entry.value)

const onEntrySelect = (item: EditorToolbarDropdownItem<H>, next: DropdownValue[]) => {
  const previous = getActiveEntryValues(item)
  const chosen =
    next.find((value) => !previous.includes(String(value))) ??
    previous.find((value) => !next.includes(value))

  const entry = getMenuItems(item).find((menuItem) => menuItem.value === chosen)
  if (!entry || entry.disabled) return

  if (!entry.command) {
    entry.onSelect?.()
    return
  }

  runCommand(entry.command)
}

const getEntryIcon = (entry: EditorToolbarDropdownMenuItem) =>
  getItemIcon(entry.command ? { ...entry.command, icon: entry.icon } : entry)

// The trigger shows the active entry's icon, then its own, then the first entry's.
const getDropdownTriggerIcon = (item: EditorToolbarDropdownItem<H>) => {
  const active = getActiveEntry(item)
  if (active) return getEntryIcon(active)

  const [first] = getMenuItems(item)

  return getItemIcon(item) ?? (first && getEntryIcon(first))
}
</script>
