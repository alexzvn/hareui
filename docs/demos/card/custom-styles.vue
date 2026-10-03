<script setup lang="ts">
import { Button, Card } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const PRO_FEATURES = [
  'Unlimited projects and collaborators',
  'Priority support with 24h response',
  'Advanced analytics and exports',
]
</script>

<template>
  <Card
    class="relative w-full max-w-md overflow-hidden border border-accent/20 bg-linear-to-br from-accent/12 via-surface to-surface-secondary shadow-lg shadow-accent/10 dark:border-accent/30 dark:from-accent/20 dark:via-surface dark:to-accent/8 dark:shadow-accent/5"
    :ui="{ header: 'relative gap-3', content: 'relative', footer: 'relative flex-col gap-2 sm:flex-row' }"
  >
    <template #leading>
      <div
        aria-hidden="true"
        class="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full bg-accent/20 blur-3xl dark:bg-accent/30"
      />
      <div
        aria-hidden="true"
        class="pointer-events-none absolute -bottom-8 -left-8 size-28 rounded-full bg-accent/10 blur-2xl dark:bg-accent/20"
      />
    </template>

    <template #header>
      <span class="w-fit rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium tracking-wide text-accent dark:bg-accent/25 dark:text-accent-soft-foreground">
        Recommended
      </span>
      <div class="flex items-start gap-3">
        <div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent dark:bg-accent/20 dark:text-accent-soft-foreground">
          <Icon aria-hidden="true" class="size-5" icon="gravity-ui:star" />
        </div>
        <div class="flex flex-col gap-1">
          <h3 class="text-sm leading-6 font-medium text-foreground">Upgrade to Pro</h3>
          <p class="text-sm leading-5 text-muted">Unlock team workflows and insights built for growing products.</p>
        </div>
      </div>
    </template>

    <ul class="flex flex-col gap-2">
      <li v-for="feature in PRO_FEATURES" :key="feature" class="flex items-center gap-2 text-sm text-muted">
        <Icon aria-hidden="true" class="size-4 shrink-0 text-accent" icon="gravity-ui:check" />
        {{ feature }}
      </li>
    </ul>

    <template #footer>
      <Button class="w-full shadow-md shadow-accent/20">Upgrade now</Button>
      <Button class="w-full" variant="secondary">Compare plans</Button>
    </template>
  </Card>
</template>
