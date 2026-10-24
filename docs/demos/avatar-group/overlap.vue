<script setup lang="ts">
import { Avatar, AvatarGroup } from '@hareui/vue'

const overlaps = ['clip', 'ring'] as const
</script>

<template>
  <div class="flex flex-col items-start gap-6">
    <div v-for="overlap in overlaps" :key="overlap" class="flex flex-col gap-2">
      <p class="text-sm text-muted">{{ overlap }}</p>
      <div class="relative inline-flex rounded-xl p-6">
        <div
          aria-hidden="true"
          class="ag-stripes pointer-events-none absolute inset-0 rounded-xl"
        />
        <div class="relative z-10">
          <AvatarGroup :overlap="overlap" size="lg">
            <Avatar
              alt="John"
              fallback="JD"
              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
            />
            <Avatar fallback="AB" />
            <Avatar
              alt="Emily"
              fallback="EC"
              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg"
            />
            <Avatar fallback="SM" />
            <template #count>+2</template>
          </AvatarGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes ag-stripes {
  to {
    background-position: 24px 24px;
  }
}
.ag-stripes {
  background-color: color-mix(in oklab, var(--danger) 6%, var(--surface));
  background-image: repeating-linear-gradient(
    -45deg,
    transparent 0 10px,
    color-mix(in oklab, var(--danger) 12%, transparent) 10px 11px,
    transparent 11px 21px,
    color-mix(in oklab, var(--danger) 28%, transparent) 21px 22px
  );
  background-size: 24px 24px;
  animation: ag-stripes 2.8s linear infinite;
}
</style>
