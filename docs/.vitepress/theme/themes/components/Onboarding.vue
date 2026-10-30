<template>
  <Modal
    v-model:open="isOpen"
    title="Adapt HareUI to your brand"
    size="lg"
    class="max-w-[480px]"
    :close-button="false"
    :ui="{ header: 'mb-4' }"
  >
    <template #header>
      <div
        class="flex h-64 w-full items-center justify-center rounded-xl border border-border bg-background"
      >
        <div
          class="onboarding-block h-[152px] w-[188px] bg-surface p-4 shadow-[0_2px_4px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.06),0_0_1px_0_rgba(0,0,0,0.06)]"
        >
          <div class="onboarding-block mb-3 size-10 bg-surface-secondary" />
          <div class="onboarding-block mb-2 h-2 w-[93px] bg-surface-secondary" />
          <div class="onboarding-block mb-3 h-4 w-[139px] bg-surface-secondary" />
          <div class="onboarding-block onboarding-button h-6 w-[104px] px-3 py-2">
            <div class="onboarding-block onboarding-button-inner h-full w-full" />
          </div>
        </div>
      </div>
    </template>
    <template #body>
      <div class="flex flex-col gap-2">
        <p class="text-base font-medium text-foreground">Adapt HareUI to your brand</p>
        <p class="text-sm leading-5 text-muted">
          Customize colors, radius, and typography using a token system that keeps every component
          consistent and production-ready.
          <br />
          <br />
          More features and themes coming soon.
        </p>
      </div>
    </template>
    <template #footer="{ close }">
      <Button class="w-full" @click="close()">Continue</Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
// Port of HeroUI docs `themes/components/onboarding.tsx`.
// framer-motion keyframes (`duration: 4, ease: easeInOut, repeat: Infinity, times: [0, .25, .5, .75, 1]`) -> CSS keyframe animations.
import { Button, Modal } from '@hareui/vue'
import { onMounted, ref } from 'vue'

const isOpen = ref(false)

onMounted(() => {
  const onboarding = localStorage.getItem('onboarding')

  if (!onboarding) {
    isOpen.value = true
    localStorage.setItem('onboarding', 'true')
  }
})
</script>

<style scoped>
.onboarding-block {
  animation: onboarding-radius 4s ease-in-out infinite;
}
.onboarding-button {
  animation:
    onboarding-radius 4s ease-in-out infinite,
    onboarding-button-bg 4s ease-in-out infinite;
}
.onboarding-button-inner {
  animation:
    onboarding-radius 4s ease-in-out infinite,
    onboarding-button-inner-bg 4s ease-in-out infinite;
}

@keyframes onboarding-radius {
  0%,
  100% {
    border-radius: 24px;
  }
  25% {
    border-radius: 8px;
  }
  50% {
    border-radius: 0;
  }
  75% {
    border-radius: 12px;
  }
}
@keyframes onboarding-button-bg {
  0%,
  100% {
    background-color: #3b82f6;
  }
  25% {
    background-color: #6366f1;
  }
  50% {
    background-color: #10b981;
  }
  75% {
    background-color: #f97316;
  }
}
@keyframes onboarding-button-inner-bg {
  0%,
  100% {
    background-color: #93c5fd;
  }
  25% {
    background-color: #a5b4fc;
  }
  50% {
    background-color: #6ee7b7;
  }
  75% {
    background-color: #fdba74;
  }
}
</style>
