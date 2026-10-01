<script setup lang="ts">
import { Avatar, Button, Card, CloseButton } from 'herouse'
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="flex w-full items-center justify-center">
    <div class="grid w-full max-w-2xl grid-cols-12 gap-4 p-4">
      <!-- Row 1: Large Product Card -->
      <Card :ui="{ content: 'contents' }" class="col-span-12 flex h-auto min-h-[152px] flex-col sm:flex-row">
        <div class="relative h-[140px] w-full shrink-0 overflow-hidden rounded-2xl sm:h-[120px] sm:w-[120px]">
          <img
            alt="Cherries"
            class="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover select-none"
            loading="lazy"
            src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/cherries.jpeg"
          />
        </div>
        <div class="flex flex-1 flex-col gap-3">
          <div class="relative flex flex-col gap-1">
            <h3 class="pe-8 text-sm leading-6 font-medium text-foreground">Become an ACME Creator!</h3>
            <p class="text-sm leading-5 text-muted">
              Lorem ipsum dolor sit amet consectetur. Sed arcu donec id aliquam dolor sed amet faucibus etiam.
            </p>
            <CloseButton aria-label="Close banner" class="absolute end-3 top-3" />
          </div>
          <div class="mt-auto flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex flex-col">
              <span class="text-sm font-medium text-foreground">Only 10 spots</span>
              <span class="text-xs text-muted">Submission ends Oct 10.</span>
            </div>
            <Button class="w-full sm:w-auto">Apply Now</Button>
          </div>
        </div>
      </Card>

      <!-- Row 2 -->
      <div class="col-span-12 grid grid-cols-12 gap-4">
        <div class="col-span-12 grid grid-cols-12 gap-4 lg:col-span-6">
          <Card :ui="{ header: 'gap-3' }" class="col-span-12">
            <div class="absolute end-3 top-3 z-10">
              <CloseButton aria-label="Close notification" />
            </div>
            <template #header>
              <Icon aria-label="Dollar sign icon" class="size-8 shrink-0" icon="gravity-ui:circle-dollar" role="img" />
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-muted uppercase">PAYMENT</span>
                <h3 class="pe-8 text-sm leading-6 font-medium text-foreground sm:text-base">You can now withdraw on crypto</h3>
                <p class="text-xs leading-5 text-muted sm:text-sm">Add your wallet in settings to withdraw</p>
              </div>
            </template>
            <template #footer>
              <a
                aria-label="Go to settings"
                class="relative inline-flex h-fit w-fit items-center rounded-xl font-medium text-link no-underline decoration-separator-tertiary decoration-[1.5px] underline-offset-4 no-highlight hover:underline hover:decoration-muted/50 active:underline active:decoration-muted"
                href="#"
                rel="noopener noreferrer"
              >
                Go to settings
                <span aria-hidden="true" class="pointer-events-none ms-1 inline-flex size-[0.75em] shrink-0 items-center justify-center pb-1.5 text-current opacity-60" data-slot="link-icon">
                  <svg fill="none" height="9" viewBox="0 0 7 7" width="9" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.20592 6.84333L0.379822 6.01723L4.52594 1.8672H1.37819L1.38601 0.731812H6.48742V5.83714H5.34421L5.35203 2.6933L1.20592 6.84333Z" fill="currentColor" />
                  </svg>
                </span>
              </a>
            </template>
          </Card>
          <div class="col-span-12 grid grid-cols-12 gap-4">
            <Card class="col-span-12 gap-2 sm:col-span-6">
              <template #header>
                <Avatar alt="Demo 1" class="size-[56px] rounded-xl" fallback="JK" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/demo1.jpg" />
              </template>
              <p class="text-sm leading-4 font-medium">Indie Hackers</p>
              <p class="text-xs text-muted">148 members</p>
              <template #footer>
                <div class="flex items-center gap-2">
                  <Avatar alt="John" class="size-4" fallback="JK" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg" />
                  <p class="text-xs text-muted">By John</p>
                </div>
              </template>
            </Card>
            <Card class="col-span-12 gap-2 sm:col-span-6">
              <template #header>
                <Avatar alt="Demo 2" class="size-[56px] rounded-xl" fallback="AB" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/demo2.jpg" />
              </template>
              <p class="text-sm leading-4 font-medium">AI Builders</p>
              <p class="text-xs text-muted">362 members</p>
              <template #footer>
                <div class="flex items-center gap-2">
                  <Avatar alt="John" class="size-4" fallback="M" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg" />
                  <p class="text-xs text-muted">By Martha</p>
                </div>
              </template>
            </Card>
          </div>
        </div>
        <Card :ui="{ header: 'relative z-10', footer: 'relative z-10' }" class="col-span-12 min-h-[200px] overflow-hidden rounded-3xl lg:col-span-6">
          <img
            alt="NEO Home Robot"
            aria-hidden="true"
            class="absolute inset-0 h-full w-full object-cover"
            src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/neo2.jpeg"
          />
          <template #header>
            <h3 class="text-xs font-semibold tracking-wide text-black/70">NEO</h3>
            <p class="text-sm leading-5 font-medium text-black/50">Home Robot</p>
          </template>
          <template #footer>
            <div class="mt-auto flex items-center justify-between">
              <div>
                <div class="text-sm font-medium text-black">Available soon</div>
                <div class="text-xs text-black/60">Get notified</div>
              </div>
              <Button class="bg-white text-black" size="sm" variant="tertiary">Notify me</Button>
            </div>
          </template>
        </Card>
      </div>

      <!-- Row 3 -->
      <div class="col-span-12 grid grid-cols-12 gap-4">
        <Card :ui="{ footer: 'relative z-10' }" class="relative col-span-12 h-[250px] sm:h-[300px] md:col-span-8 md:h-[350px]">
          <img
            alt="NEO Home Robot"
            aria-hidden="true"
            class="absolute inset-0 h-full w-full object-cover"
            src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/neo1.jpeg"
          />
          <template #footer>
            <div class="mt-auto flex items-end justify-between">
              <div>
                <div class="text-base font-medium text-black sm:text-lg">NEO</div>
                <div class="text-xs font-medium text-black/50 sm:text-sm">$499/m</div>
              </div>
              <Button class="bg-white text-black" size="sm" variant="tertiary">Get now</Button>
            </div>
          </template>
        </Card>

        <div class="col-span-12 flex flex-col gap-2 md:col-span-4 md:justify-between md:gap-0 md:py-2">
          <Card :ui="{ content: 'contents' }" class="flex flex-row gap-3 p-1" variant="transparent">
            <img
              alt="Futuristic Robot"
              class="aspect-square h-16 w-16 shrink-0 rounded-xl object-cover select-none sm:h-20 sm:w-20"
              loading="lazy"
              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/robot1.jpeg"
            />
            <div class="flex flex-1 flex-col justify-center gap-1">
              <h3 class="text-sm font-medium text-foreground">Bridging the Future</h3>
              <p class="text-xs text-muted">Today, 6:30 PM</p>
            </div>
          </Card>
          <Card :ui="{ content: 'contents' }" class="flex flex-row gap-3 p-1" variant="transparent">
            <img
              alt="Avocado"
              class="aspect-square h-16 w-16 shrink-0 rounded-xl object-cover select-none sm:h-20 sm:w-20"
              loading="lazy"
              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/avocado.jpeg"
            />
            <div class="flex flex-1 flex-col justify-center gap-1">
              <h3 class="text-sm font-medium text-foreground">Avocado Hackathon</h3>
              <p class="text-xs text-muted">Wed, 4:30 PM</p>
            </div>
          </Card>
          <Card :ui="{ content: 'contents' }" class="flex flex-row gap-3 p-1" variant="transparent">
            <img
              alt="Sound Electro event"
              class="aspect-square h-16 w-16 shrink-0 rounded-xl object-cover select-none sm:h-20 sm:w-20"
              loading="lazy"
              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/oranges.jpeg"
            />
            <div class="flex flex-1 flex-col justify-center gap-1">
              <h3 class="text-sm font-medium text-foreground">Sound Electro | Beyond art</h3>
              <p class="text-xs text-muted">Fri, 8:00 PM</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
