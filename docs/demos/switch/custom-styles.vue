<script setup lang="ts">
import { Description, Switch } from '@hareui/vue'
</script>

<template>
  <Switch
    id="autosave"
    :ui="{
      control:
        '[--switch-control-bg-checked-hover:var(--success)] [--switch-control-bg-checked:var(--success)]',
    }"
  >
    <template #label>
      <span class="flex flex-col gap-0.5">
        <span>Auto-save drafts</span>
        <Description>Changes are saved as you type.</Description>
      </span>
    </template>
  </Switch>
</template>
