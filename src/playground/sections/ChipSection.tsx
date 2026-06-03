import * as React from 'react'
import { Chip } from '../../components/ui'
import { Star } from 'lucide-react'
import { ComponentHeader, SectionLabel, Row } from '../helpers'

export function ChipSection() {
  const [chipSelected, setChipSelected] = React.useState<string[]>(['react'])

  const chipToggle = (val: string) =>
    setChipSelected(prev =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    )

  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="chip" title="Chip" />

      <SectionLabel>Interactive (multi-select)</SectionLabel>
      <Row>
        {(['react', 'vue', 'angular', 'svelte'] as const).map(tag => (
          <Chip key={tag} selected={chipSelected.includes(tag)} onClick={() => chipToggle(tag)}>
            {tag}
          </Chip>
        ))}
      </Row>

      <div style={{ marginTop: 24 }}>
        <SectionLabel>Dismissible</SectionLabel>
        <Row>
          <Chip onClose={() => {}}>React</Chip>
          <Chip onClose={() => {}}>TypeScript</Chip>
          <Chip onClose={() => {}} icon={Star}>Favorites</Chip>
        </Row>
      </div>

      <div style={{ marginTop: 24 }}>
        <SectionLabel>Sizes</SectionLabel>
        <Row>
          <Chip size="sm">Small</Chip>
          <Chip size="md">Medium</Chip>
          <Chip size="lg">Large</Chip>
        </Row>
      </div>
    </section>
  )
}
