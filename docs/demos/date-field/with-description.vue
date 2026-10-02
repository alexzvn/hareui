<script setup lang="ts">
import { DateField } from 'herouse'
</script>

<template>
  <div class="flex flex-col gap-4">
    <DateField class="w-[256px]" name="date" label="Birth date" description="Enter your date of birth" />
    <DateField class="w-[256px]" name="appointment-date" label="Appointment date" description="Enter a date for your appointment" />
  </div>
</template>
