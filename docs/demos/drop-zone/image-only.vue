<script setup lang="ts">
import { DropZone } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const dishPhoto = ref<File[]>([])
</script>

<template>
  <DropZone
    v-model="dishPhoto"
    class="w-full max-w-[420px]"
    label="Add a photo of your dish"
    description="Any image: JPG, PNG, WebP, HEIC and more."
    trigger-label="Choose photo"
    accept="image/*"
  >
    <template #icon>
      <Icon icon="gravity-ui:picture" />
    </template>
  </DropZone>
</template>
