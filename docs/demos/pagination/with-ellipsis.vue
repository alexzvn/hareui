<script setup lang="ts">
import { Pagination } from 'herouse'
import { ref } from 'vue'

const page = ref(1)
</script>

<template>
  <div class="w-full max-w-2xs overflow-x-auto sm:max-w-full">
    <Pagination v-model:page="page" class="justify-center" ellipsis :total="12" />
  </div>
</template>
