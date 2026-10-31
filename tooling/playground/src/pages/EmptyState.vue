<script setup lang="ts">
import { h } from 'vue'
import { Avatar, AvatarGroup, Button, EmptyState, TagGroup } from '@hareui/vue'
import type { ButtonProps } from '@hareui/vue'
import { Icon } from '../icons'

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const sizes = ['sm', 'md', 'lg'] as const
const variants = ['default', 'outline', 'secondary'] as const

const actions: ButtonProps[] = [
  { label: 'Create', onClick: () => console.log('create') },
  { label: 'Import', variant: 'outline' },
]
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">EmptyState</h1>
    <EmptyState />
    <EmptyState class="p-1">No team members</EmptyState>
    <div class="w-sm">
      <TagGroup selection-mode="single" label="Team Members" description="Select team members for your project" :items="[]">
        <template #empty>
          <EmptyState class="p-1">No team members</EmptyState>
        </template>
      </TagGroup>
    </div>
    <EmptyState :ui="{ base: 'text-accent' }">:ui override</EmptyState>

    <h2 class="text-lg font-semibold">Variant × size</h2>
    <div v-for="variant in variants" :key="variant" class="flex flex-wrap items-start gap-4">
      <EmptyState
        v-for="size in sizes"
        :key="size"
        class="w-[300px]"
        :variant="variant"
        :size="size"
        :icon="icon('folder')"
        :title="`${variant} / ${size}`"
        description="Create a project to start planning."
        :actions="actions"
      />
    </div>

    <h2 class="text-lg font-semibold">Parts</h2>
    <div class="flex flex-wrap items-start gap-4">
      <EmptyState class="w-[300px]" title="Title only" />
      <EmptyState class="w-[300px]" icon="i-lucide-inbox" title="Class-string icon" />
      <EmptyState class="w-[300px]" :avatar="{ fallback: 'JD' }" title="Avatar" description="Avatar media." />
      <EmptyState class="w-[300px]" title="Leading slot" description="AvatarGroup media.">
        <template #leading>
          <AvatarGroup>
            <Avatar fallback="AB" />
            <Avatar fallback="CD" />
          </AvatarGroup>
        </template>
      </EmptyState>
      <EmptyState class="w-[300px]" variant="outline">
        <template #title>Slotted <em>title</em></template>
        <template #description>Slotted description.</template>
        <template #actions><Button size="sm">Slotted action</Button></template>
      </EmptyState>
      <EmptyState
        class="w-[300px]"
        :icon="icon('envelope')"
        title=":ui override"
        :ui="{ media: 'bg-accent-soft text-accent', title: 'text-accent' }"
      />
    </div>
  </div>
</template>
