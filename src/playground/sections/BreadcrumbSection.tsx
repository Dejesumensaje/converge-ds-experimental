import * as React from 'react'
import { Breadcrumb, type BreadcrumbItem } from '../../components/ui'
import { ComponentHeader, SectionLabel } from '../helpers'

/* ---- Trail data ---- */

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

const ONCLICK_TRAIL: BreadcrumbItem[] = [
  { label: 'Dashboard',  onClick: () => alert('Dashboard clicked') },
  { label: 'Franchises', onClick: () => alert('Franchises clicked') },
  { label: 'Overview' },
]

/* ---------------------------------------------------------------- */

export function BreadcrumbSection() {
  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="breadcrumb" title="Breadcrumb" />

      {/* ---- variant="trail" ---- */}
      <SectionLabel>Trail — short (2 items)</SectionLabel>
      <Breadcrumb items={SHORT_TRAIL} />

      <div style={{ marginTop: 'var(--spacing-xxl)' }}>
        <SectionLabel>Trail — medium (3 items)</SectionLabel>
        <Breadcrumb items={MEDIUM_TRAIL} />
      </div>

      <div style={{ marginTop: 'var(--spacing-xxl)' }}>
        <SectionLabel>Trail — long (6 items)</SectionLabel>
        <Breadcrumb items={LONG_TRAIL} />
      </div>

      <div style={{ marginTop: 'var(--spacing-xxl)' }}>
        <SectionLabel>Trail — long, collapsed (maxItems=4)</SectionLabel>
        <Breadcrumb items={LONG_TRAIL} maxItems={4} />
      </div>

      <div style={{ marginTop: 'var(--spacing-xxl)' }}>
        <SectionLabel>Trail — onClick navigation (no hrefs)</SectionLabel>
        <Breadcrumb items={ONCLICK_TRAIL} />
      </div>

      {/* ---- variant="back" ---- */}
      <div style={{ marginTop: 'var(--spacing-xxxl)' }}>
        <SectionLabel>Back — with href</SectionLabel>
        <Breadcrumb variant="back" label="Back to scenarios" href="#" />
      </div>

      <div style={{ marginTop: 'var(--spacing-xxl)' }}>
        <SectionLabel>Back — with onClick</SectionLabel>
        <Breadcrumb
          variant="back"
          label="Back to forecast list"
          onClick={() => alert('Back clicked')}
        />
      </div>
    </section>
  )
}
