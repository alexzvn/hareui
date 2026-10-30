<template>
  <div class="flex min-h-svh bg-background">
    <main class="flex min-w-0 flex-1 flex-col">
      <div class="flex h-16 items-center justify-between gap-3 px-4">
        <p class="text-sm font-semibold text-foreground">Order #2041</p>
        <Button
          aria-label="Toggle details"
          icon-only
          size="sm"
          variant="ghost"
          @click="isOpen = !isOpen"
        >
          <Icon icon="gravity-ui:layout-side-content-right" />
        </Button>
      </div>
      <p class="px-6 text-muted">Place the sidebar after the content to show it on the right.</p>
      <div class="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center md:hidden">
        <p class="text-sm text-muted">Below 768px the details open as a sheet.</p>
        <Button size="sm" variant="secondary" @click="isOpen = true">
          <Icon icon="gravity-ui:layout-side-content-right" />
          Open details
        </Button>
      </div>
    </main>

    <Sidebar
      v-model:open="isOpen"
      close
      description="Placed 2 days ago"
      rail
      side="right"
      title="Order details"
    >
      <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 px-1 text-sm">
        <dt class="text-muted">Customer</dt>
        <dd class="text-foreground">Ines Navarro</dd>
        <dt class="text-muted">Items</dt>
        <dd class="text-foreground">3</dd>
        <dt class="text-muted">Total</dt>
        <dd class="text-foreground">$148.00</dd>
        <dt class="text-muted">Status</dt>
        <dd><Chip color="success" size="sm" variant="soft">Paid</Chip></dd>
      </dl>
    </Sidebar>
  </div>
</template>

<script setup lang="ts">
import { Button, Chip, Sidebar } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const isOpen = ref(true)
</script>
