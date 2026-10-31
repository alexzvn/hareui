import type { AcceptableValue } from 'reka-ui'
import type { ComputedRef, InjectionKey, Ref, Slots, VNode } from 'vue'
import { Comment, Fragment, h, inject } from 'vue'

import type { IconValue } from '@/types/icon'
import type { ComponentUI } from '@/types/tv'
import { resolveSlotName } from '@/utils/slotName'

import type {
  CommandPaletteGroup,
  CommandPaletteItem,
  CommandPaletteProps,
  CommandPaletteResolvedItem,
} from './CommandPalette.types'
import type { HighlightSegment } from './commandPaletteSearch'
import type theme from './theme'

/** What the root shares with its items. */
export type CommandPaletteContext = {
  props: CommandPaletteProps & Required<Pick<CommandPaletteProps, 'labelKey' | 'descriptionKey'>>
  slots: Slots
  ui: Ref<ComponentUI<typeof theme>>
  /** The term the current results were searched with. */
  searchTerm: Ref<string>
  /** Whether Fuse runs with `useTokenSearch`. */
  isTokenSearch: Ref<boolean>
  /** The value `ListboxItem` gets for the item: its `valueKey` field, or the item without the search fields. */
  getValue: (item: CommandPaletteResolvedItem) => AcceptableValue
  /** The spinner of the input and of loading items. */
  loadingIcon: ComputedRef<IconValue>
  onSelect: (payload: { event: Event; item: CommandPaletteResolvedItem }) => void
}

export const commandPaletteKey: InjectionKey<CommandPaletteContext> = Symbol('CommandPalette')

export const useCommandPalette = () => {
  const context = inject(commandPaletteKey)
  if (!context) throw new Error('CommandPalette parts must be used inside CommandPalette')

  return context
}

type SlotSuffix = '' | 'leading' | 'label' | 'description' | 'trailing'

/** The slot an item renders through: its own `slot`, else its group's, else `item` (`#<base>-<suffix>`). */
export const slotName = (
  { item, group }: { item: CommandPaletteItem; group?: CommandPaletteGroup },
  suffix: SlotSuffix,
): string => resolveSlotName({ slot: item.slot || group?.slot, suffix })

const isContentNode = (node: VNode): boolean => {
  if (node.type === Comment) return false

  return node.type === Fragment ? hasContent(node.children as VNode[]) : true
}

/** Whether rendered slot output has content (Vue's own rule for falling back to slot defaults). */
const hasContent = (nodes: VNode[] | undefined): boolean => {
  return !!nodes?.some(isContentNode)
}

/** Renders the root's slot `name`, falling back to this component's default slot, so items can live in their own component. */
export const SlotOutlet = (
  props: { name: string; slotProps?: Record<string, unknown> },
  { slots }: { slots: Slots },
) => {
  const root = inject(commandPaletteKey)
  const render = root?.slots[props.name]
  if (render) {
    const nodes = render(props.slotProps ?? {})
    if (hasContent(nodes)) return nodes
  }

  // An empty array without a fallback: the server renderer can't render a Fragment with `null` children.
  return h(Fragment, null, slots.default?.() ?? [])
}

SlotOutlet.props = ['name', 'slotProps']

/** Plain text with the matched runs wrapped in `<mark>`; never parsed as HTML. */
export const Highlighted = (props: { segments?: HighlightSegment[]; text: string }) => {
  if (!props.segments) return props.text

  return props.segments.map((segment) => (segment.isMatch ? h('mark', segment.text) : segment.text))
}

Highlighted.props = ['segments', 'text']
