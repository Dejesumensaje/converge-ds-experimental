import * as React from 'react'
import { Dot } from '../../components/ui'
import { ComponentHeader, SectionLabel, Row } from '../helpers'

export function DotSection() {
  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="dot" title="Dot" />

      <SectionLabel>Tones × Sizes</SectionLabel>
      <Row>
        {(['neutral', 'success', 'negative', 'warning', 'in-progress'] as const).map(tone => (
          <div key={tone} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            {(['sm', 'md', 'lg'] as const).map(size => (
              <Dot key={size} tone={tone} size={size} />
            ))}
            <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{tone}</span>
          </div>
        ))}
      </Row>
    </section>
  )
}
