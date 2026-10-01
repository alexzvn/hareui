<script setup lang="ts">
import { Typography } from 'herouse'

const types = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'body-sm', 'body-xs', 'code'] as const
const aligns = ['start', 'center', 'end', 'justify'] as const
const colors = ['default', 'muted'] as const
const weights = ['normal', 'medium', 'semibold', 'bold'] as const
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-xl font-semibold">Typography</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Type scale</h2>
      <div class="flex max-w-xl flex-col gap-4">
        <Typography v-for="type in types" :key="type" :type="type">
          {{ type }} — The quick brown fox jumps over the lazy dog.
        </Typography>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Align</h2>
      <div class="flex max-w-xl flex-col gap-4">
        <Typography v-for="align in aligns" :key="align" :align="align">
          {{ align }} — Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Typography>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Color</h2>
      <div class="flex max-w-xl flex-col gap-2">
        <Typography v-for="color in colors" :key="color" :color="color">
          {{ color }} color — Secondary descriptive text.
        </Typography>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Weight</h2>
      <div class="flex max-w-xl flex-col gap-2">
        <Typography v-for="weight in weights" :key="weight" :weight="weight">
          {{ weight }} weight — HeroUse typography.
        </Typography>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Truncate</h2>
      <Typography class="w-48" truncate>
        This line of text is much longer than its container and gets truncated with an ellipsis.
      </Typography>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">as override</h2>
      <Typography as="h2" type="h1">
        H1 visual style, rendered as an h2 element
      </Typography>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Prose</h2>
      <Typography class="max-w-xl flex flex-col gap-3" prose>
        <h1>Prose title</h1>
        <p>Prose is for authored content where the markup is already semantic and HeroUI applies the default typography rhythm.</p>
        <h2>Section title</h2>
        <p>Inline code like <code>render</code> receives the same code treatment as the Typography primitive.</p>
        <ul>
          <li>List item one</li>
          <li>List item two</li>
        </ul>
        <blockquote>A short quote for emphasis.</blockquote>
      </Typography>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override</h2>
      <Typography type="body-xs" :ui="{ base: 'uppercase tracking-wide text-accent' }">
        Changelog
      </Typography>
    </section>
  </div>
</template>
