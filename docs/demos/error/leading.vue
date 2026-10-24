<script setup lang="ts">
import { Error } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>

<template>
  <Error
    class="min-h-96"
    :error="{
      statusCode: 404,
      statusMessage: 'Page not found',
      message: 'The page you are looking for does not exist.',
    }"
  >
    <template #leading>
      <span class="flex size-14 items-center justify-center rounded-full bg-accent-soft">
        <Icon icon="gravity-ui:magnifier" class="size-6" />
      </span>
    </template>
  </Error>
</template>
