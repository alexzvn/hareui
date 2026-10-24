<script setup lang="ts">
import { Alert, Button, CloseButton, Spinner } from '@hareui/vue'
</script>

<template>
  <div class="grid w-full max-w-xl gap-4">
    <!-- Default - General information -->
    <Alert
      title="New features available"
      description="Check out our latest updates including dark mode support and improved accessibility features."
    />

    <!-- Accent - Important information with action -->
    <Alert
      status="accent"
      title="Update available"
      description="A new version of the application is available. Please refresh to get the latest features and bug fixes."
    >
      <Button class="mt-2 sm:hidden" size="sm" variant="primary"> Refresh </Button>
      <template #trailing>
        <Button class="hidden sm:block" size="sm" variant="primary"> Refresh </Button>
      </template>
    </Alert>

    <!-- Danger - Error with detailed steps -->
    <Alert status="danger" title="Unable to connect to server">
      <template #description>
        We're experiencing connection issues. Please try the following:
        <ul class="mt-2 list-inside list-disc space-y-1 text-sm">
          <li>Check your internet connection</li>
          <li>Refresh the page</li>
          <li>Clear your browser cache</li>
        </ul>
      </template>
      <Button class="mt-2 sm:hidden" size="sm" variant="danger"> Retry </Button>
      <template #trailing>
        <Button class="hidden sm:block" size="sm" variant="danger"> Retry </Button>
      </template>
    </Alert>

    <!-- Without description -->
    <Alert status="success" title="Profile updated successfully">
      <template #trailing>
        <CloseButton />
      </template>
    </Alert>

    <!-- Custom indicator - Loading state -->
    <Alert
      status="accent"
      title="Processing your request"
      description="Please wait while we sync your data. This may take a few moments."
    >
      <template #indicator>
        <Spinner size="sm" />
      </template>
    </Alert>

    <!-- Without close button -->
    <Alert
      status="warning"
      title="Scheduled maintenance"
      description="Our services will be unavailable on Sunday, March 15th from 2:00 AM to 6:00 AM UTC for scheduled maintenance."
    />
  </div>
</template>
