<template>
  <div class="w-[220px]">
    <NativeSelect full-width label="Pickup time" name="pickup">
      <option value="">Pick a time slot</option>
      <option value="08:00">8:00 AM</option>
      <option disabled value="09:00">9:00 AM (fully booked)</option>
      <option value="10:00">10:00 AM</option>
      <option disabled value="11:00">11:00 AM (fully booked)</option>
      <option value="12:00">12:00 PM</option>
    </NativeSelect>
  </div>
</template>

<script setup lang="ts">
import { NativeSelect } from '@hareui/vue'
</script>
