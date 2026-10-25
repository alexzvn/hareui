<template>
  <Pagination
    class="justify-center"
    :next="{ disabled: true }"
    :prev="{ disabled: true }"
    :total="3"
  />
</template>

<script setup lang="ts">
import { Pagination } from '@hareui/vue'
</script>
