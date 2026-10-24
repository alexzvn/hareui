<template>
  <div class="flex flex-col gap-3">
    <Link href="#" :ui="{ icon: 'ms-1.5 size-3' }">
      External link
      <template #icon>
        <Icon icon="gravity-ui:arrow-up-right-from-square" />
      </template>
    </Link>
    <Link class="gap-1" href="#" :ui="{ icon: 'size-3' }">
      Go to page
      <template #icon>
        <Icon icon="gravity-ui:link" />
      </template>
    </Link>
  </div>
</template>

<script setup lang="ts">
import { Link } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
