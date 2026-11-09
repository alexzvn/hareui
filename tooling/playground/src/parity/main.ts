import { createHareUI } from '@hareui/vue'
import { createApp } from 'vue'
import ParityCase from './ParityCase.vue'
import '../main.css'

// Parity-only entry (parity.html): no router or playground pages, so `vite build --mode parity` emits a
// small bundle that compare.ts can reload thousands of times cheaply.
createApp(ParityCase)
  .use(createHareUI())
  .mount('#app')
