<template>
  <div class="flex flex-wrap gap-4">
    <Drawer
      v-for="placement in placements"
      :key="placement"
      :handle="placement === 'bottom' || placement === 'top'"
      :placement="placement"
      :title="`${capitalize(placement)} Drawer`"
    >
      <Button variant="secondary">
        {{ capitalize(placement) }}
      </Button>
      <template #body>
        <p>
          This drawer slides in from the <strong>{{ placement }}</strong> edge of the screen.
        </p>
      </template>
      <template #footer="{ close }">
        <Button variant="secondary" @click="close"> Cancel </Button>
        <Button @click="close"> Done </Button>
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { Button, Drawer } from '@hareui/vue'

const placements = ['bottom', 'top', 'left', 'right'] as const
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
</script>
