<script setup lang="ts">
import { Kbd } from 'herouse'
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">
      Kbd
    </h1>
    <section class="flex flex-wrap items-center gap-3">
      <Kbd keys="command">
        K
      </Kbd>
      <Kbd :keys="['ctrl', 'shift']">
        P
      </Kbd>
      <Kbd keys="enter" />
      <Kbd>Esc</Kbd>
    </section>
    <section class="flex flex-wrap items-center gap-3">
      <Kbd variant="light" keys="option">
        Space
      </Kbd>
      <Kbd :ui="{ abbr: 'text-accent', content: 'font-mono' }" keys="shift">
        Tab
      </Kbd>
    </section>
  </div>
</template>
