import { createRoot } from 'react-dom/client'
import { cases } from './cases'
import './main.css'

const id = decodeURIComponent(location.pathname.replace(/^\/parity\//, ''))
if (new URLSearchParams(location.search).get('theme') === 'dark')
  document.documentElement.classList.add('dark')

const render = cases[id]

createRoot(document.getElementById('root')!).render(
  render
    ? <div id="case" className="inline-block p-8">{render()}</div>
    : <p id="case-missing">Missing case {id}</p>,
)
