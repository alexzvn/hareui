<template>
  <ScrollArea
    ref="area"
    v-slot="{ item }"
    :items="rows"
    :virtualize="{ estimateSize: 64 }"
    class="h-96 w-full max-w-md rounded-2xl border border-border bg-surface"
  >
    <div
      v-if="item.kind === 'loader'"
      class="flex h-16 items-center justify-center gap-2 text-sm text-muted"
      role="status"
    >
      <Spinner size="sm" color="current" />
      Loading more activity
    </div>
    <div
      v-else-if="item.kind === 'end'"
      class="flex h-16 items-center justify-center text-sm text-muted"
    >
      You are all caught up
    </div>
    <div
      v-else-if="item.kind === 'activity'"
      class="flex items-start gap-3 border-b border-separator px-4 py-3"
    >
      <Avatar :fallback="item.initials" :color="item.color" size="sm" />
      <div class="flex min-w-0 flex-1 flex-col gap-0.5">
        <p class="text-sm text-muted">
          <span class="font-medium text-foreground">{{ item.actor }}</span>
          {{ item.action }}
          <span class="font-medium text-foreground">{{ item.target }}</span>
        </p>
        <span class="text-xs text-muted">{{ item.time }}</span>
      </div>
    </div>
  </ScrollArea>
</template>

<script setup lang="ts">
import { Avatar, ScrollArea, Spinner } from '@hareui/vue'
import { computed, ref, useTemplateRef, watch } from 'vue'

const PAGE_SIZE = 30
const TOTAL = 240

const ACTORS = [
  { name: 'Inês Barros', color: 'accent' },
  { name: 'Tom Weber', color: 'success' },
  { name: 'Akosua Mensah', color: 'warning' },
  { name: 'Kaito Sato', color: 'danger' },
  { name: 'Lena Fischer', color: 'default' },
  { name: 'Omar Haddad', color: 'accent' },
] as const

const ACTIONS = [
  ['merged', 'Billing page redesign'],
  ['commented on', 'Search returns stale results'],
  ['opened', 'Dark mode for the settings page'],
  ['closed', 'Login fails on Safari 17'],
  ['reviewed', 'Faster image uploads'],
  ['assigned you to', 'Q4 onboarding checklist'],
  ['released', 'v3.4.2'],
] as const

type Activity = {
  kind: 'activity'
  id: number
  actor: string
  initials: string
  color: (typeof ACTORS)[number]['color']
  action: string
  target: string
  time: string
}

type Row = Activity | { kind: 'loader' | 'end'; id: string }

const formatAgo = (minutes: number) => {
  if (minutes < 60) return `${minutes} min ago`
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)} h ago`

  return `${Math.floor(minutes / (60 * 24))} d ago`
}

const createActivity = (index: number): Activity => {
  const actor = ACTORS[(index * 5) % ACTORS.length]!
  const [action, target] = ACTIONS[(index * 3) % ACTIONS.length]!

  return {
    kind: 'activity',
    id: index,
    actor: actor.name,
    initials: actor.name
      .split(' ')
      .map((part) => part[0])
      .join(''),
    color: actor.color,
    action,
    target,
    time: formatAgo(index * 13 + 2),
  }
}

// Stands in for a paginated API that takes 600 ms per page
const fetchPage = (offset: number) =>
  new Promise<Activity[]>((resolve) => {
    const page = Array.from({ length: PAGE_SIZE }, (_, index) => createActivity(offset + index))
    setTimeout(() => resolve(page), 600)
  })

const activities = ref<Activity[]>(
  Array.from({ length: PAGE_SIZE }, (_, index) => createActivity(index)),
)

const isLoading = ref(false)
const hasMore = computed(() => activities.value.length < TOTAL)

const rows = computed<Row[]>(() => {
  if (isLoading.value) return [...activities.value, { kind: 'loader', id: 'loader' }]
  if (!hasMore.value) return [...activities.value, { kind: 'end', id: 'end' }]

  return activities.value
})

const loadMore = async () => {
  isLoading.value = true
  activities.value = [...activities.value, ...(await fetchPage(activities.value.length))]
  isLoading.value = false
}

const area = useTemplateRef('area')
const lastRenderedIndex = computed(
  () => area.value?.virtualizer?.getVirtualItems().at(-1)?.index ?? 0,
)

// Load the next page when the rendered window reaches the last five items
watch(lastRenderedIndex, (index) => {
  const isNearEnd = index >= activities.value.length - 5
  if (isNearEnd && hasMore.value && !isLoading.value) loadMore()
})
</script>
