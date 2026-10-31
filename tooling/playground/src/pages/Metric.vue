<script setup lang="ts">
import type { DropdownEntry } from '@hareui/vue'
import { Link, Metric, TrendChip } from '@hareui/vue'
import { AreaChart } from '@hareui/vue/charts'
import { h, ref } from 'vue'
import { Icon } from '../icons'

const variants = ['default', 'secondary', 'tertiary', 'transparent'] as const
const statuses = [undefined, 'success', 'warning', 'danger'] as const
const BoxIcon = () => h(Icon, { icon: 'gravity-ui:box' })

const actions: DropdownEntry[] = [
  { value: 'refresh', label: 'Refresh' },
  { value: 'export', label: 'Export' },
]
const lastAction = ref('none')

const spark = [12, 14, 13, 17, 16, 19, 18, 22, 21, 24].map((value, index) => ({ day: `D${index + 1}`, value }))
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-xl font-semibold">Metric</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Variants</h2>
      <div class="grid grid-cols-4 gap-3">
        <Metric v-for="variant in variants" :key="variant" :variant="variant" :title="variant" :value="1234" :trend="{ value: '+2%' }" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Status × progress</h2>
      <div class="grid grid-cols-4 gap-3">
        <Metric
          v-for="status in statuses"
          :key="status ?? 'none'"
          :title="status ?? 'no status'"
          :icon="BoxIcon"
          :status="status"
          :value="0.64"
          :format="{ format: 'percent' }"
          :progress="{ value: 64, status }"
        />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Trends, currency, compact</h2>
      <div class="grid grid-cols-3 gap-3">
        <Metric title="Up" :value="98000" :format="{ format: 'currency', currency: 'USD' }" :trend="{ value: '+4.2%' }" />
        <Metric title="Down" :value="1200000" :format="{ notation: 'compact' }" :trend="{ value: '-1.1%', trend: 'down' }" />
        <Metric title="Neutral" :value="7" :trend="{ value: '0%', trend: 'neutral', variant: 'tertiary' }" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Chart, actions, footer</h2>
      <div class="grid grid-cols-3 gap-3">
        <Metric title="Sparkline" :value="24" :trend="{ value: '+12%' }" :actions="actions" @action="lastAction = String($event)">
          <template #chart>
            <AreaChart
              :data="spark"
              index="day"
              :series="{ value: { name: 'Value', color: 'var(--accent)' } }"
              sparkline
              :tooltip="{ cursor: false, panel: false }"
              aria-label="Value trend"
              :height="80"
              :margin="{ top: 4, right: 0, bottom: 0, left: 0 }"
            />
          </template>
        </Metric>
        <Metric title="Footer" :icon="BoxIcon" status="success" :value="512">
          <template #footer><Link href="#">View all</Link></template>
        </Metric>
        <Metric title="Fade 30%" :value="24" class="[--metric-chart-fade:30%]">
          <template #chart>
            <AreaChart :data="spark" index="day" :series="{ value: { name: 'Value' } }" sparkline :height="80" aria-label="Value" />
          </template>
        </Metric>
        <Metric title="Inline chart" :value="24" :trend="{ value: '+12%' }" chart-placement="inline">
          <template #chart>
            <AreaChart :data="spark" index="day" :series="{ value: { name: 'Value' } }" sparkline :height="70" aria-label="Value" />
          </template>
        </Metric>
      </div>
      <p class="mt-2 text-xs text-muted">Last action: {{ lastAction }}</p>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Slots and :ui override</h2>
      <div class="grid grid-cols-3 gap-3">
        <Metric :value="5.5">
          <template #icon><Icon icon="gravity-ui:clock" /></template>
          <template #title>Custom title</template>
          <template #value="{ formatted }">{{ formatted }} min</template>
          <template #trend><TrendChip trend="down" label="-0.3"><template #suffix>wk</template></TrendChip></template>
          <template #actions><button type="button" class="text-xs">Edit</button></template>
        </Metric>
        <Metric title="ui override" :value="42" :ui="{ value: 'text-4xl text-accent', title: 'uppercase' }" />
      </div>
    </section>
  </div>
</template>
