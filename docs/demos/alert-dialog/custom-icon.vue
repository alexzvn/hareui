<template>
  <AlertDialog class="sm:max-w-[400px]" status="warning" title="Reset your password?">
    <Button variant="secondary"> Reset Password </Button>
    <template #icon>
      <Icon class="size-5" icon="gravity-ui:lock-open" />
    </template>
    <template #body>
      <p>
        We'll send a password reset link to your email address. You'll need to create a new password
        to regain access to your account.
      </p>
    </template>
    <template #footer="{ close }">
      <Button variant="tertiary" @click="close"> Cancel </Button>
      <Button @click="close"> Send Reset Link </Button>
    </template>
  </AlertDialog>
</template>

<script setup lang="ts">
import { AlertDialog, Button } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
