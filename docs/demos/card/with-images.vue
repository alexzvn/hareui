<template>
  <div class="flex w-full items-center justify-center">
    <div class="grid w-full max-w-2xl grid-cols-12 gap-4 p-4">
      <!-- Row 1: Large Product Card - Available Soon -->
      <Card
        class="col-span-12 flex h-auto min-h-[152px] flex-col sm:flex-row"
        :ui="{ content: 'gap-3' }"
      >
        <template #leading>
          <div
            class="relative h-[140px] w-full shrink-0 overflow-hidden rounded-2xl sm:h-[120px] sm:w-[120px]"
          >
            <img
              alt="Cherries"
              class="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover select-none"
              loading="lazy"
              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/cherries.jpeg"
            />
          </div>
        </template>
        <div class="flex flex-col gap-1">
          <h3 class="pe-8 text-sm leading-6 font-medium text-foreground">
            Become an ACME Creator!
          </h3>
          <p class="text-sm leading-5 text-muted">
            Lorem ipsum dolor sit amet consectetur. Sed arcu donec id aliquam dolor sed amet
            faucibus etiam.
          </p>
          <CloseButton aria-label="Close banner" class="absolute end-3 top-3" />
        </div>
        <div
          class="mt-auto flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex flex-col">
            <span class="text-sm font-medium text-foreground">Only 10 spots</span>
            <span class="text-xs text-muted">Submission ends Oct 10.</span>
          </div>
          <Button class="w-full sm:w-auto">Apply Now</Button>
        </div>
      </Card>

      <!-- Row 2 -->
      <div class="col-span-12 grid grid-cols-12 gap-4">
        <!-- Left Column -->
        <div class="col-span-12 grid grid-cols-12 gap-4 lg:col-span-6">
          <!-- Top Card -->
          <Card class="col-span-12" :ui="{ header: 'gap-3' }">
            <template #leading>
              <div class="absolute end-3 top-3 z-10">
                <CloseButton aria-label="Close notification" />
              </div>
            </template>
            <template #header>
              <Icon
                aria-label="Dollar sign icon"
                class="size-8 shrink-0"
                icon="gravity-ui:circle-dollar"
                role="img"
              />
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-muted uppercase">PAYMENT</span>
                <h3 class="pe-8 text-sm leading-6 font-medium text-foreground sm:text-base">
                  You can now withdraw on crypto
                </h3>
                <p class="text-xs leading-5 text-muted sm:text-sm">
                  Add your wallet in settings to withdraw
                </p>
              </div>
            </template>
            <template #footer>
              <Link aria-label="Go to settings" href="#" rel="noopener noreferrer" icon>
                Go to settings
              </Link>
            </template>
          </Card>
          <!-- Bottom cards -->
          <div class="col-span-12 grid grid-cols-12 gap-4">
            <Card
              class="col-span-12 gap-2 sm:col-span-6"
              :ui="{ content: 'mt-1', footer: 'flex items-center gap-2' }"
            >
              <template #header>
                <Avatar
                  alt="Demo 1"
                  class="size-[56px] rounded-xl"
                  fallback="JK"
                  src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/demo1.jpg"
                />
              </template>
              <p class="text-sm leading-4 font-medium">Indie Hackers</p>
              <p class="text-xs text-muted">148 members</p>
              <template #footer>
                <Avatar
                  alt="John"
                  class="size-4"
                  fallback="JK"
                  src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg"
                />
                <p class="text-xs text-muted">By John</p>
              </template>
            </Card>
            <Card
              class="col-span-12 gap-2 sm:col-span-6"
              :ui="{ content: 'mt-1', footer: 'flex items-center gap-2' }"
            >
              <template #header>
                <Avatar
                  alt="Demo 2"
                  class="size-[56px] rounded-xl"
                  fallback="AB"
                  src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/demo2.jpg"
                />
              </template>
              <p class="text-sm leading-4 font-medium">AI Builders</p>
              <p class="text-xs text-muted">362 members</p>
              <template #footer>
                <Avatar
                  alt="John"
                  class="size-4"
                  fallback="M"
                  src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                />
                <p class="text-xs text-muted">By Martha</p>
              </template>
            </Card>
          </div>
        </div>
        <!-- Right Column -->
        <Card
          class="col-span-12 min-h-[200px] overflow-hidden rounded-3xl lg:col-span-6"
          description="Home Robot"
          title="NEO"
          :ui="{
            header: 'z-10 text-white',
            title: 'text-xs font-semibold tracking-wide text-black/70',
            description: 'text-sm leading-5 font-medium text-black/50',
            footer: 'z-10 mt-auto flex items-center justify-between',
          }"
        >
          <!-- Background image -->
          <template #leading>
            <img
              alt="NEO Home Robot"
              aria-hidden="true"
              class="absolute inset-0 h-full w-full object-cover"
              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/neo2.jpeg"
            />
          </template>
          <template #footer>
            <div>
              <div class="text-sm font-medium text-black">Available soon</div>
              <div class="text-xs text-black/60">Get notified</div>
            </div>
            <Button class="bg-white text-black" size="sm" variant="tertiary">Notify me</Button>
          </template>
        </Card>
      </div>

      <!-- Row 3 -->
      <div class="col-span-12 grid grid-cols-12 gap-4">
        <!-- Left Column: Card -->
        <Card
          class="relative col-span-12 h-[250px] sm:h-[300px] md:col-span-8 md:h-[350px]"
          :ui="{ footer: 'z-10 mt-auto flex items-end justify-between' }"
        >
          <template #leading>
            <img
              alt="NEO Home Robot"
              aria-hidden="true"
              class="absolute inset-0 h-full w-full object-cover"
              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/neo1.jpeg"
            />
          </template>
          <template #footer>
            <div>
              <div class="text-base font-medium text-black sm:text-lg">NEO</div>
              <div class="text-xs font-medium text-black/50 sm:text-sm">$499/m</div>
            </div>
            <Button class="bg-white text-black" size="sm" variant="tertiary">Get now</Button>
          </template>
        </Card>

        <!-- Right Column: Cards Stack -->
        <div
          class="col-span-12 flex flex-col gap-2 md:col-span-4 md:justify-between md:gap-0 md:py-2"
        >
          <Card
            v-for="event in events"
            :key="event.title"
            class="flex flex-row gap-3 p-1"
            :description="event.description"
            :title="event.title"
            :ui="{
              header: 'flex-1 justify-center gap-1',
              title: 'text-sm',
              description: 'text-xs',
            }"
            variant="transparent"
          >
            <template #leading>
              <img
                :alt="event.alt"
                class="aspect-square h-16 w-16 shrink-0 rounded-xl object-cover select-none sm:h-20 sm:w-20"
                loading="lazy"
                :src="event.src"
              />
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Avatar, Button, Card, CloseButton, Link } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const events = [
  {
    alt: 'Futuristic Robot',
    src: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/robot1.jpeg',
    title: 'Bridging the Future',
    description: 'Today, 6:30 PM',
  },
  {
    alt: 'Avocado',
    src: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/avocado.jpeg',
    title: 'Avocado Hackathon',
    description: 'Wed, 4:30 PM',
  },
  {
    alt: 'Sound Electro event',
    src: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/oranges.jpeg',
    title: 'Sound Electro | Beyond art',
    description: 'Fri, 8:00 PM',
  },
]
</script>
