<template>
  <div class="flex flex-wrap gap-3">
    <Button variant="secondary" @click="toast('Draft saved')"> Default </Button>
    <Button
      variant="secondary"
      @click="
        toast('Draft saved', { closeButton: { icon: CircleXmark, label: 'Dismiss notification' } })
      "
    >
      Custom close button
    </Button>
    <Button variant="secondary" @click="toast('Draft saved', { closeButton: false })">
      Without close button
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button, toast } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const CircleXmark = () => h(Icon, { icon: 'gravity-ui:circle-xmark' })
</script>
