<script setup lang="ts">
import { Typography } from 'herouse'
</script>

<template>
  <Typography class="flex max-w-xl flex-col gap-3" prose>
    <h1>Prose title</h1>
    <p>
      Prose is for authored content where the markup is already semantic and HeroUI applies the
      default typography rhythm.
    </p>
    <h2>Section title</h2>
    <p>
      Inline code like <code>render</code> receives the same code treatment as the Typography
      primitive.
    </p>
  </Typography>
</template>
