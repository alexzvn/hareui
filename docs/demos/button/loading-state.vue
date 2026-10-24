<template>
  <Button :pending="isPending" @click="onClick">
    <template v-if="!isPending" #leading>
      <Icon icon="gravity-ui:paperclip" />
    </template>
    {{ isPending ? 'Uploading...' : 'Upload File' }}
  </Button>
</template>

<script setup lang="ts">
import { Button } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const isPending = ref(false)

function onClick() {
  isPending.value = true
  setTimeout(() => (isPending.value = false), 2000)
}
</script>
