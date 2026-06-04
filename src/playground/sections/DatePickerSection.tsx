import * as React from 'react'
import { DatePicker, type DateRange } from '../../components/ui'
import { ComponentHeader, SectionLabel } from '../helpers'

/* ── Shared label wrapper ────────────────────────────────────────── */
function FieldLabel({
  htmlFor,
  children,
  disabled,
}: {
  htmlFor: string
  children: React.ReactNode
  disabled?: boolean
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="input-inputlabel"
      style={{ color: disabled ? 'var(--text-disabled)' : 'var(--muted-foreground)' }}
    >
      {children}
    </label>
  )
}

function Field({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xxs)' }}>
      {children}
    </div>
  )
}

export function DatePickerSection() {
  /* ── Single mode state ───────────────────────────────────────── */
  const [date1, setDate1] = React.useState<Date | undefined>(undefined)
  const [date2, setDate2] = React.useState<Date | undefined>(new Date(2026, 5, 15))

  const today = new Date()
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 0)

  const [date3, setDate3] = React.useState<Date | undefined>(undefined)

  /* ── Range mode state ────────────────────────────────────────── */
  const [range1, setRange1] = React.useState<DateRange | undefined>(undefined)
  const [range2, setRange2] = React.useState<DateRange | undefined>({
    from: new Date(2026, 5, 8),
    to: new Date(2026, 5, 19),
  })
  const [range3, setRange3] = React.useState<DateRange | undefined>({
    from: new Date(2026, 5, 10),
    to: undefined,
  })

  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="datepicker" title="DatePicker" />

      {/* ── Single ──────────────────────────────────────────────── */}
      <SectionLabel>Single</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)', maxWidth: 320, marginBottom: 'var(--spacing-jumbo)' }}>
        <Field>
          <FieldLabel htmlFor="dp-empty">Ship date</FieldLabel>
          <DatePicker id="dp-empty" value={date1} onChange={setDate1} />
        </Field>

        <Field>
          <FieldLabel htmlFor="dp-value">Start date</FieldLabel>
          <DatePicker id="dp-value" value={date2} onChange={setDate2} />
        </Field>

        <Field>
          <FieldLabel htmlFor="dp-minmax">Delivery window</FieldLabel>
          <DatePicker
            id="dp-minmax"
            value={date3}
            onChange={setDate3}
            min={minDate}
            max={maxDate}
            placeholder="Select within next 60 days"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="dp-disabled" disabled>Locked date</FieldLabel>
          <DatePicker
            id="dp-disabled"
            value={new Date(2026, 0, 1)}
            onChange={() => {}}
            disabled
          />
        </Field>
      </div>

      {/* ── Range ───────────────────────────────────────────────── */}
      <SectionLabel>Range</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)', maxWidth: 600, marginBottom: 'var(--spacing-jumbo)' }}>
        {/* Empty — shows placeholder */}
        <Field>
          <FieldLabel htmlFor="dp-range-empty">Campaign period</FieldLabel>
          <DatePicker
            mode="range"
            id="dp-range-empty"
            value={range1}
            onChange={setRange1}
          />
        </Field>

        {/* Full range — from + to */}
        <Field>
          <FieldLabel htmlFor="dp-range-full">Promotion window</FieldLabel>
          <DatePicker
            mode="range"
            id="dp-range-full"
            value={range2}
            onChange={setRange2}
          />
        </Field>

        {/* Partial — only from, no to yet */}
        <Field>
          <FieldLabel htmlFor="dp-range-partial">Event dates</FieldLabel>
          <DatePicker
            mode="range"
            id="dp-range-partial"
            value={range3}
            onChange={setRange3}
          />
        </Field>
      </div>
    </section>
  )
}
