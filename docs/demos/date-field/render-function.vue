<script setup lang="ts">
import { DateField } from 'herouse'
</script>

<template>
  <!--
    HeroUI's render-function demo shows a render prop customizing each sub-part; Option A has no
    compound parts to render-prop into. Vue's natural attrs fallthrough reaches the same root
    element instead, so this demo shows an arbitrary attribute landing on the field.
  -->
  <DateField data-custom="foo" class="w-[256px]" name="date" label="Date" />
</template>
