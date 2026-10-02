<script setup lang="ts">
import { Separator, Surface } from 'herouse'
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-xl font-semibold">Separator</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Horizontal</h2>
      <div class="max-w-md">
        <div class="space-y-1">
          <h4 class="text-medium font-medium">HeroUse Components</h4>
          <p class="text-small text-default-400">Beautiful, fast and modern Vue UI library.</p>
        </div>
        <Separator class="my-4" />
        <div class="text-small flex h-5 items-center space-x-4">
          <div>Blog</div>
          <Separator orientation="vertical" />
          <div>Docs</div>
          <Separator orientation="vertical" />
          <div>Source</div>
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Variants</h2>
      <div class="flex max-w-md flex-col items-center gap-3">
        <div>Default Variant</div>
        <Separator variant="default" />
        <div>Secondary Variant</div>
        <Separator variant="secondary" />
        <div>Tertiary Variant</div>
        <Separator variant="tertiary" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Vertical</h2>
      <div class="text-small flex h-5 items-center space-x-4">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">With Surface</h2>
      <div class="flex flex-col gap-4">
        <Surface class="flex min-w-[320px] flex-col gap-3 rounded-3xl p-6" variant="default">
          <h3 class="text-base font-semibold text-foreground">Default Surface</h3>
          <Separator />
          <p class="text-sm text-muted">Surface Content</p>
        </Surface>
        <Surface class="flex min-w-[320px] flex-col gap-3 rounded-3xl p-6" variant="secondary">
          <h3 class="text-base font-semibold text-foreground">Secondary Surface</h3>
          <Separator variant="secondary" />
          <p class="text-sm text-muted">Surface Content</p>
        </Surface>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override</h2>
      <div class="max-w-xs space-y-4">
        <p class="text-sm font-medium text-foreground">Account settings</p>
        <Separator class="bg-separator-secondary" />
        <div class="flex items-center gap-3 text-sm text-muted">
          <span>Profile</span>
          <Separator class="h-4 bg-separator" orientation="vertical" />
          <span>Billing</span>
          <Separator class="h-4 bg-separator" orientation="vertical" />
          <span>Security</span>
        </div>
      </div>
    </section>
  </div>
</template>
