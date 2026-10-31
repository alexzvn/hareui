<template>
  <div class="flex flex-wrap gap-3">
    <Button href="#button-as-link" label="Read the guide" />
    <Button
      variant="secondary"
      href="https://github.com"
      target="_blank"
      label="Open GitHub"
      :trailing-icon="gravityIcon('arrow-up-right-from-square')"
    />
    <Button variant="tertiary" href="#button-as-link" disabled label="Archived" />
  </div>
</template>

<script setup lang="ts">
import { Button } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const gravityIcon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })
</script>
