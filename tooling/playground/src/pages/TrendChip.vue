<script setup lang="ts">
import { TrendChip } from '@hareui/vue'
import { Icon } from '../icons'

const trends = ['up', 'down', 'neutral'] as const
const variants = ['primary', 'secondary', 'soft', 'tertiary'] as const
const sizes = ['sm', 'md', 'lg'] as const
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-xl font-semibold">TrendChip</h1>

    <section v-for="size in sizes" :key="size">
      <h2 class="mb-2 text-sm font-medium text-muted">Variants × trends ({{ size }})</h2>
      <div class="flex flex-col gap-2">
        <div v-for="variant in variants" :key="variant" class="flex flex-wrap items-center gap-3">
          <span class="w-20 text-xs text-muted">{{ variant }}</span>
          <TrendChip
            v-for="trend in trends"
            :key="trend"
            :trend="trend"
            :variant="variant"
            :size="size"
            :label="trend === 'down' ? '-2.4%' : trend === 'up' ? '+3.1%' : '0.0%'"
          />
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Slots (prefix / suffix / indicator)</h2>
      <div class="flex flex-wrap items-center gap-3">
        <TrendChip label="1,234"><template #prefix>+$</template></TrendChip>
        <TrendChip trend="down" label="-5.9%"><template #suffix>vs last month</template></TrendChip>
        <TrendChip label="+11.1%">
          <template #indicator><Icon icon="gravity-ui:chevrons-up" width="12" /></template>
        </TrendChip>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Tabular numerals</h2>
      <div class="flex flex-col items-start gap-1">
        <TrendChip label="+1.1%" />
        <TrendChip label="+22.2%" />
        <TrendChip trend="down" label="-333.3%" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override</h2>
      <TrendChip label="+7.0%" :ui="{ base: 'rounded-sm', suffix: 'text-current' }">
        <template #suffix>YoY</template>
      </TrendChip>
    </section>
  </div>
</template>
