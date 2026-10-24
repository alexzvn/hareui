import { useId } from 'reka-ui'
import type { ComputedRef, InjectionKey, Ref, ShallowRef } from 'vue'
import {
  computed,
  getCurrentInstance,
  inject,
  onMounted,
  onScopeDispose,
  provide,
  reactive,
  ref,
  shallowReactive,
  shallowRef,
  watchEffect,
} from 'vue'

import type { ClassValue } from '@/utils/tv'
import { warn } from '@/utils/warn'

import type {
  ChartActiveState,
  ChartDatum,
  ChartInteraction,
  ChartLayerName,
  ChartLayout,
  ChartMargin,
  ChartSeries,
  ChartTooltipPayloadEntry,
} from './types'
import { chartLayerNames } from './types'

/** Class functions of a chart root theme (any subset of the shared chart slots). */
export type ChartRootUI = Record<string, (props?: { class?: ClassValue }) => string>

export type ChartRootOptions = {
  data: () => ChartDatum[] | undefined
  margin: () => ChartMargin | undefined
  layout: () => ChartLayout
  /** The root's resolved theme (`useComponentUI(name, { theme: theme, variantProps: … })`). */
  ui: ComputedRef<object>
  /** The root's `ui` prop. */
  uiProps: () => Partial<Record<string, ClassValue>> | undefined
  /** Default `ChartTooltip` cursor: `'band'` for bar charts, `'line'` (the default) for the rest. */
  cursor?: 'line' | 'band'
}

export type ChartContext = {
  /** Unique id; prefix for clip paths and other SVG ids. */
  id: string
  data: ComputedRef<ChartDatum[]>
  layout: ComputedRef<ChartLayout>
  /** Default `ChartTooltip` cursor kind for this chart type. */
  cursor: 'line' | 'band'
  /** Measured SVG size in px; 0 until measured. */
  width: Ref<number>
  height: Ref<number>
  margin: ComputedRef<Required<ChartMargin>>
  /** Classes of a theme slot of the root, merged with the root's `ui` override and `extra`. */
  classes: (slot: string, extra?: ClassValue) => string
  /** SVG layer groups, filled by `ChartSurface`. */
  layers: Record<ChartLayerName, Element | null>
  /** HTML layer over the SVG (tooltip panel). */
  overlay: ShallowRef<HTMLElement | null>
  /** Registered series in template order. */
  series: ComputedRef<ChartSeries[]>
  /** Registers a series; returns the unregister function (also called when the calling scope is disposed). */
  registerSeries: (get: () => ChartSeries) => () => void
  /** Hovered / focused datum. */
  active: ChartActiveState
  setActive: (state: Partial<ChartActiveState> | null) => void
  /** Number of mounted `ChartTooltip`s; pointer and keyboard tracking only run when > 0. */
  tooltipEnabled: Ref<number>
  /** Maps pointer and keyboard positions to data indexes. */
  interaction: ShallowRef<ChartInteraction | null>
  /** Tooltip header of a datum (cartesian: the category axis value). */
  tooltipLabel: ShallowRef<(index: number) => string | number | undefined>
  /** Tooltip rows at a datum: every visible series, or only `seriesId` for item-triggered charts. */
  payloadAt: (index: number, seriesId?: string | null) => ChartTooltipPayloadEntry[]
  /**
   * Index and series from the root's `index` / `series` props (null when neither is set). Parts placed by hand
   * default from it: the category axis `dataKey`, and a series' `name`, color and `hide` (by `dataKey`).
   */
  config: ShallowRef<(() => ChartRootConfig | null) | null>
}

/** Default `dataKey` of the category axis and per-series defaults of the parts, by `dataKey`. */
export const useChartConfig = (chart: ChartContext) => {
  return {
    index: () => chart.config.value?.()?.index,
    series: (dataKey: string) =>
      chart.config.value?.()?.series.find((entry) => entry.key === dataKey),
  }
}

/** What a root publishes from its `index` / `series` props. */
export type ChartRootConfig = {
  index?: string
  series: ReadonlyArray<{ key: string; name: string; color: string; hidden: boolean }>
  hidden: readonly string[]
}

export const chartContextKey: InjectionKey<ChartContext> = Symbol('hareui-chart')

const DEFAULT_MARGIN: Required<ChartMargin> = { top: 8, right: 8, bottom: 0, left: 0 }

