<template>
  <!--
    Attributes passed to the component fall through to its root element; this demo shows an
    arbitrary attribute landing on the field.
  -->
  <DateField data-custom="foo" class="w-[256px]" name="date" label="Date" />
</template>

<script setup lang="ts">
import { DateField } from '@hareui/vue'
</script>
