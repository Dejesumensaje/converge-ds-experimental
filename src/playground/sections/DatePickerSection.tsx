import * as React from 'react'
import { DatePicker, type DateRange } from '../../components/ui'
import { ComponentHeader, SectionLabel } from '../helpers'

/*
 * Label pattern for RAC-based date fields:
 * Render a <label> with an id, then pass aria-labelledby to DatePicker.
 * htmlFor on a <label> only works with native form controls; RAC Group is a <div>.
 */
function FieldLabel({
  id,
  children,
  disabled,
}: {
  id: string
  children: React.ReactNode
  disabled?: boolean
}) {
  return (
    <label
      id={id}
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
  /* ── Single ─────────────────────────────────────────────────── */
  const [date1, setDate1] = React.useState<Date | undefined>(undefined)
  const [date2, setDate2] = React.useState<Date | undefined>(new Date(2026, 5, 15))

  const today = new Date()
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 0)
  const [date3, setDate3] = React.useState<Date | undefined>(undefined)

  /* ── Range ──────────────────────────────────────────────────── */
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

      {/* ── Single ────────────────────────────────────────────── */}
      <SectionLabel>Single</SectionLabel>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xl)',
          maxWidth: 320,
          marginBottom: 'var(--spacing-jumbo)',
        }}
      >
        <Field>
          <FieldLabel id="label-dp-empty">Ship date</FieldLabel>
          <DatePicker aria-labelledby="label-dp-empty" value={date1} onChange={setDate1} />
        </Field>

        <Field>
          <FieldLabel id="label-dp-value">Start date</FieldLabel>
          <DatePicker aria-labelledby="label-dp-value" value={date2} onChange={setDate2} />
        </Field>

        <Field>
          <FieldLabel id="label-dp-minmax">Delivery window</FieldLabel>
          <DatePicker
            aria-labelledby="label-dp-minmax"
            value={date3}
            onChange={setDate3}
            min={minDate}
            max={maxDate}
          />
        </Field>

        <Field>
          <FieldLabel id="label-dp-disabled" disabled>Locked date</FieldLabel>
          <DatePicker
            aria-labelledby="label-dp-disabled"
            value={new Date(2026, 0, 1)}
            onChange={() => {}}
            disabled
          />
        </Field>

        <Field>
          <FieldLabel id="label-dp-error">Required date</FieldLabel>
          <DatePicker
            aria-labelledby="label-dp-error"
            value={undefined}
            onChange={() => {}}
            error
          />
        </Field>
      </div>

      {/* ── Range ─────────────────────────────────────────────── */}
      <SectionLabel>Range</SectionLabel>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xl)',
          maxWidth: 560,
          marginBottom: 'var(--spacing-jumbo)',
        }}
      >
        <Field>
          <FieldLabel id="label-dp-range-empty">Campaign period</FieldLabel>
          <DatePicker
            mode="range"
            aria-labelledby="label-dp-range-empty"
            value={range1}
            onChange={setRange1}
          />
        </Field>

        <Field>
          <FieldLabel id="label-dp-range-full">Promotion window</FieldLabel>
          <DatePicker
            mode="range"
            aria-labelledby="label-dp-range-full"
            value={range2}
            onChange={setRange2}
          />
        </Field>

        <Field>
          <FieldLabel id="label-dp-range-partial">Event dates</FieldLabel>
          <DatePicker
            mode="range"
            aria-labelledby="label-dp-range-partial"
            value={range3}
            onChange={setRange3}
          />
        </Field>

        <Field>
          <FieldLabel id="label-dp-range-error">Required period</FieldLabel>
          <DatePicker
            mode="range"
            aria-labelledby="label-dp-range-error"
            value={undefined}
            onChange={() => {}}
            error
          />
        </Field>

        <Field>
          <FieldLabel id="label-dp-range-disabled" disabled>Locked period</FieldLabel>
          <DatePicker
            mode="range"
            aria-labelledby="label-dp-range-disabled"
            value={{ from: new Date(2026, 0, 10), to: new Date(2026, 0, 20) }}
            onChange={() => {}}
            disabled
          />
        </Field>
      </div>
    </section>
  )
}
