<script setup lang="ts">
import { InputOtp } from 'herouse'
import { ref } from 'vue'

const code = ref('')
const pin = ref('')
const formCode = ref('')
const invalid = ref(false)
const submitted = ref(false)
const completedValue = ref('')

function onSubmit() {
  if (formCode.value !== '123456') {
    invalid.value = true
    submitted.value = false
    return
  }
  invalid.value = false
  submitted.value = true
  formCode.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">InputOtp</h1>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Basic</h2>
      <InputOtp
        class="w-70"
        label="Verify account"
        description="We've sent a code to a****@gmail.com"
        :groups="[3, 3]"
      />
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Variants</h2>
      <InputOtp class="w-70" label="Primary" :groups="[3, 3]" default-value="12" />
      <InputOtp class="w-70" label="Secondary" variant="secondary" :groups="[3, 3]" default-value="12" />
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Disabled</h2>
      <InputOtp class="w-70" label="Verify account" :groups="[3, 3]" default-value="123" disabled />
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Four Digits</h2>
      <InputOtp v-model="pin" class="w-50" label="Enter PIN" :length="4" />
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Controlled</h2>
      <div class="flex w-70 flex-col gap-2">
        <InputOtp v-model="code" label="One-time code" :groups="[3, 3]" />
        <p class="text-sm text-muted">
          value "{{ code }}", length {{ code.length }}
        </p>
      </div>
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">On Complete</h2>
      <div class="flex w-70 flex-col gap-2">
        <InputOtp
          label="One-time code"
          :groups="[3, 3]"
          @complete="(value) => (completedValue = value)"
        />
        <p class="text-sm text-muted">
          completed: "{{ completedValue }}"
        </p>
      </div>
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">With Pattern</h2>
      <InputOtp class="w-70" label="Digits only" :groups="[3, 3]" pattern="digits" />
      <InputOtp class="w-70" label="Alphanumeric" :groups="[3, 3]" pattern="alphanumeric" />
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">With Validation</h2>
      <form class="flex w-70 flex-col gap-2" @submit.prevent="onSubmit">
        <InputOtp
          v-model="formCode"
          label="Verify account"
          description="Hint: the code is 123456"
          name="code"
          :groups="[3, 3]"
          :invalid="invalid"
          error-message="Invalid code. Please try again."
        />
        <button class="w-fit rounded-md bg-accent px-3 py-1.5 text-sm text-white disabled:opacity-50" :disabled="formCode.length !== 6" type="submit">
          Submit
        </button>
        <p v-if="submitted" class="text-sm text-success">
          Code verified successfully!
        </p>
      </form>
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Required / Invalid</h2>
      <InputOtp class="w-70" label="Verify account" :groups="[3, 3]" required />
      <InputOtp class="w-70" label="Verify account" :groups="[3, 3]" invalid error-message="That code is invalid" />
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Custom Styles</h2>
      <InputOtp
        class="w-70"
        label="Verify account"
        :groups="[3, 3]"
        default-value="12"
        :ui="{ slot: 'size-12 rounded-xl border-2 font-bold data-[active=true]:border-accent data-[active=true]:ring-2 data-[active=true]:ring-accent/30', separator: 'h-1 w-2 rounded-full bg-border-strong' }"
      />
    </section>
  </div>
</template>
