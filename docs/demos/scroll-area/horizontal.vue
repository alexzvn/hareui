<template>
  <ScrollArea
    ref="area"
    v-slot="{ item, index }"
    :items="days"
    orientation="horizontal"
    :virtualize="{ estimateSize: 88, gap: 8, paddingStart: 8, paddingEnd: 8 }"
    class="h-28 w-full max-w-lg rounded-2xl border border-border bg-surface"
  >
    <div class="flex h-full items-center py-2">
      <button
        type="button"
        class="flex h-full w-20 flex-col items-center justify-center gap-1 rounded-xl outline-none transition-colors focus-visible:status-focused"
        :class="
          index === selected
            ? 'bg-accent text-accent-foreground'
            : 'bg-default text-foreground hover:bg-default-hover'
        "
        :aria-label="item.label"
        :aria-pressed="index === selected"
        @click="selected = index"
      >
        <span class="text-xs" :class="index !== selected && 'text-muted'">{{ item.weekday }}</span>
        <span class="text-xl font-semibold">{{ item.day }}</span>
        <span class="text-xs" :class="index !== selected && 'text-muted'">
          {{ index === TODAY ? 'Today' : item.month }}
        </span>
      </button>
    </div>
  </ScrollArea>
</template>

<script setup lang="ts">
import { ScrollArea } from '@hareui/vue'
import { onMounted, ref, useTemplateRef } from 'vue'

// Half a year back and a year ahead of today
const TODAY = 182
const DAY_COUNT = TODAY + 365

const weekday = new Intl.DateTimeFormat('en', { weekday: 'short' })
const month = new Intl.DateTimeFormat('en', { month: 'short' })
const label = new Intl.DateTimeFormat('en', { dateStyle: 'full' })

const today = new Date()

const days = Array.from({ length: DAY_COUNT }, (_, index) => {
  const date = new Date(today)
  date.setDate(today.getDate() + index - TODAY)

  return {
    id: index,
    weekday: weekday.format(date),
    day: date.getDate(),
    month: month.format(date),
    label: label.format(date),
  }
})

const area = useTemplateRef('area')
const selected = ref(TODAY)

onMounted(() => area.value?.scrollToIndex(TODAY, { align: 'center' }))
</script>
