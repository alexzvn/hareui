<template>
  <div class="flex items-center gap-6">
    <Badge color="danger" content="5" size="sm">
      <Avatar
        alt="John Doe"
        fallback="JD"
        src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg"
      />
    </Badge>

    <Badge color="accent" content="New" size="sm">
      <Avatar
        alt="Alex Brown"
        fallback="AB"
        src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg"
      />
    </Badge>

    <Badge color="success" placement="bottom-right" size="sm">
      <Avatar
        alt="Chris Davis"
        fallback="CD"
        src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
      />
    </Badge>
  </div>
</template>

<script setup lang="ts">
import { Avatar, Badge } from '@hareui/vue'
</script>
