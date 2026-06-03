import * as React from 'react'
import { CountBadge } from '../../components/ui'
import { ComponentHeader, SectionLabel, Row } from '../helpers'

export function CountBadgeSection() {
  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="countbadge" title="CountBadge" />

      <SectionLabel>Tones</SectionLabel>
      <Row>
        <CountBadge count={4}  tone="neutral" />
        <CountBadge count={12} tone="success" />
        <CountBadge count={3}  tone="negative" />
        <CountBadge count={7}  tone="warning" />
        <CountBadge count={99} tone="in-progress" />
      </Row>

      <div style={{ marginTop: 24 }}>
        <SectionLabel>Trend</SectionLabel>
        <Row>
          <CountBadge count={24} trend="up" />
          <CountBadge count={8}  trend="down" />
        </Row>
      </div>
    </section>
  )
}
