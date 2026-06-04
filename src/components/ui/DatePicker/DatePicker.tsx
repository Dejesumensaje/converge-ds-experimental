import * as React from 'react'
import * as Popover from '@radix-ui/react-popover'
import { DayPicker, type Matcher, type DateRange } from 'react-day-picker'
import { format as dateFnsFormat } from 'date-fns'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../../lib/utils'

/* =================================================================
   Public types — re-export DateRange so consumers don't import rdp
   ================================================================= */

export type { DateRange }

type DatePickerBaseProps = {
  disabled?: boolean
  min?: Date
  max?: Date
  id?: string
  name?: string
  /** date-fns format string. Default: "MMM d, yyyy" → "Jun 4, 2026" */
  format?: string
  /** className applied to the outer wrapper div */
  className?: string
  placeholder?: string
}

type DatePickerSingleProps = DatePickerBaseProps & {
  mode?: 'single'
  value?: Date
  onChange?: (date: Date | undefined) => void
}

type DatePickerRangeProps = DatePickerBaseProps & {
  mode: 'range'
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps

/* =================================================================
   Shared internal class strings
   ================================================================= */

const NAV_BTN = cn(
  /* reset */
  'appearance-none border-0 m-0 bg-transparent box-border [font:inherit]',
  /* layout */
  'w-8 h-8 rounded-[var(--radius-m)] flex items-center justify-center',
  /* colors */
  'text-muted-foreground hover:text-foreground hover:bg-muted',
  /* interaction */
  'cursor-pointer transition-colors duration-100',
  /* focus */
  'outline-none focus-visible:ring-2',
  'focus-visible:ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]',
)

/*
 * Day button — handles all states for both single and range modes.
 * State is read from data-* attributes on the parent <td> (group target)
 * or from class markers added via classNames.range_middle.
 */
const DAY_BTN = cn(
  /* reset — §3.6 self-contained */
  'appearance-none border-0 m-0 bg-transparent box-border [font:inherit]',
  /* layout */
  'w-8 h-8 rounded-full flex items-center justify-center',
  /* typography */
  'body-body2-regular text-foreground',
  /* interaction */
  'cursor-pointer hover:bg-muted transition-colors duration-100',
  /* focus ring — --primary (green), allowed per §3.5 */
  'outline-none focus-visible:ring-2',
  'focus-visible:ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]',

  /* ── Single selected + range endpoints ──────────────────────── */
  /* data-selected="true" is set on <td> for both single and range start/end */
  'group-data-[selected=true]:bg-[var(--selection)]',
  'group-data-[selected=true]:text-[var(--selection-foreground)]',
  'group-data-[selected=true]:hover:bg-[var(--selection)]',

  /* ── Today — subtle ring, NOT green ────────────────────────── */
  'group-data-[today=true]:ring-1',
  'group-data-[today=true]:ring-[var(--neutral-gray3)]',
  'group-data-[today=true]:ring-offset-1',
  'group-data-[today=true]:ring-offset-background',

  /* ── Outside current month — dim ────────────────────────────── */
  'group-data-[outside=true]:opacity-30',

  /* ── Disabled — dim + block ─────────────────────────────────── */
  'group-data-[disabled=true]:opacity-30',
  'group-data-[disabled=true]:cursor-not-allowed',
  'group-data-[disabled=true]:pointer-events-none',

  /* ── Range middle — transparent (cell carries the tint) ──────── */
  'group-[.is-range-middle]:bg-transparent',
  'group-[.is-range-middle]:hover:bg-[color-mix(in_srgb,var(--foreground)_8%,transparent)]',
)

/* =================================================================
   Helpers
   ================================================================= */

function formatSingle(date: Date, fmt: string): string {
  return dateFnsFormat(date, fmt)
}

function formatRangeTrigger(
  range: DateRange | undefined,
  fmt: string,
  placeholder: string,
): string {
  if (!range?.from) return placeholder
  if (!range.to) return dateFnsFormat(range.from, fmt)
  // Compact: "Jun 4 – Jun 18, 2026" — from without year, to with full format
  return `${dateFnsFormat(range.from, 'MMM d')} – ${dateFnsFormat(range.to, fmt)}`
}

/* =================================================================
   Component
   ================================================================= */

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (props, ref) => {
    const {
      disabled = false,
      min,
      max,
      id: idProp,
      name,
      format = 'MMM d, yyyy',
      className,
    } = props

    const isRange = props.mode === 'range'

    const placeholder =
      props.placeholder ?? (isRange ? 'Select dates' : 'Select a date')

    const autoId = React.useId()
    const triggerId = idProp ?? autoId

    const [open, setOpen] = React.useState(false)
    const [hovered, setHovered] = React.useState(false)

    /* ── Derived "has value" ────────────────────────────────────── */
    const hasValue = isRange
      ? Boolean((props as DatePickerRangeProps).value?.from)
      : Boolean((props as DatePickerSingleProps).value)

    /* ── Trigger label ──────────────────────────────────────────── */
    const triggerLabel = isRange
      ? formatRangeTrigger((props as DatePickerRangeProps).value, format, placeholder)
      : hasValue
      ? formatSingle((props as DatePickerSingleProps).value!, format)
      : placeholder

    /* ── Ring class — mirrors Input ─────────────────────────────── */
    const getRingClass = () => {
      if (disabled) return 'ring-1 ring-[var(--neutral-gray3)]'
      if (open) return 'ring-2 ring-selection'
      if (hovered || hasValue) return 'ring-1 ring-[var(--neutral-dark)]'
      return 'ring-1 ring-[var(--neutral-gray4)]'
    }

    /* ── Disabled matchers ──────────────────────────────────────── */
    const disabledMatchers: Matcher[] = [
      ...(min ? [{ before: min }] : []),
      ...(max ? [{ after: max }] : []),
    ]

    /* ── classNames — Nav absolutely positioned so it spans 1 or 2 months */
    const dpClassNames = {
      root: '',
      /*
       * "relative" anchors the absolutely positioned Nav.
       * Range: "flex gap-xl" puts the two months side by side.
       * Single: block (no flex needed).
       */
      months: cn('relative', isRange && 'flex gap-[var(--spacing-xl)]'),
      /*
       * Nav is positioned to float above the month(s). It stays out of the
       * normal flow so months don't need to reserve space — they use pt-10.
       */
      nav: cn(
        'absolute top-0 inset-x-0 z-10',
        'flex items-center justify-between',
      ),
      button_previous: NAV_BTN,
      button_next: NAV_BTN,
      /* Month: flex-1 in range mode for equal-width columns. pt-10 clears nav. */
      month: cn('pt-10', isRange && 'flex-1'),
      /* Caption: label centered within its month column */
      month_caption: 'text-center mb-[var(--spacing-s)]',
      caption_label: 'body-body1-semibold text-foreground',
      month_grid: 'w-full border-collapse',
      weekdays: '',
      weekday:
        'w-8 h-8 text-center caption-caption text-muted-foreground font-normal',
      weeks: '',
      week: '',
      /*
       * Day cell (<td>) — "group" class enables group-data-[*]: variants
       * on the DayButton child.
       */
      day: 'group p-[2px] text-center',
      day_button: DAY_BTN,

      /* ── Modifier classes (applied on the <td> cell) ─────────── */
      /* selected/today/outside/disabled: read via data-* → no extra class needed */
      selected: '',
      today: '',
      outside: '',
      disabled: '',
      hidden: 'invisible',
      focused: '',

      /* Range endpoints: data-selected handles styling; class name for semantics */
      range_start: '',
      range_end: '',
      /*
       * Range middle: tinted cell background (the stripe).
       * "is-range-middle" marker lets DAY_BTN use group-[.is-range-middle]:*.
       */
      range_middle:
        'is-range-middle bg-[color-mix(in_srgb,var(--selection)_10%,transparent)]',

      /* Animation slots (unused — no animate prop) */
      weeks_before_enter: '',
      weeks_before_exit: '',
      weeks_after_enter: '',
      weeks_after_exit: '',
      caption_after_enter: '',
      caption_after_exit: '',
      caption_before_enter: '',
      caption_before_exit: '',
    }

    return (
      <div className={cn('inline-block w-full', className)}>
        <Popover.Root
          open={open}
          onOpenChange={(o) => { if (!disabled) setOpen(o) }}
        >
          {/* ── Trigger — same height/ring/padding as Input md ─── */}
          <Popover.Trigger asChild>
            <button
              ref={ref}
              type="button"
              id={triggerId}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-disabled={disabled || undefined}
              disabled={disabled}
              onMouseEnter={() => !disabled && setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className={cn(
                /* sizing */
                'relative h-12 w-full rounded-[var(--radius-m)] transition-all duration-150',
                /* reset */
                'appearance-none border-0 m-0 box-border [font:inherit]',
                /* colors */
                'bg-[var(--input-background)]',
                /* ring */
                getRingClass(),
                /* layout */
                'flex items-center text-left cursor-pointer',
                /* padding — room for icon */
                'pl-[var(--spacing-l)] pr-[44px]',
                disabled && 'opacity-40 cursor-not-allowed',
              )}
            >
              <span
                className={cn(
                  'body-body1-regular flex-1 truncate',
                  hasValue ? 'text-foreground' : 'text-[var(--muted-foreground)]',
                )}
              >
                {triggerLabel}
              </span>

              <span
                aria-hidden="true"
                className="absolute pointer-events-none"
                style={{
                  right: 'var(--spacing-l)',
                  color: disabled ? 'var(--text-disabled)' : 'var(--muted-foreground)',
                }}
              >
                <Calendar size={20} />
              </span>
            </button>
          </Popover.Trigger>

          {/* ── Calendar panel ────────────────────────────────────── */}
          <Popover.Portal>
            <Popover.Content
              side="bottom"
              align="start"
              sideOffset={4}
              onOpenAutoFocus={(e) => e.preventDefault()}
              className={cn(
                'z-50',
                'bg-background border border-border rounded-[var(--radius-l)] shadow-md',
                'p-[var(--spacing-m)]',
                'outline-none',
              )}
            >
              {isRange ? (
                <DayPicker
                  mode="range"
                  numberOfMonths={2}
                  selected={(props as DatePickerRangeProps).value}
                  onSelect={(selected) => {
                    ;(props as DatePickerRangeProps).onChange?.(selected)
                    if (selected?.from && selected?.to) setOpen(false)
                  }}
                  disabled={disabledMatchers.length > 0 ? disabledMatchers : undefined}
                  components={{
                    Chevron: ({ orientation }) =>
                      orientation === 'left'
                        ? <ChevronLeft size={16} aria-hidden="true" />
                        : <ChevronRight size={16} aria-hidden="true" />,
                  }}
                  classNames={dpClassNames}
                />
              ) : (
                <DayPicker
                  mode="single"
                  selected={(props as DatePickerSingleProps).value}
                  onSelect={(selected) => {
                    ;(props as DatePickerSingleProps).onChange?.(selected)
                    setOpen(false)
                  }}
                  disabled={disabledMatchers.length > 0 ? disabledMatchers : undefined}
                  components={{
                    Chevron: ({ orientation }) =>
                      orientation === 'left'
                        ? <ChevronLeft size={16} aria-hidden="true" />
                        : <ChevronRight size={16} aria-hidden="true" />,
                  }}
                  classNames={dpClassNames}
                />
              )}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {/* Hidden input for form submission — single mode only */}
        {name && !isRange && (
          <input
            type="hidden"
            name={name}
            value={
              (props as DatePickerSingleProps).value
                ? dateFnsFormat((props as DatePickerSingleProps).value!, 'yyyy-MM-dd')
                : ''
            }
          />
        )}
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'
