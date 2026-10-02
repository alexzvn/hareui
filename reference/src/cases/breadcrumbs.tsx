import type { ReactElement } from 'react'
import { Breadcrumbs } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

const three = [
  <Breadcrumbs.Item key="home" href="#">Home</Breadcrumbs.Item>,
  <Breadcrumbs.Item key="products" href="#">Products</Breadcrumbs.Item>,
  <Breadcrumbs.Item key="laptop">Laptop</Breadcrumbs.Item>,
]

cases['breadcrumbs-default'] = () => <Breadcrumbs>{three}</Breadcrumbs>
cases['breadcrumbs-two-levels'] = () => (
  <Breadcrumbs>
    <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
    <Breadcrumbs.Item>Current Page</Breadcrumbs.Item>
  </Breadcrumbs>
)
cases['breadcrumbs-disabled'] = () => <Breadcrumbs isDisabled>{three}</Breadcrumbs>
cases['breadcrumbs-custom-separator'] = () => (
  <Breadcrumbs separator={<svg fill="currentColor" viewBox="0 0 16 16"><circle cx="8" cy="8" r="3" /></svg>}>{three}</Breadcrumbs>
)
