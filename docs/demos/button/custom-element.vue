<template>
  <Button as="label" variant="secondary">
    <Icon icon="gravity-ui:paperclip" />
    {{ fileName || 'Attach a file' }}
    <input type="file" hidden @change="onChange" />
  </Button>
</template>

<script setup lang="ts">
import { Button } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const fileName = ref('')

const onChange = (event: Event) => {
  fileName.value = (event.target as HTMLInputElement).files?.[0]?.name ?? ''
}
</script>
