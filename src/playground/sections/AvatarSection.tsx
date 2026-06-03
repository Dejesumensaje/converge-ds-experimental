import * as React from 'react'
import { Avatar } from '../../components/ui'
import { ComponentHeader, SectionLabel, Row } from '../helpers'

export function AvatarSection() {
  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="avatar" title="Avatar" />

      <SectionLabel>With image</SectionLabel>
      <Row>
        {[1, 2, 3, 4, 5].map(i => (
          <Avatar key={i} src={`https://i.pravatar.cc/150?img=${i}`} alt={`User ${i}`} fallback={`U${i}`} />
        ))}
      </Row>

      <div style={{ marginTop: 24 }}>
        <SectionLabel>Fallback (initials)</SectionLabel>
        <Row>
          <Avatar fallback="AL" />
          <Avatar fallback="BM" />
          <Avatar fallback="CW" />
          <Avatar fallback="DP" />
        </Row>
      </div>
    </section>
  )
}
