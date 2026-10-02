<script setup lang="ts">
import { Pagination } from 'herouse'
import { ref } from 'vue'

const page = ref(1)
</script>

<template>
  <Pagination v-model:page="page" class="justify-center" :total="3" />
</template>
