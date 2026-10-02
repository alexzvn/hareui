<script setup lang="ts">
import { Card, Link } from 'herouse'
import { Icon } from '@iconify/vue'
</script>

<template>
  <Card
    class="w-[400px]"
    description="Visit the Acme Creator Hub to sign up today and start earning credits from your fans and followers."
    title="Become an Acme Creator!"
  >
    <template #leading>
      <Icon aria-label="Dollar sign icon" class="size-6" icon="gravity-ui:circle-dollar" role="img" />
    </template>
    <template #footer>
      <Link
        aria-label="Go to Acme Creator Hub (opens in new tab)"
        href="https://heroui.com"
        rel="noopener noreferrer"
        target="_blank"
        icon
      >
        Creator Hub
      </Link>
    </template>
  </Card>
</template>
