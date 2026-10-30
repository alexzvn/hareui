import { createHareUI } from '@hareui/vue'
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './main.css'

// No theme overrides: the playground must render the default theme (config precedence is covered by test/theme/ui.spec.ts).
createApp(App)
  .use(router)
  .use(createHareUI())
  .mount('#app')
