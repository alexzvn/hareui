<script setup lang="ts">
import { ref } from 'vue'
import { Button } from 'herouse'
import { Icon } from '@iconify/vue'

const isPending = ref(false)

function onClick() {
  isPending.value = true
  setTimeout(() => (isPending.value = false), 2000)
}
</script>

<template>
  <Button :pending="isPending" @click="onClick">
    <template v-if="!isPending" #leading>
      <Icon icon="gravity-ui:paperclip" />
    </template>
    {{ isPending ? 'Uploading...' : 'Upload File' }}
  </Button>
</template>
