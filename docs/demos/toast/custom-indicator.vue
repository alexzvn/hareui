<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Button, toast } from '@hareui/vue'
import { h } from 'vue'

function show() {
  toast('Custom icon indicator', { indicator: h(Icon, { icon: 'gravity-ui:star' }) })
}
</script>

<template>
  <div class="flex h-full max-w-xl flex-col items-center justify-center">
    <Button size="sm" variant="secondary" @click="show">
      Custom indicator
    </Button>
  </div>
</template>
