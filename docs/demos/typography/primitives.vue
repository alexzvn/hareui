<template>
  <div class="flex max-w-xl flex-col gap-4">
    <Typography type="h1"> Dashboard </Typography>
    <Typography>
      Convenience primitives are thin wrappers over Typography, so you can choose explicit
      composition without learning a second styling system.
    </Typography>
    <Typography color="muted" type="body-sm">
      Paragraph supports base, sm, and xs sizes.
    </Typography>
    <Typography type="code"> Typography.Code </Typography>
  </div>
</template>

<script setup lang="ts">
import { Typography } from '@hareui/vue'
</script>
