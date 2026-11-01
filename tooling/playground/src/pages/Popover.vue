<script setup lang="ts">
import { ref } from 'vue'
import { Button, Popover } from '@hareui/vue'

const open = ref(false)
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-xl font-semibold">Popover</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Default</h2>
      <Popover>
        <Button>Open popover</Button>
        <template #content>
          <p class="text-sm">This is the popover content.</p>
        </template>
      </Popover>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">With title and arrow</h2>
      <Popover title="Popover Title" arrow>
        <Button>Open with title</Button>
        <template #content>
          <p class="mt-2 text-sm text-muted">This is the popover content.</p>
        </template>
      </Popover>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Sides</h2>
      <div class="flex gap-8">
        <Popover v-for="side in (['top', 'right', 'bottom', 'left'] as const)" :key="side" :side="side" arrow>
          <Button>{{ side }}</Button>
          <template #content>
            <p class="text-sm">{{ side }} placement</p>
          </template>
        </Popover>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Controlled (open/close triggers)</h2>
      <div class="flex items-center gap-2">
        <Button @click="open = true">Open</Button>
        <Button @click="open = false">Close</Button>
        <span class="text-sm text-muted">{{ open ? 'open' : 'closed' }}</span>
      </div>
      <Popover v-model:open="open">
        <Button>Controlled trigger</Button>
        <template #content>
          <p class="text-sm">Controlled popover content.</p>
        </template>
      </Popover>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Not dismissible</h2>
      <Popover :dismissible="false" title="Confirm">
        <Button>Open non-dismissible</Button>
        <template #content="{ close }">
          <p class="mt-2 text-sm text-muted">Escape/outside click won't close this. Use the button.</p>
          <Button class="mt-3" size="sm" @click="close">Close</Button>
        </template>
      </Popover>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Hover mode (delays, enable-touch)</h2>
      <div class="flex items-center gap-4">
        <Popover mode="hover" title="Default delays">
          <Button variant="secondary">700 / 300ms</Button>
          <template #content>
            <p class="mt-2 text-sm text-muted">Hover or focus the trigger.</p>
          </template>
        </Popover>
        <Popover mode="hover" :open-delay="0" :close-delay="0" enable-touch arrow title="Instant">
          <Button variant="secondary">0 / 0ms, tap to toggle</Button>
          <template #content>
            <p class="mt-2 text-sm text-muted">Move the pointer in here: it stays open.</p>
          </template>
        </Popover>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override</h2>
      <Popover :ui="{ base: 'bg-primary text-white' }">
        <Button>Open styled</Button>
        <template #content>
          <p class="text-sm">Custom styled popover.</p>
        </template>
      </Popover>
    </section>
  </div>
</template>
