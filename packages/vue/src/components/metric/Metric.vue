<template>
  <Card
    :as="as"
    :variant="variant"
    data-slot="metric"
    :data-chart-placement="chartPlacement"
    :class="ui.base()"
  >
    <dl data-slot="metric-list" :class="ui.list()">
      <dt v-if="hasHeader" data-slot="metric-header" :class="ui.header()">
        <div
          v-if="icon || !!slots.icon"
          data-slot="metric-icon"
          :data-status="status"
          :class="ui.icon()"
        >
          <slot name="icon">
            <IconRenderer v-if="icon" :icon="icon" />
          </slot>
        </div>
        <span data-slot="metric-title" :class="ui.title()">
          <slot name="title">{{ title }}</slot>
        </span>
      </dt>
      <dd data-slot="metric-content" :class="ui.content()">
        <span data-slot="metric-value" :class="ui.value()">
          <NumberValue v-if="value !== undefined" v-bind="format" :value="value">
            <template v-if="!!slots.value" #default="slotProps">
              <slot name="value" v-bind="slotProps" />
            </template>
          </NumberValue>
        </span>
        <slot name="trend">
          <TrendChip
            v-if="trend"
            v-bind="trendProps"
            data-slot="metric-trend"
            :class="ui.trend()"
          />
        </slot>
        <div
          v-if="chartPlacement === 'inline' && !!slots.chart"
          data-slot="metric-chart"
          :class="ui.chart()"
        >
          <slot name="chart" />
        </div>
        <div v-if="progress" data-slot="metric-progress" :class="ui.progress()">
          <ProgressBar
            :value="progress.value"
            :color="progress.status ?? 'success'"
            size="sm"
            :aria-label="title ?? t('metric.progress')"
          />
        </div>
      </dd>
    </dl>
    <slot />
    <div v-if="!!slots.actions || actions?.length" data-slot="metric-actions" :class="ui.actions()">
      <slot name="actions">
        <Dropdown :items="actions" @action="emit('action', $event)">
          <Button variant="ghost" size="sm" icon-only :aria-label="t('metric.actions')">
            <EllipsisVerticalIcon :class="ui.actionsIcon()" />
          </Button>
        </Dropdown>
      </slot>
    </div>
    <div
      v-if="chartPlacement === 'bottom' && !!slots.chart"
      data-slot="metric-chart"
      :class="ui.chart()"
    >
      <slot name="chart" />
    </div>
    <template v-if="!!slots.footer">
      <Separator data-slot="metric-separator" :class="ui.separator()" />
      <div data-slot="metric-footer" :class="ui.footer()">
        <slot name="footer" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { Dropdown } from '@/components/dropdown'
import { NumberValue } from '@/components/number-value'
import { ProgressBar } from '@/components/progress-bar'
import { Separator } from '@/components/separator'
import { TrendChip } from '@/components/trend-chip'
import { useComponentUI } from '@/composables/useComponentUI'
import { useLocale } from '@/composables/useLocale'
import { IconRenderer } from '@/utils/icon'

import { EllipsisVerticalIcon } from './icons'
import type { MetricEmits, MetricProps, MetricSlots } from './Metric.types'
import theme from './theme'

const props = withDefaults(defineProps<MetricProps>(), { as: 'div', chartPlacement: 'bottom' })
const emit = defineEmits<MetricEmits>()
const slots = defineSlots<MetricSlots>()

const { t } = useLocale()

const ui = useComponentUI('metric', {
  theme,
  variantProps: () => ({ status: props.status, chartPlacement: props.chartPlacement }),
  props,
})

const hasHeader = computed(() => !!props.title || !!props.icon || !!slots.title || !!slots.icon)

// `trend.value` is the chip text: TrendChip calls it `label`
const trendProps = computed(() => {
  if (!props.trend) return {}

  const { value, ...chipProps } = props.trend

  return { ...chipProps, label: value }
})
</script>
