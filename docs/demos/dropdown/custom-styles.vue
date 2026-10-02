<script setup lang="ts">
import type { DropdownEntry } from 'herouse'
import { Button, Dropdown } from 'herouse'

const items: DropdownEntry[] = [
  { value: 'rename', label: 'Rename', class: 'rounded-lg data-[focused=true]:bg-default' },
  { value: 'duplicate', label: 'Duplicate', class: 'rounded-lg data-[focused=true]:bg-default' },
  { value: 'delete', label: 'Delete', variant: 'danger', class: 'rounded-lg data-[focused=true]:bg-danger-soft' },
]
</script>

<template>
  <Dropdown class="rounded-xl border border-border/80 bg-surface p-1 shadow-sm" :items="items">
    <Button variant="secondary">
      Actions
    </Button>
  </Dropdown>
</template>
