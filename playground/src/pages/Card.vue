<script setup lang="ts">
import { Button, Card } from '@hareui/vue'

const variants = ['default', 'secondary', 'tertiary', 'transparent'] as const
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-xl font-semibold">Card</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Variants</h2>
      <div class="flex flex-col gap-4">
        <Card
          v-for="variant in variants"
          :key="variant"
          class="w-[320px]"
          :description="`${variant} variant`"
          :title="variant"
          :variant="variant"
        >
          <p>Card content for the {{ variant }} variant.</p>
        </Card>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Title/description props</h2>
      <Card class="w-[360px]" description="Visit the Acme Creator Hub to sign up today." title="Become an Acme Creator!">
        <template #footer>
          <a class="text-sm font-medium text-accent" href="#">Creator Hub →</a>
        </template>
      </Card>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Slots (header / content / footer)</h2>
      <Card class="w-[360px]">
        <template #header>
          <span class="w-fit rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent">Recommended</span>
          <h3 class="mt-2 text-sm font-medium">Upgrade to Pro</h3>
        </template>
        <p class="text-sm text-muted">Unlock team workflows and insights built for growing products.</p>
        <template #footer>
          <div class="flex w-full flex-col gap-2 sm:flex-row">
            <Button class="w-full">Upgrade now</Button>
            <Button class="w-full" variant="secondary">Compare plans</Button>
          </div>
        </template>
      </Card>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">No header (content only)</h2>
      <Card class="w-[320px]">
        <p>Just body content, no header rendered.</p>
      </Card>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override</h2>
      <Card
        class="w-[320px]"
        description="Custom border + shadow via :ui"
        title="Styled card"
        :ui="{ base: 'border border-accent/30 shadow-lg shadow-accent/10' }"
      />
    </section>
  </div>
</template>
