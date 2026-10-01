<script setup lang="ts">
import { Avatar } from 'herouse'
import { Icon } from '../icons'

const colors = ['default', 'accent', 'success', 'warning', 'danger'] as const
const sizes = ['sm', 'md', 'lg'] as const
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-xl font-semibold">Avatar</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Basic</h2>
      <div class="flex items-center gap-4">
        <Avatar alt="John Doe" fallback="JD" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg" />
        <Avatar fallback="JR" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Sizes</h2>
      <div class="flex items-center gap-4">
        <Avatar v-for="size in sizes" :key="size" :fallback="size.toUpperCase()" :size="size" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Colors</h2>
      <div class="flex items-center gap-4">
        <Avatar v-for="color in colors" :key="color" :color="color" :fallback="color.slice(0, 2).toUpperCase()" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Variant (soft)</h2>
      <div class="flex items-center gap-4">
        <Avatar v-for="color in colors" :key="color" :color="color" :fallback="color.slice(0, 2).toUpperCase()" variant="soft" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Fallback slot (icon) + delay</h2>
      <div class="flex items-center gap-4">
        <Avatar>
          <template #fallback><Icon icon="gravity-ui:person" /></template>
        </Avatar>
        <Avatar :delay-ms="600" fallback="NA" src="https://invalid-url-to-show-fallback.com/image.jpg" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override</h2>
      <Avatar fallback="JD" :ui="{ base: 'rounded-lg', fallback: 'rounded-lg' }" />
    </section>
  </div>
</template>
