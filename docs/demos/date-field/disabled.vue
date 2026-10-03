<script setup lang="ts">
import { getLocalTimeZone, today } from '@internationalized/date'
import { DateField } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <DateField disabled class="w-[256px]" name="date" label="Date" :default-value="today(getLocalTimeZone())" description="This date field is disabled" />
    <DateField disabled class="w-[256px]" name="date-empty" label="Date" description="This date field is disabled" />
  </div>
</template>
