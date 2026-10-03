<script setup lang="ts">
import { Kbd } from '@hareui/vue'
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm">
      Press <Kbd>Esc</Kbd> to close the dialog.
    </p>
    <p class="text-sm">
      Use <Kbd keys="command">K</Kbd> to open the command palette.
    </p>
    <p class="text-sm">
      Navigate with <Kbd keys="up" /> and <Kbd keys="down" /> arrow keys.
    </p>
    <p class="text-sm">
      Save your work with <Kbd keys="command">S</Kbd> regularly.
    </p>
  </div>
</template>
