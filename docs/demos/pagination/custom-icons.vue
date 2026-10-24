<script setup lang="ts">
import { Pagination } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>

<template>
  <Pagination class="justify-center" next-label="Forward" prev-label="Back" :total="3">
    <template #prevIcon>
      <Icon icon="gravity-ui:arrow-left" />
    </template>
    <template #nextIcon>
      <Icon icon="gravity-ui:arrow-right" />
    </template>
  </Pagination>
</template>
