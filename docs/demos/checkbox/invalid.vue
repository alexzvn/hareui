<script setup lang="ts">
import { Checkbox } from '@hareui/vue'
</script>

<template>
  <Checkbox invalid required name="agreement" label="I agree to the terms" error-message="You must accept the terms to continue" />
</template>
