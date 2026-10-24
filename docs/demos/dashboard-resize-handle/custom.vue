<template>
  <DashboardGroup :persistent="false">
    <DashboardPanel id="custom-left" resizable :default-size="40" :max-size="70" :min-size="20">
      <template #header>
        <DashboardNavbar title="Left" :toggle="false" />
      </template>

      <template #body>
        <div
          class="h-full min-h-24 rounded-xl border border-dashed border-separator bg-surface/50"
        />
      </template>

      <!-- The slot receives the pointer / keyboard handlers and the aria attributes of a `role="separator"`. -->
      <template #resize-handle="{ onPointerDown, onDoubleClick, onKeyDown, attrs, dragging }">
        <DashboardResizeHandle
          v-bind="attrs"
          :data-dragging="dragging"
          class="group/handle"
          @pointerdown="onPointerDown"
          @dblclick="onDoubleClick"
          @keydown="onKeyDown"
        >
          <!-- A grab pill centred on the edge. -->
          <span
            class="pointer-events-none absolute z-2 top-1/2 left-[-0.5px] h-8 w-1.5 -translate-1/2 rounded-full bg-default transition-colors duration-[120ms] group-hover/handle:bg-default-hover group-data-[dragging=true]/handle:bg-default-hover motion-reduce:transition-none rtl:left-[0.5px]"
          />
        </DashboardResizeHandle>
      </template>
    </DashboardPanel>

    <DashboardPanel id="custom-right" class="max-lg:hidden">
      <template #header>
        <DashboardNavbar title="Right" :toggle="false" />
      </template>

      <template #body>
        <div
          class="h-full min-h-24 rounded-xl border border-dashed border-separator bg-surface/50"
        />
      </template>
    </DashboardPanel>
  </DashboardGroup>
</template>

<script setup lang="ts">
import { DashboardGroup, DashboardNavbar, DashboardPanel, DashboardResizeHandle } from '@hareui/vue'
</script>
