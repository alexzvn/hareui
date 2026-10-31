<template>
  <div class="w-full max-w-[460px] rounded-2xl border border-separator px-3 py-2">
    <p
      class="m-0 flex items-center gap-2 border-b border-separator px-1 pb-2 text-xs font-medium text-muted"
    >
      <Icon icon="gravity-ui:arrows-rotate-right" class="size-3.5" /> Synced from your watch
    </p>
    <DropZoneFileList class="gap-0 divide-y divide-separator">
      <DropZoneFileItem
        v-for="file in workoutFiles"
        :key="file.key"
        :name="file.name"
        :size="file.bytes"
        :status="statusOf(file)"
        class="rounded-none border-0 px-1 py-3"
        @remove="removeFile(file.key)"
      >
        <template #meta="{ size, status }">
          <span>{{ size }}</span>
          <span aria-hidden="true">·</span>
          <span v-if="status === 'uploading'" class="tabular-nums"
            >Syncing {{ Math.floor((file.sent / file.bytes) * 100) }}%</span
          >
          <span v-else-if="status === 'complete'" class="text-success">Synced</span>
          <span v-else class="text-danger">Phone went offline</span>
        </template>
        <Button
          v-if="file.offline"
          class="mt-1.5 w-fit"
          size="sm"
          variant="outline"
          @click="syncAgain(file)"
        >
          <Icon icon="gravity-ui:arrows-rotate-left" /> Sync again
        </Button>
      </DropZoneFileItem>
    </DropZoneFileList>
  </div>
</template>

<script setup lang="ts">
import type { DropZoneFileStatus } from '@hareui/vue'
import { Button, DropZoneFileItem, DropZoneFileList } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

type WorkoutFile = {
  key: string
  name: string
  bytes: number
  sent: number
  offline: boolean
}

const startingFiles = (): WorkoutFile[] => [
  { key: 'plan', name: 'Training plan.pdf', bytes: 190464, sent: 190464, offline: false },
  { key: 'heart', name: 'Heart rate log.csv', bytes: 94208, sent: 34856, offline: false },
  { key: 'sprints', name: 'Hill sprints.mov', bytes: 13002342, sent: 0, offline: true },
]

const workoutFiles = ref<WorkoutFile[]>(startingFiles())

const statusOf = (file: WorkoutFile): DropZoneFileStatus => {
  if (file.offline) return 'failed'
  return file.sent >= file.bytes ? 'complete' : 'uploading'
}

const syncAgain = (file: WorkoutFile) => {
  file.offline = false
  file.sent = 0
  resume()
}

const removeFile = (key: string) => {
  workoutFiles.value = workoutFiles.value.filter((file) => file.key !== key)
}

// Simulated sync: 1.5 MB/s shared by every file still syncing, and at least 1.2 s per file
const BYTES_PER_MS = (1.5 * 1024 * 1024) / 1000
let frame = 0
let lastTime = 0

const pump = (now: number) => {
  const syncing = workoutFiles.value.filter((file) => statusOf(file) === 'uploading')
  if (!syncing.length) {
    frame = 0
    return
  }

  const elapsed = Math.min(now - lastTime, 100)
  for (const file of syncing)
    file.sent = Math.min(
      file.bytes,
      file.sent +
        Math.max((BYTES_PER_MS * elapsed) / syncing.length, (file.bytes * elapsed) / 1200),
    )

  lastTime = now
  frame = requestAnimationFrame(pump)
}

const resume = () => {
  if (frame) return
  lastTime = performance.now()
  frame = requestAnimationFrame(pump)
}

// Brings the files back once the list is empty, so the demo can be replayed
let refill: ReturnType<typeof setTimeout> | undefined
watch(
  () => workoutFiles.value.length,
  (length) => {
    if (length === 0) {
      refill = setTimeout(() => {
        workoutFiles.value = startingFiles()
        resume()
      }, 600)
    }
  },
)

onMounted(resume)

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  clearTimeout(refill)
})
</script>
