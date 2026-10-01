<script setup lang="ts">
import { Card } from 'herouse'
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
      <!-- herouse has no Link component yet: this is HeroUI's Link + Link.Icon markup -->
      <a
        aria-label="Go to Acme Creator Hub (opens in new tab)"
        class="group relative inline-flex h-fit w-fit items-center rounded-xl font-medium text-link no-underline decoration-separator-tertiary decoration-[1.5px] underline-offset-4 no-highlight transition-colors duration-100 ease-smooth focus-visible:status-focused motion-reduce:transition-none hover:underline hover:decoration-muted/50 active:underline active:decoration-muted"
        href="https://heroui.com"
        rel="noopener noreferrer"
        target="_blank"
      >
        Creator Hub
        <span aria-hidden="true" class="pointer-events-none ms-1 inline-flex size-[0.75em] shrink-0 items-center justify-center pb-1.5 text-current opacity-60 transition-opacity duration-150 ease-out group-hover:opacity-100 group-active:opacity-100 motion-reduce:transition-none" data-slot="link-icon">
          <svg fill="none" height="9" viewBox="0 0 7 7" width="9" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.20592 6.84333L0.379822 6.01723L4.52594 1.8672H1.37819L1.38601 0.731812H6.48742V5.83714H5.34421L5.35203 2.6933L1.20592 6.84333Z" fill="currentColor" />
          </svg>
        </span>
      </a>
    </template>
  </Card>
</template>
