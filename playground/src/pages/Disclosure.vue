<script setup lang="ts">
import { Button, Disclosure } from 'herouse'
import { ref } from 'vue'
import { Icon } from '../icons'

const controlledOpen = ref(false)
</script>

<template>
  <div class="flex flex-col gap-10 p-8">
    <h1 class="text-2xl font-semibold">Disclosure</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Default (collapsed)</h2>
      <Disclosure title="Toggle content" class="w-full max-w-md">
        <p class="text-sm text-muted">This panel starts collapsed and expands on click.</p>
      </Disclosure>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">defaultOpen</h2>
      <Disclosure title="Toggle content" default-open class="w-full max-w-md">
        <p class="text-sm text-muted">This panel starts expanded.</p>
      </Disclosure>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">disabled</h2>
      <Disclosure title="Toggle content" disabled class="w-full max-w-md">
        <p class="text-sm text-muted">Clicking the trigger has no effect.</p>
      </Disclosure>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">v-model:open (controlled)</h2>
      <div class="flex flex-wrap items-center gap-4">
        <p class="text-xs text-muted">
          Status: <span class="font-mono font-medium text-foreground">{{ controlledOpen ? 'open' : 'closed' }}</span>
        </p>
        <Button size="sm" variant="secondary" @click="controlledOpen = !controlledOpen">
          Toggle from outside
        </Button>
      </div>
      <Disclosure v-model:open="controlledOpen" title="Controlled disclosure" class="mt-3 w-full max-w-md">
        <p class="text-sm text-muted">Controlled purely via <code>v-model:open</code>.</p>
      </Disclosure>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">#trigger slot (free composition with Button)</h2>
      <Disclosure default-open class="w-full max-w-md text-center">
        <template #trigger="{ open }">
          <Button variant="secondary">
            <Icon icon="gravity-ui:qr-code" />
            Preview HeroUI Native
            <Icon
              class="ms-auto size-4 shrink-0 transition duration-250 motion-reduce:transition-none"
              :class="open ? '-rotate-180' : ''"
              icon="gravity-ui:chevron-down"
            />
          </Button>
        </template>
        <div class="flex flex-col items-center gap-2 rounded-3xl bg-surface p-4 text-center shadow-surface">
          <p class="text-sm text-muted">Scan this QR code with your camera app to preview the HeroUI native components.</p>
          <div class="aspect-square w-full max-w-54 rounded-xl bg-surface-secondary" />
          <p class="text-sm text-muted">Expo must be installed on your device.</p>
          <Button class="mt-2">
            <Icon icon="tabler:brand-apple-filled" />
            Download on App Store
          </Button>
        </div>
      </Disclosure>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">#indicator slot (custom icon in the default trigger)</h2>
      <Disclosure title="Product details" class="w-full max-w-md">
        <template #indicator="{ open }">
          <Icon class="ms-auto size-4 shrink-0 text-muted" :icon="open ? 'gravity-ui:chevron-up' : 'gravity-ui:chevron-down'" />
        </template>
        <p class="text-sm text-muted">Material: 100% Cotton · Size: Medium · Color: Navy Blue</p>
      </Disclosure>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override</h2>
      <Disclosure
        title="Shipping details"
        class="w-full max-w-sm"
        :ui="{
          trigger: 'w-full flex items-center justify-between rounded-xl border border-border px-4 py-3 font-medium',
          bodyInner: 'mt-2 rounded-xl border border-border bg-surface/50 p-4 text-sm leading-relaxed text-muted',
        }"
      >
        <template #indicator="{ open }">
          <Icon class="ms-auto size-4 shrink-0 text-muted transition duration-250" :class="open ? '-rotate-180' : ''" icon="gravity-ui:chevron-down" />
        </template>
        Orders ship within 2 business days. Standard delivery takes 3–5 days; express is available at checkout.
      </Disclosure>
    </section>
  </div>
</template>
