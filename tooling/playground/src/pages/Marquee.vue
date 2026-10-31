<script setup lang="ts">
import { Chip, Marquee } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const logos = ['logo-github', 'logo-figma', 'logo-notion', 'logo-slack', 'logo-docker', 'logo-python']
const tags = ['Design', 'Research', 'Engineering', 'Support', 'Marketing', 'Sales']
</script>

<template>
  <div class="flex flex-col gap-10 p-8">
    <h1 class="text-2xl font-semibold">Marquee</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">horizontal (default)</h2>
      <Marquee>
        <Icon v-for="logo in logos" :key="logo" :icon="`gravity-ui:${logo}`" class="size-10 shrink-0" />
      </Marquee>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">reverse</h2>
      <Marquee reverse>
        <Icon v-for="logo in logos" :key="logo" :icon="`gravity-ui:${logo}`" class="size-10 shrink-0" />
      </Marquee>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">pause-on-hover</h2>
      <Marquee pause-on-hover>
        <Chip v-for="tag in tags" :key="tag" :label="tag" size="lg" />
      </Marquee>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">overlay false, repeat 2</h2>
      <Marquee :overlay="false" :repeat="2">
        <Chip v-for="tag in tags" :key="tag" :label="tag" size="lg" />
      </Marquee>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">rtl</h2>
      <div dir="rtl">
        <Marquee>
          <Chip v-for="tag in tags" :key="tag" :label="tag" size="lg" />
        </Marquee>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">data-reduce-motion="true" (holds still)</h2>
      <div data-reduce-motion="true">
        <Marquee>
          <Chip v-for="tag in tags" :key="tag" :label="tag" size="lg" />
        </Marquee>
      </div>
    </section>

    <section class="flex gap-8">
      <div>
        <h2 class="mb-2 text-sm font-medium text-muted">vertical</h2>
        <Marquee orientation="vertical" class="h-72 w-40">
          <Icon v-for="logo in logos" :key="logo" :icon="`gravity-ui:${logo}`" class="size-10 shrink-0" />
        </Marquee>
      </div>
      <div>
        <h2 class="mb-2 text-sm font-medium text-muted">vertical reverse</h2>
        <Marquee orientation="vertical" reverse class="h-72 w-40">
          <Icon v-for="logo in logos" :key="logo" :icon="`gravity-ui:${logo}`" class="size-10 shrink-0" />
        </Marquee>
      </div>
      <div>
        <h2 class="mb-2 text-sm font-medium text-muted">vertical, no overlay</h2>
        <Marquee orientation="vertical" :overlay="false" class="h-72 w-40">
          <Icon v-for="logo in logos" :key="logo" :icon="`gravity-ui:${logo}`" class="size-10 shrink-0" />
        </Marquee>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">as="section" with :ui override (8s loop, 12px gap, accent tint)</h2>
      <Marquee
        as="section"
        :ui="{
          root: 'rounded-2xl bg-accent-soft py-3 [--marquee-duration:8s] [--marquee-gap:--spacing(3)] before:from-accent-soft after:from-accent-soft',
        }"
      >
        <span v-for="tag in tags" :key="tag" class="shrink-0 text-sm font-medium text-accent">{{ tag }}</span>
      </Marquee>
    </section>
  </div>
</template>
