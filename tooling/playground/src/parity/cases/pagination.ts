import type { VNode } from 'vue'
import { Pagination } from '@hareui/vue'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

cases['pagination-default'] = () => h(Pagination, { total: 3, class: 'w-[480px] justify-center' })
cases['pagination-sm'] = () => h(Pagination, { total: 3, size: 'sm', class: 'w-[480px] justify-center' })
cases['pagination-lg'] = () => h(Pagination, { total: 3, size: 'lg', class: 'w-[480px] justify-center' })
cases['pagination-ellipsis'] = () => h(Pagination, { total: 12, defaultPage: 6, ellipsis: true, class: 'w-[560px] justify-center' })
cases['pagination-summary'] = () => h(Pagination, { total: 10, defaultPage: 2, hidePages: true, prev: { label: 'Prev' }, class: 'w-[480px]' }, {
  summary: () => '6 to 10 of 50 invoices',
})
cases['pagination-icon-only'] = () => h(Pagination, { total: 3, defaultPage: 2, prev: { label: '' }, next: { label: '' }, class: 'w-[480px] justify-center' })
