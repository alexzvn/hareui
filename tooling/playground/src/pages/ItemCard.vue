<template>
  <div class="flex flex-col gap-8 p-8">
    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-semibold">Variants</h2>
      <div class="flex max-w-[500px] flex-col gap-3">
        <ItemCard
          v-for="variant in variants"
          :key="variant"
          :variant="variant"
          :icon="Gear"
          :title="variant"
          description="Icon, title, description and action"
        >
          <template #action>
            <Button size="sm" variant="outline">Open</Button>
          </template>
        </ItemCard>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-semibold">States: link, click, disabled link, disabled click</h2>
      <div class="flex max-w-[500px] flex-col gap-3">
        <ItemCard href="#link" :icon="Gear" title="Link" description="href, hover and press highlight" />
        <ItemCard :icon="Gear" title="Click" :description="`Clicked ${clicks} times`" @click="clicks++" />
        <ItemCard href="#link" disabled :icon="Gear" title="Disabled link" description="aria-disabled" />
        <ItemCard disabled :icon="Gear" title="Disabled button" @click="clicks++" />
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-semibold">Truncation, title only, no icon, icon class string</h2>
      <div class="flex max-w-[360px] flex-col gap-3">
        <ItemCard
          :icon="Gear"
          title="A very long title that does not fit on a single line of the card"
          description="And an equally long description that ends with an ellipsis as well"
        >
          <template #action>
            <Switch aria-label="Long" />
          </template>
        </ItemCard>
        <ItemCard :icon="Gear" title="Title only" />
        <ItemCard title="No icon" description="Text starts at the edge" />
        <ItemCard icon="size-4 rounded-full bg-accent" title="Icon class string" />
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-semibold">Slots and :ui override</h2>
      <div class="flex max-w-[500px] flex-col gap-3">
        <ItemCard :ui="{ icon: 'size-10 rounded-full bg-accent-soft text-lg', title: 'text-accent' }">
          <template #icon>🌿</template>
          <template #title>Custom title</template>
          <template #description>Custom description</template>
          <template #action>
            <span class="text-sm font-semibold">€12.00</span>
          </template>
          <progress class="mt-2 w-full" value="40" max="100" />
        </ItemCard>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ItemCardProps } from '@hareui/vue'
import { Button, ItemCard, Switch } from '@hareui/vue'
import { h, ref } from 'vue'

const variants: NonNullable<ItemCardProps['variant']>[] = [
  'default',
  'secondary',
  'tertiary',
  'outline',
  'transparent',
]

const Gear = () =>
  h('svg', { viewBox: '0 0 16 16', fill: 'currentColor' }, [
    h('circle', { cx: 8, cy: 8, r: 6 }),
  ])

const clicks = ref(0)
</script>
