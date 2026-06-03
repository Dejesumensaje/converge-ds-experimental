import * as React from 'react'
import { Button } from '../../components/ui'
import { Plus, Download, Edit3, Trash2 } from 'lucide-react'
import { ComponentHeader, SectionLabel, Row } from '../helpers'

export function ButtonSection() {
  const [btnPressed, setBtnPressed] = React.useState(false)
  const [btnLoading, setBtnLoading] = React.useState(false)

  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="button" title="Button" />

      <SectionLabel>Variants</SectionLabel>
      <Row>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="text-link">Text link</Button>
      </Row>

      <div style={{ marginTop: 24 }}>
        <SectionLabel>Sizes</SectionLabel>
        <Row>
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="sm">Small</Button>
        </Row>
      </div>

      <div style={{ marginTop: 24 }}>
        <SectionLabel>Icons</SectionLabel>
        <Row>
          <Button variant="primary" iconLeft={Plus}>Add item</Button>
          <Button variant="secondary" iconRight={Download}>Export</Button>
          <Button variant="tertiary" iconLeft={Edit3}>Edit</Button>
          <Button variant="primary" aria-label="Delete" iconLeft={Trash2} />
        </Row>
      </div>

      <div style={{ marginTop: 24 }}>
        <SectionLabel>States</SectionLabel>
        <Row>
          <Button
            variant="primary"
            loading={btnLoading}
            onClick={() => { setBtnLoading(true); setTimeout(() => setBtnLoading(false), 2000) }}
          >
            {btnLoading ? 'Loading…' : 'Click to load'}
          </Button>
          <Button variant="secondary" pressed={btnPressed} onClick={() => setBtnPressed(p => !p)}>
            {btnPressed ? 'Pressed' : 'Toggle'}
          </Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="primary" error>Error</Button>
        </Row>
      </div>

      <div style={{ marginTop: 24 }}>
        <SectionLabel>Glass (secondary + glass prop)</SectionLabel>
        <div
          style={{
            background: 'linear-gradient(135deg, #1a6b3a 0%, #26890d 50%, #4caf50 100%)',
            borderRadius: 12,
            padding: 24,
            display: 'flex',
            gap: 12,
          }}
        >
          <Button variant="secondary" glass>Glass button</Button>
          <Button variant="secondary" glass iconLeft={Plus}>Add item</Button>
        </div>
      </div>
    </section>
  )
}
