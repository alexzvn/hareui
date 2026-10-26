<script setup lang="ts">
import { Input, Surface } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-xl font-semibold">Surface</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Variants</h2>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-muted">Transparent</p>
          <Surface class="flex min-w-[320px] flex-col gap-3 rounded-3xl border p-6" variant="transparent">
            <h3 class="text-base font-semibold text-foreground">Surface Content</h3>
            <Input class="w-[280px]" placeholder="john@example.com" />
            <p class="text-sm text-muted">This is a transparent surface variant.</p>
          </Surface>
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-muted">Default</p>
          <Surface class="flex min-w-[320px] flex-col gap-3 rounded-3xl p-6" variant="default">
            <h3 class="text-base font-semibold text-foreground">Surface Content</h3>
            <Input class="w-[280px]" variant="secondary" placeholder="john@example.com" />
            <p class="text-sm text-muted">This is a default surface variant. It uses bg-surface styling.</p>
          </Surface>
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-muted">Secondary</p>
          <Surface class="flex min-w-[320px] flex-col gap-3 rounded-3xl p-6" variant="secondary">
            <h3 class="text-base font-semibold text-foreground">Surface Content</h3>
            <Input class="w-[280px]" placeholder="john@example.com" />
            <p class="text-sm text-muted">This is a secondary surface variant. It uses bg-surface-secondary styling.</p>
          </Surface>
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-muted">Tertiary</p>
          <Surface class="flex min-w-[320px] flex-col gap-3 rounded-3xl p-6" variant="tertiary">
            <h3 class="text-base font-semibold text-foreground">Surface Content</h3>
            <Input class="w-[280px]" placeholder="john@example.com" />
            <p class="text-sm text-muted">This is a tertiary surface variant. It uses bg-surface-tertiary styling.</p>
          </Surface>
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override</h2>
      <Surface
        class="w-full max-w-sm rounded-xl border border-accent/15 bg-linear-to-br from-accent/8 via-surface to-surface-secondary p-4"
        variant="default"
      >
        <h3 class="text-sm font-semibold text-foreground">Billing overview</h3>
        <p class="text-sm text-muted">View invoices and payment methods in one place.</p>
      </Surface>
    </section>
  </div>
</template>
