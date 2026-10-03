<script setup lang="ts">
import { Link } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-3">
    <Link href="#" icon>
      Icon at end (default)
    </Link>
    <Link class="gap-1" href="#" icon icon-placement="start">
      Icon at start
    </Link>
  </div>
</template>
