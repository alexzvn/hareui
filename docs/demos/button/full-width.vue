<script setup lang="ts">
import { Button } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="w-[400px] space-y-3">
    <Button full-width>Primary Button</Button>
    <Button full-width>
      <Icon icon="gravity-ui:plus" />
      With Icon
    </Button>
  </div>
</template>
