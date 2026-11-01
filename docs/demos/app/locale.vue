<template>
  <App :locale="vi" :toaster="null">
    <Pagination v-model:page="page" class="justify-center" :total="3" />
  </App>
</template>

<script setup lang="ts">
import { App, Pagination } from '@hareui/vue'
import { vi } from '@hareui/vue/locale'
import { ref } from 'vue'

const page = ref(1)
</script>
