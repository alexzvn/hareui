<script setup lang="ts">
import { Avatar, Chip, Tooltip } from 'herouse'
import { Icon } from '@iconify/vue'

// Equivalent of HeroUI's `Tooltip.Trigger`: a focusable inline-block wrapper around non-button content.
const triggerClass = 'inline-block outline-none focus-visible:status-focused'
</script>

<template>
  <div class="flex items-center gap-6">
    <Tooltip arrow :delay="0">
      <template #default>
        <div aria-label="User avatar" :class="triggerClass" role="button" tabindex="0">
          <Avatar alt="Jane Doe" fallback="JD" size="sm" src="https://img.heroui.chat/image/avatar?w=400&h=400&u=4" />
        </div>
      </template>
      <template #content>
        <div class="flex flex-col gap-0 py-1">
          <p class="font-semibold">Jane Doe</p>
          <p class="text-xs text-muted">jane@example.com</p>
        </div>
      </template>
    </Tooltip>

    <Tooltip class="flex items-center gap-1.5" :delay="0">
      <template #default>
        <div aria-label="Status chip" :class="triggerClass" role="button" tabindex="0">
          <Chip color="success">
            <template #leading>
              <!-- @gravity-ui/icons with only `width` keeps its default height="16" -->
              <Icon height="16" icon="gravity-ui:circle-check-fill" width="12" />
            </template>
            <template #default>Active</template>
          </Chip>
        </div>
      </template>
      <template #content>
        <span class="relative flex size-2">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span class="relative inline-flex size-2 rounded-full bg-success" />
        </span>
        <p>Jane is currently online</p>
      </template>
    </Tooltip>

    <Tooltip arrow :delay="0">
      <template #default>
        <div aria-label="Info icon" :class="triggerClass" role="button" tabindex="0">
          <div class="rounded-full bg-accent-soft p-2">
            <Icon class="text-accent-soft-foreground" icon="gravity-ui:circle-question" />
          </div>
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
