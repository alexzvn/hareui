<script setup lang="ts">
import { Avatar, Badge } from '@hareui/vue'
</script>

<template>
  <div class="flex items-center gap-6">
    <Badge color="danger" content="5" size="sm">
      <Avatar fallback="JD" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg" />
    </Badge>

    <Badge color="accent" content="New" size="sm">
      <Avatar fallback="AB" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg" />
    </Badge>

    <Badge color="success" placement="bottom-right" size="sm">
      <Avatar fallback="CD" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg" />
    </Badge>
  </div>
</template>
