<script setup lang="ts">
import { ColorSwatch } from 'herouse'

const colors = ['#0485F7', '#EF4444', '#F59E0B', '#10B981', '#D946EF']
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
</script>

<template>
  <div class="flex flex-col gap-10 p-8">
    <h1 class="text-2xl font-semibold">ColorSwatch</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Basic</h2>
      <div class="flex items-center gap-3">
        <ColorSwatch v-for="color in colors" :key="color" :color="color" :aria-label="color" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Sizes</h2>
      <div class="flex items-center gap-3">
        <ColorSwatch v-for="size in sizes" :key="size" color="#0485F7" :size="size" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Shapes</h2>
      <div class="flex items-center gap-3">
        <ColorSwatch color="#0485F7" shape="circle" />
        <ColorSwatch color="#0485F7" shape="square" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Transparency</h2>
      <div class="flex items-center gap-3">
        <ColorSwatch aria-label="100% opacity" color="rgba(4, 133, 247, 1)" />
        <ColorSwatch aria-label="75% opacity" color="rgba(4, 133, 247, 0.75)" />
        <ColorSwatch aria-label="50% opacity" color="rgba(4, 133, 247, 0.5)" />
        <ColorSwatch aria-label="25% opacity" color="rgba(4, 133, 247, 0.25)" />
        <ColorSwatch aria-label="0% opacity" color="rgba(4, 133, 247, 0)" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Accessibility (colorName)</h2>
      <div class="flex items-center gap-3">
        <ColorSwatch aria-label="Primary brand color" color="#0485F7" color-name="Ocean Blue" />
        <ColorSwatch aria-label="Error state color" color="#EF4444" color-name="Coral Red" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Render Function (default slot)</h2>
      <div class="flex items-center gap-3">
        <ColorSwatch v-for="color in colors" :key="`custom-${color}`" :color="color">
          <template #default="{ color: c }">
            <div :style="{ boxShadow: `0 0 20px 2px ${c}` }" class="size-full" />
          </template>
        </ColorSwatch>
      </div>
    </section>
  </div>
</template>
