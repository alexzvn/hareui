<template>
  <ScrollArea
    ref="area"
    v-slot="{ item }"
    :items="notes"
    :virtualize="{ lanes, gap: 12, estimateSize: 140 }"
    class="h-120 w-full rounded-2xl border border-border bg-background-secondary p-3"
  >
    <article class="flex flex-col gap-2 rounded-xl bg-surface p-3 shadow-surface">
      <div class="flex items-start justify-between gap-2">
        <h3 class="text-sm font-medium text-foreground">{{ item.title }}</h3>
        <Chip size="sm" variant="soft" :color="TAGS[item.tag]">{{ item.tag }}</Chip>
      </div>
      <p v-if="item.body" class="text-xs leading-relaxed text-muted">{{ item.body }}</p>
      <ul v-if="item.tasks" class="flex flex-col gap-1.5">
        <li
          v-for="task in item.tasks"
          :key="task"
          class="flex items-start gap-2 text-xs leading-relaxed text-foreground"
        >
          <span class="mt-0.5 size-3.5 shrink-0 rounded-sm border border-border" />
          {{ task }}
        </li>
      </ul>
    </article>
  </ScrollArea>
</template>

<script setup lang="ts">
import { Chip, ScrollArea } from '@hareui/vue'
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'

type Tag = 'Work' | 'Home' | 'Travel' | 'Urgent' | 'Ideas'
type Note = { title: string; tag: Tag; body?: string; tasks?: string[] }

const TAGS = {
  Work: 'accent',
  Home: 'success',
  Travel: 'warning',
  Urgent: 'danger',
  Ideas: 'default',
} as const satisfies Record<Tag, string>

const NOTES: Note[] = [
  { title: 'Projector', tag: 'Work', body: 'Ask the venue whether the projector takes HDMI.' },
  {
    title: 'Offsite travel',
    tag: 'Travel',
    body: 'Book flights for the offsite. Check whether the hotel runs a shuttle from the airport, and how late the last one leaves on Thursday.',
  },
  { title: 'Groceries', tag: 'Home', tasks: ['Oat milk', 'Lemons', 'Coffee beans', 'Rice'] },
  { title: 'Domain', tag: 'Urgent', body: 'Renew the domain before the 14th.' },
  {
    title: 'Onboarding email',
    tag: 'Work',
    body: 'Draft the welcome email for new hires. Keep it short: first-day schedule, who to ask for help, and where the handbook lives.',
    tasks: ['Write the draft', 'Send it to Priya for review'],
  },
  {
    title: 'Garden ideas',
    tag: 'Ideas',
    body: 'Raised beds along the south fence. Herbs near the kitchen door so they are easy to grab while cooking.',
  },
  {
    title: 'Packing list',
    tag: 'Travel',
    tasks: ['Passport', 'Chargers', 'Rain jacket', 'Walking shoes', 'Adapter plug'],
  },
  { title: 'Dentist', tag: 'Home', body: 'Tuesday at 8:30.' },
  {
    title: 'Release checklist',
    tag: 'Work',
    tasks: ['Freeze the branch', 'Run the smoke tests', 'Write the changelog'],
  },
  {
    title: 'Podcast',
    tag: 'Ideas',
    body: 'A short weekly episode where two engineers review one pull request from an open source project, line by line, and explain what they would change.',
  },
  {
    title: 'Server certificate',
    tag: 'Urgent',
    body: 'Expires in 3 days. Rotate it on staging first.',
  },
  { title: 'Weekend', tag: 'Home', tasks: ['Fix the bike tyre', 'Call grandma'] },
  {
    title: 'Lisbon',
    tag: 'Travel',
    body: 'Tram 28 early in the morning, before the queues. Dinner in Alfama on the second night.',
  },
  {
    title: 'Standup notes',
    tag: 'Work',
    body: 'Search is blocked on the new index. Sam pairs with Lee.',
  },
  {
    title: 'Birthday gift',
    tag: 'Ideas',
    body: 'A pottery class for two, or the cookbook she mentioned last month.',
  },
  {
    title: 'Move-out',
    tag: 'Home',
    tasks: ['Book the van', 'Cancel the internet', 'Photograph the meter', 'Return the keys'],
  },
  { title: 'Invoice 2041', tag: 'Urgent', body: 'Unpaid since March. Send a reminder.' },
  {
    title: 'Design review',
    tag: 'Work',
    body: 'Bring the printed mockups and last month’s usage numbers. Sam joins remotely, so share the call link the day before.',
  },
]

const area = useTemplateRef('area')
const width = ref(0)

// Each lane gets at least 220 px, between 1 and 4 lanes
const lanes = computed(() => Math.min(Math.max(Math.floor(width.value / 220), 1), 4))

let observer: ResizeObserver | undefined

onMounted(() => {
  observer = new ResizeObserver(([entry]) => {
    width.value = entry?.contentRect.width ?? 0
  })

  if (area.value?.$el) observer.observe(area.value.$el)
})

onBeforeUnmount(() => observer?.disconnect())

// 1,000 notes, measured once rendered: each card is as tall as its content
const notes = Array.from({ length: 1000 }, (_, index) => ({
  id: index,
  ...NOTES[(index * 7) % NOTES.length]!,
}))
</script>
