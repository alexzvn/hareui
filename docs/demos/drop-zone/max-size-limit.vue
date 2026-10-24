<template>
  <DropZone
    v-model="attachments"
    class="w-full max-w-[420px]"
    label="Attach screenshots or logs to your ticket"
    description="Each file can be up to 3 MB."
    trigger-label="Add attachments"
    :max-size="3 * 1024 * 1024"
    multiple
    @add="error = ''"
    @reject="onReject"
  >
    <template #files="{ removeFile }">
      <p v-if="error" class="m-0 text-xs text-danger">
        {{ error }}
      </p>
      <DropZoneFileList>
        <DropZoneFileItem
          v-for="file in attachments"
          :key="`${file.name}-${file.lastModified}`"
          :file="file"
          status="complete"
          @remove="removeFile(file)"
        />
      </DropZoneFileList>
    </template>
  </DropZone>
</template>

<script setup lang="ts">
import type { DropZoneRejection } from '@hareui/vue'
import { DropZone, DropZoneFileItem, DropZoneFileList } from '@hareui/vue'
import { ref } from 'vue'

const attachments = ref<File[]>([])
const error = ref('')

const onReject = (rejections: DropZoneRejection[]) => {
  const names = rejections.map(({ file }) => file.name).join(', ')
  error.value =
    rejections.length === 1
      ? `${names} is larger than 3 MB and wasn't attached.`
      : `${names} are larger than 3 MB and weren't attached.`
}
</script>
