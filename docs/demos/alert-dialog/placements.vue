<template>
  <div class="flex flex-wrap gap-4">
    <AlertDialog
      v-for="placement in placements"
      :key="placement"
      class="sm:max-w-[400px]"
      :placement="placement"
      status="accent"
      :title="placement === 'auto' ? 'Auto Placement' : `${capitalize(placement)} Position`"
    >
      <Button variant="secondary">
        {{ capitalize(placement) }}
      </Button>
      <template #body>
        <p>
          {{
            placement === 'auto'
              ? 'Automatically positions at the bottom on mobile and center on desktop for optimal user experience.'
              : `This dialog is positioned at the ${placement} of the viewport. Critical confirmations are typically centered for maximum attention.`
          }}
        </p>
      </template>
      <template #footer="{ close }">
        <Button variant="tertiary" @click="close"> Cancel </Button>
        <Button @click="close"> Confirm </Button>
      </template>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import { AlertDialog, Button } from '@hareui/vue'

const placements = ['auto', 'top', 'center', 'bottom'] as const
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
</script>
