<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Avatar, Badge } from 'herouse'
</script>

<template>
  <div class="flex items-center gap-6">
    <Badge color="danger" content="5" size="sm">
      <Avatar fallback="JD" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg" />
    </Badge>

    <Badge color="danger" content="New" size="sm">
      <Avatar fallback="JD" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg" />
    </Badge>

    <Badge color="danger" content="99+" size="sm">
      <Avatar fallback="JD" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg" />
    </Badge>

    <Badge color="accent" size="sm">
      <Avatar fallback="JD" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg" />
      <template #content>
        <Icon class="size-2.5" icon="gravity-ui:bell" />
      </template>
    </Badge>
  </div>
</template>
