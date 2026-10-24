<script setup lang="ts">
import { Avatar, Badge, Separator } from '@hareui/vue'

const variants = ['primary', 'secondary', 'soft'] as const
const colors = ['accent', 'default', 'success', 'warning', 'danger'] as const
const avatarSrc = 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg'
</script>

<template>
  <div class="flex flex-col gap-8">
    <template v-for="(variant, index) in variants" :key="variant">
      <div class="flex flex-col gap-4">
        <h3 class="text-sm font-semibold text-muted capitalize">
          {{ variant }}
        </h3>
        <div class="flex items-center gap-6">
          <Badge v-for="color in colors" :key="color" :color="color" content="5" size="sm" :variant="variant">
            <Avatar alt="John Doe" fallback="JD" :src="avatarSrc" />
          </Badge>
        </div>
      </div>
      <Separator v-if="index < variants.length - 1" />
    </template>
  </div>
</template>
