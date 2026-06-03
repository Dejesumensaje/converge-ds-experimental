import * as React from 'react'
import { ToggleGroup, type ToggleGroupOption } from '../../components/ui'
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { ComponentHeader, SectionLabel } from '../helpers'

const TOGGLE_ALIGN_OPTIONS: ToggleGroupOption[] = [
  { value: 'left',   label: 'Left',   icon: AlignLeft },
  { value: 'center', label: 'Center', icon: AlignCenter },
  { value: 'right',  label: 'Right',  icon: AlignRight },
]

const TOGGLE_TEXT_OPTIONS: ToggleGroupOption[] = [
  { value: 'day',   label: 'Day' },
  { value: 'week',  label: 'Week' },
  { value: 'month', label: 'Month' },
]

export function ToggleGroupSection() {
  const [toggleAlign,  setToggleAlign]  = React.useState('left')
  const [togglePeriod, setTogglePeriod] = React.useState('week')

  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="togglegroup" title="ToggleGroup" />

      <SectionLabel>Text options</SectionLabel>
      <ToggleGroup
        aria-label="Time period"
        options={TOGGLE_TEXT_OPTIONS}
        value={togglePeriod}
        onValueChange={setTogglePeriod}
      />

      <div style={{ marginTop: 24 }}>
        <SectionLabel>Icon-only</SectionLabel>
        <ToggleGroup
          aria-label="Text alignment"
          options={TOGGLE_ALIGN_OPTIONS}
          value={toggleAlign}
          onValueChange={setToggleAlign}
          iconOnly
        />
      </div>

      <div style={{ marginTop: 24 }}>
        <SectionLabel>Sizes</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ToggleGroup aria-label="sm" options={TOGGLE_TEXT_OPTIONS} value="day"  onValueChange={() => {}} size="sm" />
          <ToggleGroup aria-label="md" options={TOGGLE_TEXT_OPTIONS} value="week" onValueChange={() => {}} size="md" />
          <ToggleGroup aria-label="lg" options={TOGGLE_TEXT_OPTIONS} value="day"  onValueChange={() => {}} size="lg" />
        </div>
      </div>
    </section>
  )
}
