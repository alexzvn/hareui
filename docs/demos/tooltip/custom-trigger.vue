<script setup lang="ts">
import { Avatar, Chip, Tooltip } from 'herouse'
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="flex items-center gap-6">
    <Tooltip arrow :delay="0">
      <template #default>
        <Avatar aria-label="User avatar" size="sm" tabindex="0">
          <template #fallback>JD</template>
        </Avatar>
      </template>
      <template #content>
        <div class="flex flex-col gap-0 py-1">
          <p class="font-semibold">Jane Doe</p>
          <p class="text-xs text-muted">jane@example.com</p>
        </div>
      </template>
    </Tooltip>

    <Tooltip :delay="0">
      <template #default>
        <Chip aria-label="Status chip" color="success" tabindex="0">
          <template #leading><Icon icon="gravity-ui:circle-check-fill" width="12" /></template>
          <template #default>Active</template>
        </Chip>
      </template>
      <template #content>
        <span class="flex items-center gap-1.5">
          <span class="relative flex size-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span class="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          <p>Jane is currently online</p>
        </span>
      </template>
    </Tooltip>

    <Tooltip arrow :delay="0">
      <template #default>
        <div aria-label="Info icon" class="rounded-full bg-accent-soft p-2" tabindex="0">
          <Icon class="text-accent-soft-foreground" icon="gravity-ui:circle-question" />
        </div>
      </template>
      <template #content>
        <div class="max-w-xs px-1 py-1.5">
          <p class="mb-1 font-semibold">Help Information</p>
          <p class="text-sm text-muted">
            This is a helpful tooltip with more detailed information about this feature.
          </p>
        </div>
      </template>
    </Tooltip>
  </div>
</template>
