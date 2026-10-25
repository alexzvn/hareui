<template>
  <Card
    class="w-full max-w-[520px] rounded-2xl"
    :ui="{ header: 'flex-row items-start justify-between' }"
  >
    <template #header>
      <div class="flex flex-col gap-3">
        <h3 class="text-base font-medium text-foreground">Podcast Subscribers</h3>
        <div class="flex flex-col gap-0.5">
          <span class="text-xs text-muted">Current total</span>
          <span class="text-2xl font-semibold text-foreground">{{ current.total }}</span>
          <span class="text-xs font-medium text-success">{{ current.change }}</span>
        </div>
      </div>
      <Tabs
        v-model="range"
        :items="items"
        :content="false"
        :ui="{ base: 'w-auto', tab: 'h-7 px-2.5 text-xs' }"
      />
    </template>
    <LineChart
      :data="current.data"
      index="when"
      :series="{ value: { name: 'Subscribers' } }"
      sparkline
      :stroke-width="2"
      :y-axis="{ left: { hide: true, domain: ['dataMin - 100', 'dataMax + 100'] } }"
      :value-formatter="formatSubscribers"
      :tooltip="{ cursor: false, panel: false }"
      aria-label="Podcast subscribers over the selected range"
      :height="182"
      :margin="margin"
    />
  </Card>
</template>

<script setup lang="ts">
import type { TabsItem } from '@hareui/vue'
import { Card, Tabs } from '@hareui/vue'
import { LineChart } from '@hareui/vue/charts'
import { computed, ref } from 'vue'

type Range = '24H' | '7D' | '30D' | '90D' | '1Y'

type Point = {
  when: string
  value: number
}

type Span = { span: number; unit: 'hour' | 'day' | 'week' }

/** Labels each point by how long ago it was: `span` units before the last point, which is "Now". */
const points = (values: number[], { span, unit }: Span): Point[] => {
  const last = values.length - 1
  return values.map((value, index) => {
    const ago = Math.round((span * (last - index)) / last)
    return { when: ago === 0 ? 'Now' : `${ago} ${unit}${ago === 1 ? '' : 's'} ago`, value }
  })
}

const ranges: Record<Range, { total: string; change: string; data: Point[] }> = {
  '24H': {
    total: '18,240',
    change: '+96 (0.5%)',
    data: points(
      [18144, 18150, 18149, 18162, 18171, 18168, 18183, 18190, 18204, 18199, 18216, 18229, 18240],
      { span: 24, unit: 'hour' },
    ),
  },
  '7D': {
    total: '18,240',
    change: '+410 (2.3%)',
    data: points([17830, 17874, 17901, 17962, 17950, 18031, 18088, 18102, 18175, 18240], {
      span: 7,
      unit: 'day',
    }),
  },
  '30D': {
    total: '18,240',
    change: '+640 (3.6%)',
    data: points(
      [
        17600, 17580, 17660, 17720, 17690, 17810, 17870, 17840, 17950, 18020, 17990, 18110, 18160,
        18240,
      ],
      { span: 30, unit: 'day' },
    ),
  },
  '90D': {
    total: '18,240',
    change: '+1,920 (11.8%)',
    data: points(
      [
        16320, 16410, 16380, 16620, 16790, 16740, 17030, 17210, 17160, 17480, 17690, 17820, 18010,
        18240,
      ],
      { span: 90, unit: 'day' },
    ),
  },
  '1Y': {
    total: '18,240',
    change: '+7,105 (63.8%)',
    data: points(
      [
        11135, 11620, 12240, 12110, 12980, 13650, 13420, 14380, 15210, 15030, 16140, 16890, 17540,
        18240,
      ],
      { span: 52, unit: 'week' },
    ),
  },
}

const items: TabsItem[] = (Object.keys(ranges) as Range[]).map((range) => ({
  label: range,
  value: range,
}))

const range = ref<Range>('30D')
const current = computed(() => ranges[range.value])

const margin = { top: 4, right: 0, bottom: 0, left: 0 }

const formatSubscribers = (value: number) => {
  return `${value.toLocaleString('en-US')} subscribers`
}
</script>
