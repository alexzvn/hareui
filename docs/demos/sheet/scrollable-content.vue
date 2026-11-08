<template>
  <Sheet close-button title="Terms & Conditions" class="mx-auto max-h-[95vh] max-w-[420px]">
    <Button variant="secondary"> Terms &amp; Conditions </Button>
    <template #body>
      <section v-for="section in sections" :key="section.title" class="mb-5 flex flex-col gap-2">
        <h3 class="text-sm font-semibold">{{ section.title }}</h3>
        <p v-for="paragraph in section.paragraphs" :key="paragraph" class="text-sm text-muted">
          {{ paragraph }}
        </p>
      </section>
    </template>
    <template #footer="{ close }">
      <Button variant="secondary" @click="close"> Decline </Button>
      <Button variant="secondary" @click="close"> Accept </Button>
    </template>
  </Sheet>
</template>

<script setup lang="ts">
import { Button, Sheet } from '@hareui/vue'

const sections = [
  {
    title: 'Your account',
    paragraphs: [
      'These terms apply to every workspace you create or join. By signing in you agree to them.',
      'Keep your password private and tell us straight away if you think someone else has used your account.',
    ],
  },
  {
    title: 'Content you upload',
    paragraphs: [
      'You own the content you upload. You give us the rights we need to store, back up and show it to the people you share it with.',
      'Do not upload content you have no right to share. We remove it when the owner asks us to.',
    ],
  },
  {
    title: 'Payments',
    paragraphs: [
      'Paid plans renew each month or year until cancelled. We charge the card on file at the start of each period.',
      'Prices include the taxes we must collect. If a payment fails, we retry it for 14 days before pausing the workspace.',
    ],
  },
  {
    title: 'Cancellation',
    paragraphs: [
      'You can cancel at any time from the billing page. The plan stays active until the end of the period you paid for.',
      'We do not refund part periods, unless the law where you live says we must.',
    ],
  },
  {
    title: 'Your data',
    paragraphs: [
      'If you stop using the service you can export your data for 90 days after the account closes.',
      'After 90 days we delete the workspace and its backups. Deleted data cannot be restored.',
    ],
  },
  {
    title: 'Changes to these terms',
    paragraphs: [
      'We may update these terms. When a change matters, we will email the workspace owners 30 days before it applies.',
      'If you keep using the service after that date, the new terms apply to you.',
    ],
  },
]
</script>