// Each duplicate warns once.
const warnDuplicateParts = ({
  tooltipEnabled,
  series,
}: {
  tooltipEnabled: Ref<number>
  series: ComputedRef<ChartSeries[]>
}) => {
  const warned = new Set<string>()
  const warnOnce = (key: string, message: string) => {
    if (warned.has(key)) return

    warned.add(key)
    warn(message)
  }

  watchEffect(() => {
    if (tooltipEnabled.value > 1)
      warnOnce(
        'tooltip',
        'Two ChartTooltips in one chart. When the chart root draws its tooltip from props, pass `:tooltip="false"` before adding a ChartTooltip.',
      )

    const seen = new Set<string>()
    for (const entry of series.value) {
      if (entry.entries || entry.hide) continue
      const key = `${entry.kind}:${entry.dataKey}`
      if (seen.has(key))
        warnOnce(
          key,
          `Two ${entry.kind} series read "${entry.dataKey}" in one chart. When the chart root draws its series from \`series\`, leave that key out of \`series\` or remove the child part.`,
        )

      seen.add(key)
    }
  })
}

/** Creates the chart context of a root and provides it to its parts. Call in the root's setup. */
export const useChartRoot = (options: ChartRootOptions): ChartContext => {
  const id = useId(undefined, 'hareui-chart')
  const width = ref(0)
  const height = ref(0)

  // Each series keeps its component's DOM anchor, so the list follows template order: a series shown again with
  // `v-if` goes back to its place in the stack and the tooltip instead of moving to the end.
  const registry = shallowReactive(
    new Map<number, { get: () => ChartSeries; anchor: () => Node | null }>(),
  )

  const mountedSeries = ref(0)
  let nextSeries = 0

  const layers = shallowReactive(
    Object.fromEntries(chartLayerNames.map((name) => [name, null])),
  ) as Record<ChartLayerName, Element | null>

  const active = reactive<ChartActiveState>({
    index: null,
    seriesId: null,
    coordinate: null,
    source: null,
  })

  const data = computed(() => options.data() ?? [])

  const series = computed(() => {
    void mountedSeries.value
    return [...registry.values()].sort(byTemplateOrder).map((entry) => entry.get())
  })

  const byTemplateOrder = (a: { anchor: () => Node | null }, b: { anchor: () => Node | null }) => {
    const first = a.anchor()
    const second = b.anchor()
    if (!first?.isConnected || !second?.isConnected || first === second) return 0

    return first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
  }

  const registerSeries = (get: () => ChartSeries) => {
    const key = nextSeries++
    const instance = getCurrentInstance()
    registry.set(key, {
      get,
      anchor: () => (instance?.vnode.el as Node | null | undefined) ?? null,
    })

    if (instance) onMounted(() => mountedSeries.value++)
    const unregister = () => registry.delete(key)
    onScopeDispose(unregister)

    return unregister
  }

  const setActive = (state: Partial<ChartActiveState> | null) => {
    if (!state || state.index === null || state.index === undefined) {
      Object.assign(active, { index: null, seriesId: null, coordinate: null, source: null })
      return
    }

    Object.assign(active, { seriesId: null, coordinate: null, source: 'pointer', ...state })
  }

  const tooltipLabel = shallowRef<(index: number) => string | number | undefined>(() => undefined)

  const payloadAt = (index: number, seriesId?: string | null): ChartTooltipPayloadEntry[] => {
    const datum = data.value[index]
    return series.value
      .filter(
        (entry) => !entry.hide && entry.tooltip !== false && (!seriesId || entry.id === seriesId),
      )
      .flatMap((entry) => {
        // Series with their own data (pie) build their entries; the default path reads the root datum.
        if (entry.entries) return entry.entries(index)
        const value = datum?.[entry.dataKey]
        if (!datum || value === undefined || value === null) return []

        return [
          {
            dataKey: entry.dataKey,
            name: entry.name ?? entry.dataKey,
            value,
            color: entry.color,
            stroke: entry.stroke,
            fill: entry.fill,
            payload: datum,
          },
        ]
      })
  }

  const tooltipEnabled = ref(0)

  // Duplicates usually mean the root draws a part from its props (`series`, `tooltip`) and the same part was also
  // added as a child.
  warnDuplicateParts({ tooltipEnabled, series })

  const context: ChartContext = {
    id,
    data,
    layout: computed(options.layout),
    cursor: options.cursor ?? 'line',
    width,
    height,
    margin: computed(() => ({ ...DEFAULT_MARGIN, ...options.margin() })),
    classes: (slot, extra) => {
      const ui = options.ui.value as ChartRootUI
      return ui[slot]?.({ class: [options.uiProps()?.[slot], extra] }) ?? ''
    },
    layers,
    overlay: shallowRef(null),
    series,
    registerSeries,
    active,
    setActive,
    tooltipEnabled,
    interaction: shallowRef(null),
    tooltipLabel,
    payloadAt,
    config: shallowRef(null),
  }

  provide(chartContextKey, context)

  return context
}

/** The enclosing chart root's context. Throws outside a chart. */
export const useChartContext = (component = 'Chart part'): ChartContext => {
  const context = inject(chartContextKey, null)
  if (!context)
    throw new Error(`${component} must be used inside a chart (AreaChart, BarChart, LineChart, …).`)

  return context
}
