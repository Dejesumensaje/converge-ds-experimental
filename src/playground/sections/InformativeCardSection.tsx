import * as React from 'react'
import { InformativeCard, Badge, Button } from '../../components/ui'
import { ComponentHeader } from '../helpers'

export function InformativeCardSection() {
  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="informativecard" title="InformativeCard" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-l)' }}>
        <InformativeCard
          category="Guide"
          title="Getting started with Converge"
          subtitle="Learn the basics in 5 minutes"
          tags={[<Badge key="new" tone="in-progress" size="sm">New</Badge>]}
          actions={<Button variant="primary" size="sm">Start guide</Button>}
        />
        <InformativeCard
          imageSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop"
          category="Tutorial"
          title="Advanced reporting features"
          subtitle="Build custom dashboards and share insights"
          actions={<Button variant="secondary" size="sm">Read more</Button>}
        />
      </div>
    </section>
  )
}
