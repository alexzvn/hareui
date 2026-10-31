<template>
  <div class="flex h-full max-w-xl flex-col items-center justify-center">
    <Button size="sm" variant="secondary" @click="show"> Add to favorites </Button>
  </div>
</template>

<script setup lang="ts">
import { Button, toast } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const show = () => {
  toast('Added to favorites', { indicator: h(Icon, { icon: 'gravity-ui:star' }) })
}
</script>
