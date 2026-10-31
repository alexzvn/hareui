<template>
  <div class="flex flex-col gap-8 p-8">
    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-semibold">List: every variant</h2>
      <div class="grid max-w-[1040px] grid-cols-2 gap-6">
        <ItemCardGroup
          v-for="variant in variants"
          :key="variant"
          :variant="variant"
          :title="variant"
          description="Three cards, dividers between them"
        >
          <ItemCard v-for="n in 3" :key="n" :icon="Gear" :title="`Row ${n}`" description="Inherits the variant">
            <template #action>
              <Button size="sm" variant="outline">Open</Button>
            </template>
          </ItemCard>
        </ItemCardGroup>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-semibold">List: pressable cards, a card overriding the variant, a user Separator</h2>
      <ItemCardGroup class="max-w-[500px]" variant="secondary">
        <ItemCard href="#a" :icon="Gear" title="Link" description="Hover follows the group corners" />
        <ItemCard :icon="Gear" title="Click" description="Button" @click="() => {}" />
        <ItemCard variant="outline" :icon="Gear" title="Own variant" description="data-variant=outline" />
        <Separator />
        <ItemCard href="#b" :icon="Gear" title="After a Separator" description="No double divider" />
      </ItemCardGroup>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-semibold">Grid: 2 and 3 columns, header</h2>
      <ItemCardGroup layout="grid" class="max-w-[600px]" title="Two columns" description="Default">
        <ItemCard v-for="n in 4" :key="n" :icon="Gear" :title="`Tile ${n}`" description="Raised" />
      </ItemCardGroup>
      <ItemCardGroup layout="grid" :columns="3" variant="secondary" class="max-w-[800px]">
        <ItemCard v-for="n in 6" :key="n" :icon="Gear" :title="`Tile ${n}`" description="Secondary icon box" />
      </ItemCardGroup>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-semibold">Slots and :ui override</h2>
      <ItemCardGroup class="max-w-[500px]" :ui="{ header: 'pb-3', title: 'text-base' }">
        <template #header>
          <h3 class="text-base font-semibold">Custom header</h3>
        </template>
        <ItemCard :icon="Gear" title="Only card" />
      </ItemCardGroup>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ItemCardGroupVariant } from '@hareui/vue'
import { Button, ItemCard, ItemCardGroup, Separator } from '@hareui/vue'
import { h } from 'vue'

const variants: ItemCardGroupVariant[] = ['default', 'secondary', 'tertiary', 'outline', 'transparent']

const Gear = () =>
  h('svg', { viewBox: '0 0 16 16', fill: 'currentColor' }, [
    h('circle', { cx: 8, cy: 8, r: 6 }),
  ])
</script>
