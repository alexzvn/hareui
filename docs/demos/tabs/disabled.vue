<script setup lang="ts">
import { Tabs } from 'herouse'

const items = [
  { label: 'Active', value: 'active', content: 'This tab is active and can be selected.' },
  { label: 'Disabled', value: 'disabled', disabled: true, content: 'This content cannot be accessed.' },
  { label: 'Available', value: 'available', content: 'This tab is also available for selection.' },
]
</script>

<template>
  <Tabs class="w-full max-w-md" :items="items" default-value="active" :ui="{ tabPanel: 'pt-4' }" />
</template>
