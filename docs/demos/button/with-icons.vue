<template>
  <div class="flex flex-wrap gap-3">
    <Button>
      <Icon icon="gravity-ui:globe" />
      Search
    </Button>
    <Button variant="secondary">
      <Icon icon="gravity-ui:plus" />
      Add Member
    </Button>
    <Button variant="tertiary">
      <Icon icon="gravity-ui:envelope" />
      Email
    </Button>
    <Button variant="danger">
      <Icon icon="gravity-ui:trash-bin" />
      Delete
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
