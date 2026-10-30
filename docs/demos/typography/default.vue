<template>
  <div class="flex max-w-xl flex-col gap-4">
    <Typography type="h1">Build better interfaces</Typography>
    <Typography type="h2">Typography that stays semantic</Typography>
    <Typography type="h3">Composable by default</Typography>
    <Typography type="h4">Small heading</Typography>
    <Typography>
      HareUI Typography renders semantic text elements, with typography types and an `as` prop for
      polymorphism.
    </Typography>
    <Typography color="muted" type="body-sm">
      Smaller muted body copy for secondary descriptions.
    </Typography>
    <Typography type="code">bun add @hareui/vue</Typography>
  </div>
</template>

<script setup lang="ts">
import { Typography } from '@hareui/vue'
</script>
