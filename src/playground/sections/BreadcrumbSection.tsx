import * as React from 'react'
import { Breadcrumb, type BreadcrumbItem } from '../../components/ui'
import { ComponentHeader, SectionLabel } from '../helpers'

/* ---- Data ---- */

const SHORT_TRAIL: BreadcrumbItem[] = [
  { label: 'Home', href: '#' },
  { label: 'Analytics' },
]

const MEDIUM_TRAIL: BreadcrumbItem[] = [
  { label: 'Home', href: '#' },
  { label: 'Reports', href: '#' },
  { label: 'Q1 2026' },
]

const LONG_TRAIL: BreadcrumbItem[] = [
  { label: 'Home', href: '#' },
  { label: 'Retail',        href: '#' },
  { label: 'North America', href: '#' },
  { label: 'US East',       href: '#' },
  { label: 'New York',      href: '#' },
  { label: 'Store #142' },
]

/* onClick variant — no hrefs, all navigation via callbacks */
const ONCLICK_TRAIL: BreadcrumbItem[] = [
  { label: 'Dashboard',  onClick: () => alert('Home clicked') },
  { label: 'Franchises', onClick: () => alert('Franchises clicked') },
  { label: 'Overview' },
]

/* ---------------------------------------------------------------- */

export function BreadcrumbSection() {
  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="breadcrumb" title="Breadcrumb" />

      <SectionLabel>Short trail (2 items)</SectionLabel>
      <Breadcrumb items={SHORT_TRAIL} />

      <div style={{ marginTop: 'var(--spacing-xxl)' }}>
        <SectionLabel>Medium trail (3 items)</SectionLabel>
        <Breadcrumb items={MEDIUM_TRAIL} />
      </div>

      <div style={{ marginTop: 'var(--spacing-xxl)' }}>
        <SectionLabel>Long trail (6 items)</SectionLabel>
        <Breadcrumb items={LONG_TRAIL} />
      </div>

      <div style={{ marginTop: 'var(--spacing-xxl)' }}>
        <SectionLabel>Long trail — collapsed to 4 visible (maxItems=4)</SectionLabel>
        <Breadcrumb items={LONG_TRAIL} maxItems={4} />
      </div>

      <div style={{ marginTop: 'var(--spacing-xxl)' }}>
        <SectionLabel>onClick navigation (no hrefs)</SectionLabel>
        <Breadcrumb items={ONCLICK_TRAIL} />
      </div>
    </section>
  )
}
