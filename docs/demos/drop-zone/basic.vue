<template>
  <div class="grid w-full max-w-[760px] items-start gap-5 sm:grid-cols-2">
    <DropZone
      label="Drop your boarding passes and hotel bookings"
      description="PDF, PNG or JPG, up to 20 MB each."
      trigger-label="Browse files"
      accept=".pdf,.png,.jpg,.jpeg"
      :max-size="20 * 1024 * 1024"
      multiple
      @add="addDocuments"
    >
      <template #files />
    </DropZone>

    <section class="flex flex-col gap-3">
      <h3 class="m-0 text-sm font-semibold text-foreground">
        Trip documents <span class="font-normal text-muted">({{ documents.length }})</span>
      </h3>
      <p
        v-if="!documents.length"
        class="m-0 rounded-xl bg-default px-4 py-6 text-center text-xs text-muted"
      >
        Nothing here yet. Files you add show up in this list.
      </p>
      <DropZoneFileList>
        <DropZoneFileItem
          v-for="doc in documents"
          :key="doc.key"
          :name="doc.name"
          :size="doc.bytes"
          :status="isSent(doc) ? 'complete' : 'uploading'"
          :progress="isSent(doc) ? undefined : percent(doc)"
          @remove="removeDocument(doc.key)"
        >
          <template #meta="{ size }">
            <span>{{ size }}</span>
            <span aria-hidden="true">·</span>
            <span :class="isSent(doc) && 'text-success'">{{
              isSent(doc) ? 'Saved to your trip' : `${percent(doc)}% uploaded`
            }}</span>
          </template>
        </DropZoneFileItem>
      </DropZoneFileList>
    </section>
  </div>
</template>

<script setup lang="ts">
import { DropZone, DropZoneFileItem, DropZoneFileList } from '@hareui/vue'
import { onBeforeUnmount, ref } from 'vue'

type TripDocument = {
  key: string
  name: string
  bytes: number
  sent: number
}

const documents = ref<TripDocument[]>([])
let added = 0

function addDocuments(files: File[]) {
  documents.value.push(
    ...files.map((file) => ({ key: `doc-${added++}`, name: file.name, bytes: file.size, sent: 0 })),
  )
  resume()
}

function removeDocument(key: string) {
  documents.value = documents.value.filter((doc) => doc.key !== key)
}

const percent = (doc: TripDocument) => (doc.bytes ? Math.floor((doc.sent / doc.bytes) * 100) : 100)
const isSent = (doc: TripDocument) => doc.sent >= doc.bytes

// Simulated network: one 1.5 MB/s connection shared by every file still sending, and at least 1.2 s per file
const BYTES_PER_MS = (1.5 * 1024 * 1024) / 1000
let frame = 0
let lastTime = 0

function pump(now: number) {
  const sending = documents.value.filter((doc) => !isSent(doc))
  if (!sending.length) {
    frame = 0
    return
  }
  const elapsed = Math.min(now - lastTime, 100)
  for (const doc of sending)
    doc.sent = Math.min(
      doc.bytes,
      doc.sent + Math.max((BYTES_PER_MS * elapsed) / sending.length, (doc.bytes * elapsed) / 1200),
    )
  lastTime = now
  frame = requestAnimationFrame(pump)
}

function resume() {
  if (frame) return
  lastTime = performance.now()
  frame = requestAnimationFrame(pump)
}

onBeforeUnmount(() => cancelAnimationFrame(frame))
</script>
