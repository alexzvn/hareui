<template>
  <!--
    Attributes passed to the component fall through to its root element; this demo shows an
    arbitrary attribute landing on the field.
  -->
  <TimeField data-custom="foo" class="w-[256px]" name="time" label="Time" />
</template>

<script setup lang="ts">
import { TimeField } from '@hareui/vue'
</script>
