import { createRouter, createWebHistory } from 'vue-router'

const pages = import.meta.glob('./pages/*.vue')

export const pageNames = Object.keys(pages).map(p => p.slice('./pages/'.length, -'.vue'.length)).sort()

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: pageNames.length ? `/${pageNames[0]}` : '/' },
    { path: '/parity/:id', component: () => import('./parity/ParityCase.vue') },
    ...pageNames.map(name => ({ path: `/${name}`, name, component: pages[`./pages/${name}.vue`]! })),
  ],
})
