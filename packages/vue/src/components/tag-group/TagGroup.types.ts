import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type tagTheme from './tagTheme'
import type theme from './theme'

type TagGroup = typeof theme
type Tag = typeof tagTheme

/** One tag of a `TagGroup`. */
export type TagGroupItem = {
  /** Unique identifier. Selected via `v-model:selected`, removed via the `remove` event. */
  id: string
  /** The tag label. */
  label?: string
  /** Whether this tag is disabled. */
  disabled?: boolean
}

/** Props of `TagGroup`: a keyboard-navigable list of tags that can be selected and removed. */
export type TagGroupProps<T extends TagGroupItem = TagGroupItem> = {
  /** The tags to render. */
  items?: T[]
  /**
   * The type of selection allowed.
   * @defaultValue 'none'
   */
  selectionMode?: 'none' | 'single' | 'multiple'
  /**
   * The ids selected initially when uncontrolled.
   * @defaultValue []
   */
  defaultSelected?: string[]
  /** Ids of tags that are disabled, in addition to each item's own `disabled`. */
  disabledKeys?: string[]
  /**
   * Whether tags show a remove button and can be removed by pressing it, or Delete / Backspace
   * while the tag is focused.
   * @defaultValue false
   */
  removable?: boolean
  /**
   * Size of the tags.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<Tag>['size']
  /**
   * Visual style of the tags.
   * @defaultValue 'default'
   */
  variant?: ComponentVariants<Tag>['variant']
  /** The group label. */
  label?: string
  /** Help text rendered below the tags. */
  description?: string
  /**
   * Error message rendered below the description. Rendered whenever this is given (even `''`) or
   * `#errorMessage` is.
   */
  errorMessage?: string
  /**
   * Whether the whole group is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /** Accessible name of the tag list, required when `label` / `#label` is omitted. */
  'aria-label'?: string
  /** Base id of the group; label/description/error ids derive from it. Generated when omitted. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. `tag` and `removeButton` are the `tag` theme's slots. */
  ui?: ComponentSlots<TagGroup> & {
    /** Classes merged into each tag (the `tag` theme's `base`). */
    tag?: ComponentSlots<Tag>['base']
    /** Classes merged into each tag's remove button. */
    removeButton?: ComponentSlots<Tag>['removeButton']
  }
}

/** Slots of `TagGroup`. */
export type TagGroupSlots<T extends TagGroupItem = TagGroupItem> = {
  /** The group label content. Replaces the `label` prop. */
  label?: () => VNode[]
  /** The group description content. Replaces the `description` prop. */
  description?: () => VNode[]
  /** The error content. Replaces the `errorMessage` prop. Rendered whenever either is given. */
  errorMessage?: () => VNode[]
  /** Content of each tag. Replaces `item.label`. */
  item?: (props: { item: T; index: number; selected: boolean; disabled: boolean }) => VNode[]
  /** Content of each tag's remove button (shown when `removable`). Replaces the default close icon. */
  removeButton?: (props: { item: T; index: number }) => VNode[]
  /**
   * Content rendered inside the list when `items` is empty, usually an
   * `<EmptyState>`. Nothing is rendered when omitted.
   */
  empty?: () => VNode[]
}

/** Events emitted by `TagGroup`. */
export type TagGroupEmits = {
  /** Emitted with the removed ids, via the remove button or Delete / Backspace. */
  remove: [ids: string[]]
}
