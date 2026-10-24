<script setup lang="ts">
import { ref } from 'vue'
import { Avatar, Button, Popover } from '@hareui/vue'

const isFollowing = ref(false)
</script>

<template>
  <div class="flex items-center gap-6">
    <Popover class="w-[320px]">
      <template #default="{ open }">
        <button type="button" class="flex items-center gap-2" :aria-expanded="open">
          <Avatar size="sm" alt="" src="https://img.heroui.chat/image/avatar?w=400&h=400&u=1" fallback="SJ" />
          <div class="flex flex-col items-start">
            <p class="text-sm font-medium">
              Sarah Johnson
            </p>
            <p class="text-xs text-muted">
              @sarahj
            </p>
          </div>
        </button>
      </template>
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Avatar size="md" alt="Sarah Johnson" src="https://img.heroui.chat/image/avatar?w=400&h=400&u=1" fallback="SJ" />
            <div>
              <p class="font-semibold">
                Sarah Johnson
              </p>
              <p class="text-sm text-muted">
                @sarahj
              </p>
            </div>
          </div>
          <Button
            class="rounded-full"
            size="sm"
            :variant="isFollowing ? 'tertiary' : 'primary'"
            @click="isFollowing = !isFollowing"
          >
            {{ isFollowing ? 'Following' : 'Follow' }}
          </Button>
        </div>
      </template>
      <template #content>
        <p class="mt-3 text-sm text-muted">
          Product designer and creative director. Building beautiful experiences that matter.
        </p>
        <div class="mt-3 flex gap-4">
          <div>
            <span class="font-semibold">892</span>
            <span class="ms-1 text-sm text-muted">Following</span>
          </div>
          <div>
            <span class="font-semibold">12.5K</span>
            <span class="ms-1 text-sm text-muted">Followers</span>
          </div>
        </div>
      </template>
    </Popover>
  </div>
</template>
