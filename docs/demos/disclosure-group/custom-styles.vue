<script setup lang="ts">
import { Button, Disclosure, DisclosureGroup, Separator } from 'herouse'
</script>

<template>
  <DisclosureGroup class="w-full max-w-sm rounded-xl bg-default-soft p-2">
    <Disclosure value="billing" :ui="{ bodyInner: 'text-sm text-muted' }">
      <template #trigger="{ indicator }">
        <Button class="w-full justify-between" variant="ghost">
          Billing
          <component :is="indicator" class="text-muted" />
        </Button>
      </template>
      Invoices are issued on the first of each month.
    </Disclosure>
    <Separator class="my-1" />
    <Disclosure value="support" :ui="{ bodyInner: 'text-sm text-muted' }">
      <template #trigger="{ indicator }">
        <Button class="w-full justify-between" variant="ghost">
          Support
          <component :is="indicator" class="text-muted" />
        </Button>
      </template>
      Reach us at help@heroui.com. Typical response time is under one business day.
    </Disclosure>
  </DisclosureGroup>
</template>
