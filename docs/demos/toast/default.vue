<template>
  <div class="flex h-full max-w-xl flex-col items-center justify-center">
    <Button size="sm" variant="secondary" @click="show"> Show toast </Button>
  </div>
</template>

<script setup lang="ts">
import { Button, toast } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

function show() {
  const id = toast('You have been invited to join a team', {
    description: 'Bob sent you an invitation to join HeroUI team',
    indicator: h(Icon, { icon: 'gravity-ui:persons' }),
    variant: 'default',
    action: {
      label: 'Dismiss',
      variant: 'tertiary',
      onClick: () => toast.close(id),
    },
  })
}
</script>
