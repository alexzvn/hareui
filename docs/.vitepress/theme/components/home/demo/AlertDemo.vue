<script setup lang="ts">
import { Alert, Button } from 'herouse'
</script>

<template>
  <Alert
    class="w-full items-center xl:w-[400px]"
    title="You have 2 credits left"
    description="Get a paid plan for more credits"
    :ui="{ content: 'text-start', title: 'leading-5', description: 'text-xs' }"
  >
    <template #trailing>
      <Button variant="tertiary">Upgrade</Button>
    </template>
  </Alert>
</template>
