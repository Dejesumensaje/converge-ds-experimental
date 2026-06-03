import * as React from 'react'
import { Tooltip, Avatar, Badge, Button } from '../../components/ui'
import { ComponentHeader, SectionLabel, Row } from '../helpers'

export function TooltipSection() {
  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="tooltip" title="Tooltip" />

      <SectionLabel>Sides</SectionLabel>
      <Row>
        <Tooltip content="Shows on top"    side="top">
          <Button variant="secondary" size="sm">Top</Button>
        </Tooltip>
        <Tooltip content="Shows on right"  side="right">
          <Button variant="secondary" size="sm">Right</Button>
        </Tooltip>
        <Tooltip content="Shows on bottom" side="bottom">
          <Button variant="secondary" size="sm">Bottom</Button>
        </Tooltip>
        <Tooltip content="Shows on left"   side="left">
          <Button variant="secondary" size="sm">Left</Button>
        </Tooltip>
      </Row>

      <div style={{ marginTop: 24 }}>
        <SectionLabel>On non-button elements</SectionLabel>
        <Row>
          <Tooltip content="User: Alice Johnson">
            <Avatar fallback="AJ" src="https://i.pravatar.cc/150?img=5" />
          </Tooltip>
          <Tooltip content="This badge indicates completed status">
            <Badge tone="success">Completed</Badge>
          </Tooltip>
        </Row>
      </div>
    </section>
  )
}
