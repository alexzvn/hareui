<script setup lang="ts">
import { Alert, Button, CloseButton, Spinner } from '@hareui/vue'

const statuses = ['default', 'accent', 'success', 'warning', 'danger'] as const
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-xl font-semibold">Alert</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Statuses</h2>
      <div class="flex max-w-xl flex-col gap-4">
        <Alert
          v-for="status in statuses"
          :key="status"
          :status="status"
          :title="`${status} status`"
          description="Check out our latest updates including dark mode support and improved accessibility features."
        />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Slots</h2>
      <div class="flex max-w-xl flex-col gap-4">
        <Alert status="success" title="Profile updated successfully">
          <template #trailing>
            <CloseButton />
          </template>
        </Alert>
        <Alert status="accent" title="Processing your request" description="Please wait while we sync your data.">
          <template #indicator>
            <Spinner size="sm" />
          </template>
        </Alert>
        <Alert status="danger" title="Unable to connect to server" description="We're experiencing connection issues.">
          <Button class="mt-2" size="sm" variant="danger">
            Retry
          </Button>
          <template #trailing>
            <Button size="sm" variant="danger">
              Retry
            </Button>
          </template>
        </Alert>
        <Alert :indicator="false" title="Without indicator" description="indicator set to false." />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override</h2>
      <Alert
        class="max-w-xl rounded-xl border border-warning/20 shadow-sm"
        status="warning"
        title="Payment method expires soon"
        description="Your Visa ending in 4242 expires on March 28."
        :ui="{ indicator: 'text-warning', title: 'text-base' }"
      />
    </section>
  </div>
</template>
