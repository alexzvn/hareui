<script setup lang="ts">
import { Kbd } from 'herouse'
</script>

<template>
  <div class="space-y-3">
    <p class="text-sm">
      Press <Kbd keys="enter" /> to confirm or <Kbd keys="escape" /> to cancel.
    </p>
    <p class="text-sm">
      Use <Kbd keys="tab" /> to navigate between form fields and <Kbd :keys="['shift', 'tab']" /> to go back.
    </p>
    <p class="text-sm">
      Hold <Kbd keys="space" /> to temporarily enable panning mode.
    </p>
  </div>
</template>
