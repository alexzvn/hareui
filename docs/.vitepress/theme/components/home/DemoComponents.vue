<script setup lang="ts">
// Port of HeroUI docs `components/demo/index.tsx`.
import AlertDemo from './demo/AlertDemo.vue'
import AlertDialogDemo from './demo/AlertDialogDemo.vue'
import AllowNotificationsDemo from './demo/AllowNotificationsDemo.vue'
import AvatarGroupDemo from './demo/AvatarGroupDemo.vue'
import ButtonsDemo from './demo/ButtonsDemo.vue'
import InputOTPDemo from './demo/InputOTPDemo.vue'
import ListBoxDemo from './demo/ListBoxDemo.vue'
import LoginDemo from './demo/LoginDemo.vue'
import SelectDemo from './demo/SelectDemo.vue'
import SliderDemo from './demo/SliderDemo.vue'
import SubtleCardsDemo from './demo/SubtleCardsDemo.vue'
import TabsDemo1 from './demo/TabsDemo1.vue'
import TabsDemo2 from './demo/TabsDemo2.vue'
import TextfieldDemo from './demo/TextfieldDemo.vue'
import UIComponentsDemo from './demo/UIComponentsDemo.vue'
import XProfileDemo from './demo/XProfileDemo.vue'
</script>

<template>
  <div class="mx-auto grid w-fit grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-[auto_auto_auto]">
    <!-- Left -->
    <div class="order-2 flex max-w-[360px] flex-col items-center gap-10 md:order-1">
      <TextfieldDemo />
      <SelectDemo />
      <UIComponentsDemo />
      <SliderDemo />
      <TabsDemo1 />
      <TabsDemo2 />
      <ListBoxDemo />
    </div>
    <!-- Center -->
    <div class="order-1 flex max-w-[360px] flex-col items-center gap-10 md:order-2">
      <AvatarGroupDemo />
      <InputOTPDemo />
      <ButtonsDemo />
      <XProfileDemo />
      <AlertDemo />
      <AllowNotificationsDemo />
    </div>
    <!-- Right -->
    <div
      class="order-3 col-span-1 grid grid-cols-1 grid-rows-2 justify-items-center gap-5 self-start md:col-span-2 md:grid-cols-2 md:grid-rows-[auto_auto] lg:col-span-1 lg:max-w-[360px] lg:grid-cols-1"
    >
      <div class="row-span-2">
        <LoginDemo />
      </div>
      <div class="align-self-start w-full">
        <SubtleCardsDemo />
      </div>
      <AlertDialogDemo />
    </div>
  </div>
</template>
