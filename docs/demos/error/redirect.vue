<script setup lang="ts">
import { Error } from '@hareui/vue'
</script>

<template>
  <Error
    class="min-h-96"
    redirect="/docs/components/button"
    :error="{ statusCode: 404, statusMessage: 'Page not found', message: 'The page you are looking for does not exist.' }"
  />
</template>
