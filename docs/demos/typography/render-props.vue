<script setup lang="ts">
import { Typography } from '@hareui/vue'
</script>

<template>
  <div class="flex max-w-xl flex-col gap-4">
    <Typography as="h2" type="h1"> H1 visual style, h2 semantic element </Typography>
    <Typography as="span">
      The render prop can swap the underlying element while preserving HeroUI props and styles.
    </Typography>
  </div>
</template>
