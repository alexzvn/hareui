<template>
  <ScrollArea class="h-60 w-full max-w-md rounded-2xl border border-border bg-surface">
    <div class="flex flex-col gap-3 p-4 text-sm leading-relaxed text-muted">
      <h3 class="text-base font-semibold text-foreground">Terms of service</h3>
      <p v-for="paragraph in paragraphs" :key="paragraph">{{ paragraph }}</p>
    </div>
  </ScrollArea>
</template>

<script setup lang="ts">
import { ScrollArea } from '@hareui/vue'

const paragraphs = [
  'These terms apply to every workspace you create or join. By signing in you agree to them.',
  'You own the content you upload. You give us the rights we need to store, back up and show it to the people you share it with.',
  'Keep your password private and tell us straight away if you think someone else has used your account.',
  'Paid plans renew each month or year until cancelled. You can cancel at any time from the billing page.',
  'We may update these terms. When a change matters, we will email the workspace owners 30 days before it applies.',
  'If you stop using the service you can export your data for 90 days after the account closes.',
]
</script>
