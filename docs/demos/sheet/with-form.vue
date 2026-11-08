<template>
  <Sheet close-button placement="right" title="Edit Profile" class="w-[400px]">
    <Button variant="secondary"> Edit Profile </Button>
    <template #body>
      <form class="flex flex-col gap-4">
        <TextField
          class="w-full"
          label="Name"
          name="name"
          placeholder="Enter your name"
          type="text"
          variant="secondary"
        />
        <TextField
          class="w-full"
          label="Email"
          name="email"
          placeholder="Enter your email"
          type="email"
          variant="secondary"
        />
        <TextField
          class="w-full"
          label="Bio"
          name="bio"
          placeholder="Tell us about yourself"
          variant="secondary"
        />
      </form>
    </template>
    <template #footer="{ close }">
      <Button variant="secondary" @click="close"> Cancel </Button>
      <Button variant="secondary" @click="close"> Save Changes </Button>
    </template>
  </Sheet>
</template>

<script setup lang="ts">
import { Button, Sheet, TextField } from '@hareui/vue'
</script>
