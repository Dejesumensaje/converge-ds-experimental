import * as React from 'react'
import { DatePicker } from '../../components/ui'
import { ComponentHeader, SectionLabel } from '../helpers'

export function DatePickerSection() {
  const [date1, setDate1] = React.useState<Date | undefined>(undefined)
  const [date2, setDate2] = React.useState<Date | undefined>(new Date(2026, 5, 15)) // Jun 15 2026
  const [date3, setDate3] = React.useState<Date | undefined>(undefined)

  const today = new Date()
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 0) // end of +2 months

  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="datepicker" title="DatePicker" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)', maxWidth: 320 }}>

        {/* No value — placeholder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xxs)' }}>
          <label htmlFor="dp-empty" className="input-inputlabel text-muted-foreground">
            Ship date
          </label>
          <DatePicker
            id="dp-empty"
            value={date1}
            onChange={setDate1}
            placeholder="Select a date"
          />
        </div>

        {/* With pre-selected value */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xxs)' }}>
          <label htmlFor="dp-value" className="input-inputlabel text-muted-foreground">
            Start date
          </label>
          <DatePicker
            id="dp-value"
            value={date2}
            onChange={setDate2}
          />
        </div>

        {/* Min / Max range — today to end of next 2 months */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xxs)' }}>
          <label htmlFor="dp-range" className="input-inputlabel text-muted-foreground">
            Delivery window
          </label>
          <DatePicker
            id="dp-range"
            value={date3}
            onChange={setDate3}
            min={minDate}
            max={maxDate}
            placeholder="Select within next 60 days"
          />
        </div>

        {/* Disabled */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xxs)' }}>
          <label htmlFor="dp-disabled" className="input-inputlabel" style={{ color: 'var(--text-disabled)' }}>
            Locked date
          </label>
          <DatePicker
            id="dp-disabled"
            value={new Date(2026, 0, 1)}
            onChange={() => {}}
            disabled
          />
        </div>

      </div>
    </section>
  )
}
