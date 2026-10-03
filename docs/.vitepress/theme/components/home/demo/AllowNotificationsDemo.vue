<script setup lang="ts">
import { Description, Label, Switch } from '@hareui/vue'
</script>

<template>
  <div class="flex w-full justify-center">
    <!--
      HareUI renders the label slot after the control; `flex-row-reverse` puts the text column first, as in HeroUI.
      `font-normal`: the slot sits inside the content button (`font-medium`), HeroUI's sits outside it.
    -->
    <Switch :default-value="true" :ui="{ content: 'flex-row-reverse items-stretch gap-8 p-4 font-normal' }">
      <template #label>
        <div class="-mt-0.5 flex flex-col justify-start gap-1">
          <Label class="w-fit text-sm font-medium">Allow notifications</Label>
          <Description>Receive push notifications from HareUI</Description>
        </div>
      </template>
    </Switch>
  </div>
</template>
