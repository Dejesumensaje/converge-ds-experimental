import * as React from 'react'
import { Select, type SelectOption } from '../../components/ui'
import { ComponentHeader } from '../helpers'

const FRUIT_OPTIONS: SelectOption[] = [
  { value: 'apple',      label: 'Apple' },
  { value: 'banana',     label: 'Banana' },
  { value: 'cherry',     label: 'Cherry' },
  { value: 'durian',     label: 'Durian' },
  { value: 'elderberry', label: 'Elderberry' },
]

export function SelectSection() {
  const [selectSingle, setSelectSingle] = React.useState('')
  const [selectMulti,  setSelectMulti]  = React.useState<string[]>([])

  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="select" title="Select" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)', maxWidth: 360 }}>
        <Select
          label="Single select"
          options={FRUIT_OPTIONS}
          value={selectSingle}
          onChange={v => setSelectSingle(v as string)}
        />
        <Select
          label="Multi select"
          options={FRUIT_OPTIONS}
          value={selectMulti}
          onChange={v => setSelectMulti(v as string[])}
          multiple
          searchable
          helperText="Choose all that apply."
        />
        <Select
          label="Error state"
          options={FRUIT_OPTIONS}
          value=""
          onChange={() => {}}
          error
          errorMessage="Please select an option."
        />
        <Select
          label="Disabled"
          options={FRUIT_OPTIONS}
          value="apple"
          onChange={() => {}}
          disabled
        />
      </div>
    </section>
  )
}
