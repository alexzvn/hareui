<template>
  <div class="h-96 w-full rounded-xl border border-border p-2">
    <div class="h-full overflow-y-auto px-4 lg:grid lg:grid-cols-[1fr_13rem] lg:gap-10">
      <Toc :links="links" title="In this guide" class="lg:order-last">
        <template #leading>
          <Icon icon="gravity-ui:list-ul" class="size-4 text-muted" />
        </template>

        <template #link="{ link, active }">
          <span class="truncate">{{ link.text }}</span>
          <Icon v-if="active" icon="gravity-ui:eye" class="ms-1.5 size-3.5 shrink-0" />
        </template>

        <template #bottom>
          <div class="flex flex-col gap-2 border-t border-dashed border-separator pt-4 text-sm">
            <a
              href="#slots-pantry"
              class="flex items-center gap-1.5 text-muted hover:text-foreground"
            >
              <Icon icon="gravity-ui:arrow-up" class="size-4" />
              Back to top
            </a>
            <a href="#" class="flex items-center gap-1.5 text-muted hover:text-foreground">
              <Icon icon="gravity-ui:pencil" class="size-4" />
              Suggest an edit
            </a>
          </div>
        </template>
      </Toc>

      <article class="py-8">
        <section v-for="section in sections" :key="section.id" class="mb-10">
          <h2 :id="section.id" class="scroll-mt-16 text-lg font-semibold lg:scroll-mt-8">
            {{ section.text }}
          </h2>
          <p class="mt-2 text-sm text-muted">{{ section.body }}</p>
        </section>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TocLink } from '@hareui/vue'
import { Toc } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const sections = [
  {
    id: 'slots-pantry',
    text: 'Stocking the pantry',
    body: 'Rice, lentils, tinned tomatoes, onions and garlic cover most weeknight dinners.',
  },
  {
    id: 'slots-plan',
    text: 'Planning the week',
    body: 'Cook two big dishes on Sunday and turn the leftovers into something new midweek.',
  },
  {
    id: 'slots-prep',
    text: 'Prep once',
    body: 'Wash and chop the vegetables for three days at once and keep them in clear tubs.',
  },
  {
    id: 'slots-store',
    text: 'Storing leftovers',
    body: 'Cool food quickly, label the lids with the date, and eat it within three days.',
  },
]

const links: TocLink[] = sections.map(({ id, text }) => ({ id, text, depth: 2 }))
</script>
