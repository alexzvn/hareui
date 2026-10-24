<script setup lang="ts">
import { Avatar, Badge } from '@hareui/vue'
</script>

<template>
  <Badge
    class="min-w-5 font-semibold tabular-nums"
    color="accent"
    content="5"
    size="sm"
    variant="soft"
  >
    <Avatar
      alt="Kate Wilson"
      fallback="KW"
      src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
    />
  </Badge>
</template>
