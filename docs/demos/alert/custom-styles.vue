<script setup lang="ts">
import { Alert, Button, CloseButton } from '@hareui/vue'
</script>

<template>
  <div class="w-full max-w-xl">
    <Alert
      class="relative overflow-hidden rounded-xl border border-warning/20 bg-linear-to-br from-warning/10 via-surface to-surface-secondary shadow-sm dark:border-warning/30 dark:from-warning/15 dark:via-surface dark:to-warning/5"
      status="warning"
      title="Payment method expires soon"
      description="Your Visa ending in 4242 expires on March 28. Update billing to avoid interrupting your Pro subscription."
      :ui="{ indicator: 'relative text-warning', content: 'relative' }"
    >
      <template #leading>
        <div
          aria-hidden="true"
          class="pointer-events-none absolute -top-8 -right-8 size-28 rounded-full bg-warning/15 blur-2xl dark:bg-warning/25"
        />
      </template>
      <Button class="mt-3 sm:hidden" size="sm" variant="tertiary">
        Update billing
      </Button>
      <template #trailing>
        <Button class="relative hidden shrink-0 sm:inline-flex" size="sm" variant="tertiary">
          Update billing
        </Button>
        <CloseButton class="relative" />
      </template>
    </Alert>
  </div>
</template>
