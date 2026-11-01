<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  Button,
  CheckboxGroup,
  Form,
  FormField,
  Input,
  NumberStepper,
  RadioGroup,
  Select,
  Switch,
  TextArea,
  TextField,
} from '@hareui/vue'
import type { FormError, FormInstance } from '@hareui/vue'

const sizes = ['sm', 'md', 'lg'] as const

const state = reactive<{ email?: string; bio?: string }>({})
const form = ref<FormInstance<never>>()

const validate = (s: typeof state): FormError[] => {
  const errors: FormError[] = []
  if (!s.email?.includes('@')) errors.push({ name: 'email', message: 'Enter an email address' })
  if (!s.bio) errors.push({ name: 'bio', message: 'Tell us something about you' })

  return errors
}

const setServerError = () => form.value?.setErrors([{ name: 'email', message: 'Already registered' }], 'email')
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">FormField</h1>

    <h2 class="text-lg font-semibold">Size × parts</h2>
    <div class="flex flex-wrap items-start gap-6">
      <FormField
        v-for="size in sizes"
        :key="size"
        class="w-64"
        :size="size"
        :label="`Label ${size}`"
        hint="Optional"
        description="Description under the label"
        help="Help below the control"
      >
        <TextField placeholder="TextField" full-width />
      </FormField>
    </div>

    <h2 class="text-lg font-semibold">States</h2>
    <div class="flex flex-wrap items-start gap-6">
      <FormField class="w-64" label="Required" required>
        <Input full-width />
      </FormField>
      <FormField class="w-64" label="Error message" error="Something went wrong" help="Hidden by the error">
        <Input full-width />
      </FormField>
      <FormField class="w-64" label="error = true" error help="No message">
        <Input full-width />
      </FormField>
      <FormField class="w-64" label="error = false" :error="false" help="Field validation hidden">
        <TextField invalid error-message="Not shown" full-width />
      </FormField>
      <FormField class="w-64" label="Own required" help="Field's required marks the label">
        <TextField required full-width />
      </FormField>
      <FormField class="w-64" description="No label: the field keeps its own">
        <TextField label="Field label" full-width />
      </FormField>
    </div>

    <h2 class="text-lg font-semibold">Controls</h2>
    <div class="flex flex-wrap items-start gap-6">
      <FormField class="w-64" label="TextArea" help="Bare TextArea">
        <TextArea full-width />
      </FormField>
      <FormField class="w-64" label="Select">
        <Select :items="[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]" />
      </FormField>
      <FormField class="w-64" label="RadioGroup" description="Named via aria-labelledby">
        <RadioGroup :items="[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]" />
      </FormField>
      <FormField class="w-64" label="CheckboxGroup" error="Pick one">
        <CheckboxGroup :items="[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]" />
      </FormField>
      <FormField class="w-64" label="Switch (size from field)" size="sm">
        <Switch label="Notifications" />
      </FormField>
      <FormField class="w-64" label="NumberStepper (size from field)" size="lg">
        <NumberStepper :default-value="2" />
      </FormField>
    </div>

    <h2 class="text-lg font-semibold">Slots</h2>
    <div class="flex flex-wrap items-start gap-6">
      <FormField class="w-64" error="Slot error">
        <template #label>Label <em>slot</em></template>
        <template #hint>hint slot</template>
        <template #description>description slot</template>
        <template #default="{ id, describedBy, invalid }">
          <input :id="id" :aria-describedby="describedBy" :aria-invalid="invalid || undefined" class="rounded-field border border-border px-2 py-1" />
        </template>
        <template #error="{ error }">⚠ {{ error }}</template>
      </FormField>
      <FormField class="w-64" label=":ui override" hint="accent hint" :ui="{ hint: 'text-accent', label: 'font-bold' }">
        <Input full-width />
      </FormField>
    </div>

    <h2 class="text-lg font-semibold">With a Form</h2>
    <Form ref="form" class="flex w-80 flex-col gap-4" :state="state" :validate="validate" @submit="() => {}">
      <FormField label="Email" name="email" help="Validated by the form">
        <TextField v-model="state.email" full-width />
      </FormField>
      <FormField label="Bio" name="bio" eager-validation>
        <TextArea v-model="state.bio" full-width />
      </FormField>
      <div class="flex gap-2">
        <Button type="submit">Submit</Button>
        <Button variant="secondary" @click="setServerError">Set server error</Button>
      </div>
    </Form>
  </div>
</template>
