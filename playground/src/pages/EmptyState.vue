<script setup lang="ts">
import { EmptyState, TagGroup } from '@hareui/vue'
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
  </div>
</template>
