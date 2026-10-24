<template>
  <Error
    class="min-h-96"
    redirect=""
    :error="{
      statusCode: 500,
      statusMessage: 'Something went wrong',
      message: 'An unexpected error occurred.',
    }"
    @clear="onClear"
  />
</template>

<script setup lang="ts">
import { Error, toast } from '@hareui/vue'

// With an empty `redirect` the clear button is a plain `<button>`: handle the click yourself (e.g. `router.push('/')`).
const onClear = () => {
  toast('Error cleared')
}
</script>
