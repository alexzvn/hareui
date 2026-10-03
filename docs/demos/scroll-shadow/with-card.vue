<script setup lang="ts">
import { Button, Card, ScrollShadow } from '@hareui/vue'
</script>

<template>
  <Card
    class="max-w-[400px]"
    description="Please review before proceeding"
    title="Terms and Conditions"
    :ui="{ content: 'p-0', footer: 'mt-4 flex flex-row gap-2' }"
  >
    <ScrollShadow class="h-[300px] px-4" :size="80">
      <div class="space-y-4">
        <p v-for="idx in 10" :key="`scroll-shadow-lorem-content-${idx}`">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
          risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor quam.
          Morbi accumsan cursus enim, sed ultricies sapien.
        </p>
      </div>
    </ScrollShadow>
    <template #footer>
      <Button class="w-full" variant="secondary">
        Cancel
      </Button>
      <Button class="w-full">
        Accept
      </Button>
    </template>
  </Card>
</template>
