<script setup lang="ts">
import { Button, Modal } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const placements = ['auto', 'top', 'center', 'bottom'] as const
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <Modal v-for="placement in placements" :key="placement" :placement="placement">
      <Button variant="secondary">
        {{ placement.charAt(0).toUpperCase() + placement.slice(1) }}
      </Button>
      <template #icon>
        <Icon class="text-foreground" icon="gravity-ui:rocket" />
      </template>
      <template #title>
        Placement: {{ placement.charAt(0).toUpperCase() + placement.slice(1) }}
      </template>
      <template #body>
        <p>
          This modal uses the <code>{{ placement }}</code> placement option. Try different
          placements to see how the modal positions itself on the screen.
        </p>
      </template>
      <template #footer="{ close }">
        <Button class="w-full" @click="close"> Continue </Button>
      </template>
    </Modal>
  </div>
</template>
