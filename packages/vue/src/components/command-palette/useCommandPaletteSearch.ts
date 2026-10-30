import { defu } from 'defu'
import Fuse from 'fuse.js'
import type { FuseResult, IFuseOptions } from 'fuse.js'
import type { Ref } from 'vue'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import { warn } from '@/utils/warn'

import type {
  CommandPaletteFuseOptions,
  CommandPaletteGroup,
  CommandPaletteItem,
  CommandPaletteResolvedItem,
} from './CommandPalette.types'

type SearchOptions<T extends CommandPaletteItem, G extends CommandPaletteGroup<T>> = {
  groups: () => G[] | undefined
  searchTerm: Ref<string>
  options: () => {
    fuse?: CommandPaletteFuseOptions<T>
    labelKey: string
    descriptionKey: string
    preserveGroupOrder: boolean
    ignoreFilter: boolean
    searchDelay: number
  }
}

type ResolvedFuseOptions<T> = Required<
  Omit<CommandPaletteFuseOptions<T & CommandPaletteItem>, 'fuseOptions'>
> & {
  fuseOptions: IFuseOptions<T>
}

/** A group as rendered: its fields, with the items that matched (capped at `resultLimit`). */
export type CommandPaletteFilteredGroup<
  T extends CommandPaletteItem,
  G extends CommandPaletteGroup<T>,
> = Omit<G, 'items'> & {
  items: CommandPaletteResolvedItem<T>[]
}

/**
 * Searches the items of every group with Fuse.js and regroups the results. Groups with `ignoreFilter` keep their
 * items and their place among the searched groups; `postFilter` runs on each group's matches before the cap.
 */
export const useCommandPaletteSearch = <
  T extends CommandPaletteItem,
  G extends CommandPaletteGroup<T>,
>({
  groups,
  searchTerm,
  options,
}: SearchOptions<T, G>) => {
  type Resolved = CommandPaletteResolvedItem<T>
  type Filtered = CommandPaletteFilteredGroup<T, G>

  // The term handed to Fuse, debounced by `searchDelay` (0 passes it straight through).
  const fuseSearchTerm = ref(searchTerm.value)
  let timer: ReturnType<typeof setTimeout> | undefined

  watch(searchTerm, (value) => {
    clearTimeout(timer)
    const delay = options().searchDelay
    if (!delay) {
      fuseSearchTerm.value = value
      return
    }

    timer = setTimeout(() => {
      fuseSearchTerm.value = value
    }, delay)
  })

  onBeforeUnmount(() => clearTimeout(timer))

  const fuse = computed(() => {
    const { fuse: custom, labelKey, descriptionKey } = options()

    return defu({}, custom, {
      fuseOptions: {
        ignoreLocation: true,
        threshold: 0.1,
        keys: [labelKey, descriptionKey, 'suffix'],
      },
      resultLimit: 12,
      matchAllWhenSearchEmpty: true,
    }) as ResolvedFuseOptions<Resolved>
  })

  const isFilterIgnored = (group: G) => group.ignoreFilter ?? options().ignoreFilter

  const searchable = computed<Resolved[]>(() =>
    (groups() ?? [])
      .filter((group) => {
        if (!group.id) {
          warn('CommandPalette group is missing an `id` property')
          return false
        }

        return !isFilterIgnored(group)
      })
      .flatMap((group) => (group.items ?? []).map((item) => ({ ...item, group: group.id }))),
  )

  const index = computed(() => new Fuse(searchable.value, fuse.value.fuseOptions))

  const results = computed<FuseResult<Resolved>[]>(() => {
    const term = fuseSearchTerm.value
    if (!term && fuse.value.matchAllWhenSearchEmpty)
      return searchable.value.map((item, refIndex) => ({ item, refIndex }))

    const limit = fuse.value.resultLimit

    return index.value.search(term, limit ? { limit } : undefined)
  })

  const toFilteredGroup = (group: G, items: Resolved[]): Filtered | undefined => {
    const kept = group.postFilter
      ? (group.postFilter(fuseSearchTerm.value, items as T[]) as Resolved[])
      : items

    if (kept.length === 0) return undefined

    return { ...group, items: kept.slice(0, fuse.value.resultLimit) }
  }

  const itemsByGroup = computed(() => {
    const byGroup = new Map<string, Resolved[]>()
    for (const { item, matches } of results.value) {
      if (!item.group) continue
      const list = byGroup.get(item.group) ?? []
      list.push({ ...item, matches })
      byGroup.set(item.group, list)
    }

    return byGroup
  })

  const inGroupOrder = (current: G[]) => {
    return current
      .map((group) => {
        const items = isFilterIgnored(group) ? group.items : itemsByGroup.value.get(group.id)
        if (!items?.length) return undefined

        return toFilteredGroup(group, items as Resolved[])
      })
      .filter((group) => group !== undefined)
  }

  // Unfiltered groups go right after the last searched group that precedes them in `groups`.
  const insertIgnored = ({ result, current }: { result: Filtered[]; current: G[] }) => {
    current.forEach((group, position) => {
      if (!isFilterIgnored(group) || !group.items?.length) return

      const filtered = toFilteredGroup(group, group.items as Resolved[])
      if (!filtered) return

      const precedingIds = new Set(current.slice(0, position).map((entry) => entry.id))
      const insertAfter = result.map((entry) => precedingIds.has(entry.id)).lastIndexOf(true)

      result.splice(insertAfter + 1, 0, filtered)
    })

    return result
  }

  const filteredGroups = computed<Filtered[]>(() => {
    const current = groups() ?? []
    if (options().preserveGroupOrder) return inGroupOrder(current)

    const searched = [...itemsByGroup.value]
      .map(([id, items]) => {
        const group = current.find((entry) => entry.id === id)

        return group ? toFilteredGroup(group, items) : undefined
      })
      .filter((group) => group !== undefined)

    return insertIgnored({ result: searched, current })
  })

  const filteredItems = computed(() => filteredGroups.value.flatMap((group) => group.items))

  return { filteredGroups, filteredItems, fuseSearchTerm, fuse }
}
