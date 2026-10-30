<template>
  <div class="h-96 w-full overflow-hidden rounded-xl border border-border bg-background">
    <Splitter :items="items">
      <template #outline="{ collapsed, collapse, expand }">
        <div class="flex flex-1 flex-col items-center gap-2 p-2">
          <Button
            :aria-label="collapsed ? 'Expand outline' : 'Collapse outline'"
            class="self-end"
            icon-only
            size="sm"
            variant="ghost"
            @click="collapsed ? expand() : collapse()"
          >
            <Icon
              :icon="
                collapsed ? 'gravity-ui:layout-side-content-left' : 'gravity-ui:layout-side-content'
              "
            />
          </Button>
          <span v-if="!collapsed" class="text-sm font-medium">Outline</span>
        </div>
      </template>

      <template #document>Document</template>
    </Splitter>
  </div>
</template>

<script setup lang="ts">
import type { SplitterItem } from '@hareui/vue'
import { Button, Splitter } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const items: SplitterItem[] = [
  {
    slot: 'outline',
    sizeUnit: 'px',
    defaultSize: 240,
    minSize: 180,
    maxSize: 360,
    collapsible: true,
    collapsedSize: 48,
    class: 'bg-surface text-surface-foreground',
  },
  { slot: 'document', minSize: 40, class: 'items-center justify-center text-sm font-medium' },
]
</script>
