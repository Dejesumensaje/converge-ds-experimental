import * as React from 'react'
import { Badge } from '../../components/ui'
import { ComponentHeader, SectionLabel, Row } from '../helpers'

export function BadgeSection() {
  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="badge" title="Badge" />

      <SectionLabel>Tones</SectionLabel>
      <Row>
        <Badge tone="neutral">Neutral</Badge>
        <Badge tone="success">Success</Badge>
        <Badge tone="negative">Negative</Badge>
        <Badge tone="warning">Warning</Badge>
        <Badge tone="in-progress">In Progress</Badge>
      </Row>

      <div style={{ marginTop: 24 }}>
        <SectionLabel>Sizes</SectionLabel>
        <Row>
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </Row>
      </div>
    </section>
  )
}
