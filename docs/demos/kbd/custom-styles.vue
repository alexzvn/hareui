<script setup lang="ts">
import { Kbd } from 'herouse'
</script>

<template>
  <div class="flex items-center gap-3">
    <Kbd class="rounded-lg bg-accent-soft px-2.5 text-accent-soft-foreground" keys="command">
      K
    </Kbd>
    <Kbd class="rounded-lg bg-default px-2.5 text-muted" keys="shift">
      P
    </Kbd>
  </div>
</template>
