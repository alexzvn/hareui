<script setup lang="ts">
import { Button, Chip, Tooltip } from '@hareui/vue'
import { Icon } from '../icons'

const sides = ['top', 'right', 'bottom', 'left'] as const
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-xl font-semibold">Tooltip</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Basic</h2>
      <div class="flex flex-wrap items-center gap-6 py-10">
        <Tooltip text="This is a tooltip">
          <Button variant="secondary">Hover me</Button>
        </Tooltip>
        <Tooltip text="More information">
          <Button icon-only aria-label="More information" variant="tertiary">
            <Icon icon="gravity-ui:circle-info" width="18" />
          </Button>
        </Tooltip>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Close delay / focus trigger</h2>
      <div class="flex flex-wrap items-center gap-6 py-10">
        <Tooltip :delay="0" :close-delay="1000" text="Stays 1s after leaving">
          <Button variant="secondary">closeDelay 1000</Button>
        </Tooltip>
        <Tooltip :delay="0" :close-delay="0" text="Closes immediately">
          <Button variant="secondary">closeDelay 0</Button>
        </Tooltip>
        <Tooltip :delay="0" trigger="focus" text="Only on focus">
          <Button id="pg-focus-only" variant="secondary">trigger focus</Button>
        </Tooltip>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Sides (with arrow)</h2>
      <div class="grid grid-cols-3 gap-6 py-10">
        <div />
        <Tooltip side="top" arrow text="Top placement">
          <Button class="w-full" variant="tertiary">Top</Button>
        </Tooltip>
        <div />

        <Tooltip side="left" arrow text="Left placement">
          <Button class="w-full" variant="tertiary">Left</Button>
        </Tooltip>
        <div class="flex items-center justify-center text-sm text-muted">Hover buttons</div>
        <Tooltip side="right" arrow text="Right placement">
          <Button class="w-full" variant="tertiary">Right</Button>
        </Tooltip>

        <div />
        <Tooltip side="bottom" arrow text="Bottom placement">
          <Button class="w-full" variant="tertiary">Bottom</Button>
        </Tooltip>
        <div />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">All sides</h2>
      <div class="flex flex-wrap items-center gap-6 py-10">
        <Tooltip v-for="side in sides" :key="side" :side="side" :text="`${side} tooltip`">
          <Button variant="secondary">{{ side }}</Button>
        </Tooltip>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Custom triggers</h2>
      <div class="flex flex-wrap items-center gap-6 py-10">
        <Tooltip arrow text="Jane is currently online">
          <Chip color="success">
            <template #leading><Icon icon="gravity-ui:circle-check-fill" width="12" /></template>
            <template #default>Active</template>
          </Chip>
        </Tooltip>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Delay / disabled / no portal</h2>
      <div class="flex flex-wrap items-center gap-6 py-10">
        <Tooltip :delay="0" text="Opens instantly">
          <Button variant="secondary">No delay</Button>
        </Tooltip>
        <Tooltip disabled text="You should not see this">
          <Button variant="secondary">Disabled tooltip</Button>
        </Tooltip>
        <Tooltip :portal="false" text="Rendered inline, not teleported">
          <Button variant="secondary">No portal</Button>
        </Tooltip>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Content slot</h2>
      <div class="flex flex-wrap items-center gap-6 py-10">
        <Tooltip arrow>
          <template #default>
            <Button variant="secondary">Rich content</Button>
          </template>
          <template #content>
            <div class="flex flex-col gap-0 py-1">
              <p class="font-semibold">Jane Doe</p>
              <p class="text-xs text-muted">jane@example.com</p>
            </div>
          </template>
        </Tooltip>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Keyboard shortcuts (kbds, shown from lg)</h2>
      <div class="flex flex-wrap items-center gap-6 py-10">
        <Tooltip :delay="0" text="Search" :kbds="[{ keys: 'command' }, 'K']">
          <Button variant="secondary">Text + kbds</Button>
        </Tooltip>
        <Tooltip :delay="0" :kbds="['ctrl', 'shift', 'P']">
          <Button variant="secondary">kbds only</Button>
        </Tooltip>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override</h2>
      <div class="flex flex-wrap items-center gap-6 py-10">
        <Tooltip text="Custom styled tooltip" :ui="{ base: 'bg-accent text-accent-foreground' }">
          <Button variant="secondary">Styled</Button>
        </Tooltip>
      </div>
    </section>
  </div>
</template>
