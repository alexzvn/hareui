<script setup lang="ts">
import { Button, toast } from 'herouse'

function uploadFile(): Promise<{ filename: string, size: number }> {
  const { promise, resolve } = Promise.withResolvers<{ filename: string, size: number }>()
  setTimeout(() => resolve({ filename: 'document.pdf', size: 1024 }), 2000)
  return promise
}

function createEvent(): Promise<never> {
  const { promise, reject } = Promise.withResolvers<never>()
  setTimeout(() => reject(new Error('Network error. Please try again.')), 2000)
  return promise
}

function saveData(): Promise<{ count: number }> {
  const { promise, resolve, reject } = Promise.withResolvers<{ count: number }>()
  setTimeout(() => {
    if (Math.random() > 0.5)
      resolve({ count: 42 })
    else
      reject(new Error('Failed to save data'))
  }, 2000)
  return promise
}

function fetchUser(): Promise<{ name: string, email: string }> {
  const { promise, resolve } = Promise.withResolvers<{ name: string, email: string }>()
  setTimeout(() => resolve({ email: 'john@example.com', name: 'John Doe' }), 2000)
  return promise
}

function uploadWithLoading() {
  const loadingId = toast('Uploading file...', { description: 'Please wait while we upload your file', isLoading: true, timeout: 0 })
  setTimeout(() => {
    toast.update(loadingId, 'File uploaded', { description: 'Your file has been uploaded successfully', variant: 'success' })
  }, 3000)
}

function paymentProcessing() {
  const loadingId = toast('Processing payment...', { isLoading: true, timeout: 0 })
  setTimeout(() => {
    toast.update(loadingId, 'Payment processed', { description: 'Your payment has been processed successfully', variant: 'success' })
  }, 2500)
}

function loadingToError() {
  const loadingId = toast('Saving changes...', { isLoading: true, timeout: 0 })
  setTimeout(() => {
    toast.update(loadingId, 'Failed to save', { description: 'Please try again', variant: 'danger' })
  }, 2000)
}
</script>

<template>
  <div class="flex h-full max-w-2xl flex-col items-center justify-center gap-8">
    <div class="w-full space-y-3">
      <div class="text-center">
        <h3 class="text-sm font-medium">
          Using toast.promise()
        </h3>
        <p class="text-xs text-muted">
          Automatically handles loading, success, and error states
        </p>
      </div>
      <div class="flex w-full flex-wrap items-center justify-center gap-4">
        <Button
          size="sm"
          variant="secondary"
          @click="toast.promise(uploadFile(), {
            loading: 'Uploading file...',
            success: data => `File ${data.filename} uploaded (${data.size}KB)`,
            error: 'Failed to upload file',
          })"
        >
          Upload file
        </Button>
        <Button
          size="sm"
          variant="secondary"
          @click="toast.promise(createEvent(), {
            loading: 'Creating event...',
            success: 'Event created',
            error: err => err.message,
          })"
        >
          Create event (error)
        </Button>
        <Button
          size="sm"
          variant="secondary"
          @click="toast.promise(saveData(), {
            loading: 'Saving changes...',
            success: data => `Saved ${data.count} items`,
            error: err => err.message,
          })"
        >
          Save data (random)
        </Button>
        <Button
          size="sm"
          variant="secondary"
          @click="toast.promise(fetchUser(), {
            loading: 'Loading user...',
            success: data => `Welcome back, ${data.name}!`,
            error: 'Failed to fetch user',
          })"
        >
          Fetch user
        </Button>
      </div>
    </div>

    <div class="w-full space-y-3">
      <div class="text-center">
        <h3 class="text-sm font-medium">
          Manual Loading State
        </h3>
        <p class="text-xs text-muted">
          Manually control loading state with isLoading prop
        </p>
      </div>
      <div class="flex w-full flex-wrap items-center justify-center gap-4">
        <Button size="sm" variant="secondary" @click="uploadWithLoading">
          Upload with loading
        </Button>
        <Button size="sm" variant="secondary" @click="paymentProcessing">
          Payment processing
        </Button>
        <Button size="sm" variant="secondary" @click="loadingToError">
          Loading to error
        </Button>
      </div>
    </div>
  </div>
</template>
