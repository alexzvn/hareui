import type { ReactElement, ReactNode } from 'react'
import { Pagination } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

type Opts = {
  page?: number
  pages?: (number | 'ellipsis')[]
  size?: 'sm' | 'md' | 'lg'
  className?: string
  prev?: string
  next?: string
  last?: number
  summary?: ReactNode
}

const render = ({ page = 1, pages = [1, 2, 3], size, className = 'w-[480px] justify-center', prev = 'Previous', next = 'Next', last = 3, summary }: Opts = {}) => (
  <Pagination className={className} size={size}>
    {summary ? <Pagination.Summary>{summary}</Pagination.Summary> : null}
    <Pagination.Content>
      <Pagination.Item>
        <Pagination.Previous aria-label={prev ? undefined : 'Previous page'} isDisabled={page === 1}>
          <Pagination.PreviousIcon />
          {prev ? <span>{prev}</span> : null}
        </Pagination.Previous>
      </Pagination.Item>
      {pages.map((p, i) => (
        <Pagination.Item key={p === 'ellipsis' ? `e${i}` : p}>
          {p === 'ellipsis' ? <Pagination.Ellipsis /> : <Pagination.Link isActive={p === page}>{p}</Pagination.Link>}
        </Pagination.Item>
      ))}
      <Pagination.Item>
        <Pagination.Next aria-label={next ? undefined : 'Next page'} isDisabled={page === last}>
          {next ? <span>{next}</span> : null}
          <Pagination.NextIcon />
        </Pagination.Next>
      </Pagination.Item>
    </Pagination.Content>
  </Pagination>
)

cases['pagination-default'] = () => render()
cases['pagination-sm'] = () => render({ size: 'sm' })
cases['pagination-lg'] = () => render({ size: 'lg' })
cases['pagination-ellipsis'] = () => render({ page: 6, pages: [1, 'ellipsis', 5, 6, 7, 'ellipsis', 12], last: 12, className: 'w-[560px] justify-center' })
cases['pagination-summary'] = () => render({ page: 2, pages: [], last: 10, prev: 'Prev', className: 'w-[480px]', summary: '6 to 10 of 50 invoices' })
cases['pagination-icon-only'] = () => render({ page: 2, prev: '', next: '' })
