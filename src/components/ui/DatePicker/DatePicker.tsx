import * as React from 'react'
import * as Popover from '@radix-ui/react-popover'
import { DayPicker, type Matcher, type DateRange } from 'react-day-picker'
import { format as dateFnsFormat, isSameDay } from 'date-fns'
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '../../../lib/utils'

/* =================================================================
   Public types — re-export DateRange so consumers skip rdp import
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
   Responsive hook — collapses to 1 month below breakpoint
   ================================================================= */

const RANGE_BREAKPOINT = 640 // px

function useIsNarrow(bp = RANGE_BREAKPOINT): boolean {
  const getMatch = () =>
    typeof window !== 'undefined' && window.innerWidth < bp
  const [narrow, setNarrow] = React.useState(getMatch)
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${bp - 1}px)`)
    setNarrow(mq.matches)
    const handler = (e: MediaQueryListEvent) => setNarrow(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [bp])
  return narrow
}

/* =================================================================
   Day-button class factory — size adapts for touch targets
   =================================================================
   Desktop: 32×32px (w-8 h-8)
   Touch/narrow: 44×44px (w-11 h-11) — WCAG 2.2 SC 2.5.8
   ================================================================= */

function makeDayBtnClass(isNarrow: boolean): string {
  const sz = isNarrow ? 'w-11 h-11' : 'w-8 h-8'
  return cn(
    /* reset */
    'appearance-none border-0 m-0 bg-transparent box-border [font:inherit]',
    /* layout */
    sz, 'rounded-full flex items-center justify-center',
    /* typography */
    'body-body2-regular text-foreground',
    /* interaction */
    'cursor-pointer hover:bg-muted transition-colors duration-100',
    /* focus ring — --primary (green), allowed §3.5 */
    'outline-none focus-visible:ring-2',
    'focus-visible:ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]',

    /* ── selected / range endpoints ──────────────────────────── */
    'group-data-[selected=true]:bg-[var(--selection)]',
    'group-data-[selected=true]:text-[var(--selection-foreground)]',
    'group-data-[selected=true]:hover:bg-[var(--selection)]',

    /* ── today — subtle ring, never green ────────────────────── */
    'group-data-[today=true]:ring-1',
    'group-data-[today=true]:ring-[var(--neutral-gray3)]',
    'group-data-[today=true]:ring-offset-1',
    'group-data-[today=true]:ring-offset-background',

    /* ── outside month ───────────────────────────────────────── */
    'group-data-[outside=true]:opacity-30',

    /* ── disabled ────────────────────────────────────────────── */
    'group-data-[disabled=true]:opacity-30',
    'group-data-[disabled=true]:cursor-not-allowed',
    'group-data-[disabled=true]:pointer-events-none',

    /* ── range middle — cell carries the tint ────────────────── */
    'group-[.is-range-middle]:bg-transparent',
    'group-[.is-range-middle]:hover:bg-[color-mix(in_srgb,var(--foreground)_8%,transparent)]',

    /* ── hover preview middle ────────────────────────────────── */
    'group-[.is-preview-middle]:bg-transparent',
    'group-[.is-preview-middle]:hover:bg-[color-mix(in_srgb,var(--foreground)_8%,transparent)]',

    /* ── hover preview endpoint (lighter than actual selection) ─ */
    'group-[.is-preview-end]:bg-[color-mix(in_srgb,var(--selection)_20%,transparent)]',
    'group-[.is-preview-end]:text-foreground',
    'group-[.is-preview-end]:hover:bg-[color-mix(in_srgb,var(--selection)_30%,transparent)]',
  )
}

const NAV_BTN = cn(
  'appearance-none border-0 m-0 bg-transparent box-border [font:inherit]',
  'w-8 h-8 rounded-[var(--radius-m)] flex items-center justify-center',
  'text-muted-foreground hover:text-foreground hover:bg-muted',
  'cursor-pointer transition-colors duration-100',
  'outline-none focus-visible:ring-2',
  'focus-visible:ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]',
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
    const placeholder = props.placeholder ?? (isRange ? 'Select dates' : 'Select a date')

    const autoId = React.useId()
    const triggerId = idProp ?? autoId

    const [open, setOpen] = React.useState(false)
    const [hovered, setHovered] = React.useState(false)

    /*
     * Hover preview (range mode only).
     * Tracks which day the cursor is over while `from` is set but `to` is not.
     */
    const [hoverDay, setHoverDay] = React.useState<Date | undefined>(undefined)

    /* Collapse to 1 month on narrow viewport */
    const isNarrow = useIsNarrow()
    const numMonths = isRange && !isNarrow ? 2 : 1

    /* Day button class — size adapts to viewport */
    const DAY_BTN = React.useMemo(() => makeDayBtnClass(isNarrow), [isNarrow])

    /* ── Derived values ─────────────────────────────────────────── */
    const rangeValue = isRange ? (props as DatePickerRangeProps).value : undefined
    const singleValue = !isRange ? (props as DatePickerSingleProps).value : undefined

    const hasValue = isRange
      ? Boolean(rangeValue?.from)
      : Boolean(singleValue)

    const triggerLabel = isRange
      ? formatRangeTrigger(rangeValue, format, placeholder)
      : hasValue
      ? formatSingle(singleValue!, format)
      : placeholder

    /* ── Preview range (range mode, from set, no to, cursor moving) */
    const previewRange = React.useMemo<DateRange | null>(() => {
      if (!isRange || !hoverDay || !rangeValue?.from || rangeValue?.to) return null
      const from = rangeValue.from!
      if (isSameDay(hoverDay, from)) return null
      return from <= hoverDay
        ? { from, to: hoverDay }
        : { from: hoverDay, to: from }
    }, [isRange, hoverDay, rangeValue?.from, rangeValue?.to])

    /* ── Ring ────────────────────────────────────────────────────── */
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

    /* ── Clear ──────────────────────────────────────────────────── */
    const handleClear = () => {
      if (isRange) {
        ;(props as DatePickerRangeProps).onChange?.(undefined)
      } else {
        ;(props as DatePickerSingleProps).onChange?.(undefined)
      }
    }

    /* ── classNames (memoized, depends on isNarrow + numMonths) ─── */
    const weekdaySz = isNarrow ? 'w-11 h-11' : 'w-8 h-8'
    const dpClassNames = React.useMemo(() => ({
      root: '',
      months: cn('relative', isRange && numMonths > 1 && 'flex gap-[var(--spacing-xl)]'),
      /*
       * Nav: absolutely positioned, spans the full width of the months
       * container (1 or 2 months). Months use pt-10 to clear it.
       */
      nav: 'absolute top-0 inset-x-0 z-10 flex items-center justify-between',
      button_previous: NAV_BTN,
      button_next: NAV_BTN,
      month: cn('pt-10', isRange && numMonths > 1 && 'flex-1'),
      month_caption: 'text-center mb-[var(--spacing-s)]',
      caption_label: 'body-body1-semibold text-foreground',
      month_grid: 'w-full border-collapse',
      weekdays: '',
      weekday: cn(weekdaySz, 'text-center caption-caption text-muted-foreground font-normal'),
      weeks: '',
      week: '',
      /* "group" on <td> enables group-data-[*]: and group-[.class]: on DayButton */
      day: cn('group text-center', isNarrow ? 'p-[1px]' : 'p-[2px]'),
      day_button: DAY_BTN,
      /* Modifier class names on <td> */
      selected: '',
      today: '',
      outside: '',
      disabled: '',
      hidden: 'invisible',
      focused: '',
      range_start: '',
      range_end: '',
      range_middle: 'is-range-middle bg-[color-mix(in_srgb,var(--selection)_10%,transparent)]',
      /* Animation (unused) */
      weeks_before_enter: '',
      weeks_before_exit: '',
      weeks_after_enter: '',
      weeks_after_exit: '',
      caption_after_enter: '',
      caption_after_exit: '',
      caption_before_enter: '',
      caption_before_exit: '',
    }), [DAY_BTN, isRange, isNarrow, numMonths, weekdaySz])

    /* ── Preview modifiers passed to DayPicker ──────────────────── */
    const previewModifiers: Record<string, Matcher> | undefined = previewRange
      ? {
          preview_end: previewRange.to!,
          preview_middle: {
            after: previewRange.from!,
            before: previewRange.to!,
          } as Matcher,
        }
      : undefined

    const previewModifiersClassNames = previewRange
      ? {
          preview_end: 'is-preview-end',
          preview_middle:
            'is-preview-middle bg-[color-mix(in_srgb,var(--selection)_8%,transparent)]',
        }
      : undefined

    /* ── Shared DayPicker props ──────────────────────────────────── */
    const sharedDPProps = {
      disabled: disabledMatchers.length > 0 ? disabledMatchers : undefined,
      components: {
        Chevron: ({ orientation }: { orientation?: string }) =>
          orientation === 'left'
            ? <ChevronLeft size={16} aria-hidden="true" />
            : <ChevronRight size={16} aria-hidden="true" />,
      },
      classNames: dpClassNames,
    }

    return (
      <div className={cn('inline-block w-full', className)}>
        <Popover.Root
          open={open}
          onOpenChange={(o) => {
            if (!disabled) {
              setOpen(o)
              if (!o) setHoverDay(undefined)
            }
          }}
        >
          {/* ── Trigger ──────────────────────────────────────────── */}
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
                'relative h-12 w-full rounded-[var(--radius-m)] transition-all duration-150',
                'appearance-none border-0 m-0 box-border [font:inherit]',
                'bg-[var(--input-background)]',
                getRingClass(),
                'flex items-center text-left cursor-pointer',
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

              {/*
               * Right slot: X when has value (clear), Calendar icon when empty.
               * Matches the SearchInput clear-button pattern.
               */}
              {hasValue && !disabled ? (
                <button
                  type="button"
                  aria-label="Clear"
                  tabIndex={-1}
                  onMouseDown={(e) => {
                    e.preventDefault()   // keep popover from toggling
                    e.stopPropagation()
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClear()
                  }}
                  className={cn(
                    'absolute flex items-center justify-center',
                    'w-6 h-6 rounded-[var(--radius-m)]',
                    'appearance-none border-0 m-0 bg-transparent box-border [font:inherit]',
                    'text-muted-foreground hover:text-foreground hover:bg-muted',
                    'cursor-pointer transition-colors duration-100',
                    'outline-none focus-visible:ring-2 focus-visible:ring-inset',
                    'focus-visible:ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]',
                  )}
                  style={{ right: 'var(--spacing-l)' }}
                >
                  <X size={14} aria-hidden="true" />
                </button>
              ) : (
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
              )}
            </button>
          </Popover.Trigger>

          {/* ── Calendar panel ────────────────────────────────────── */}
          <Popover.Portal>
            <Popover.Content
              side="bottom"
              align="start"
              sideOffset={4}
              onOpenAutoFocus={(e) => e.preventDefault()}
              onMouseLeave={() => setHoverDay(undefined)}
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
                  numberOfMonths={numMonths}
                  selected={rangeValue}
                  onSelect={(selected) => {
                    ;(props as DatePickerRangeProps).onChange?.(selected)
                    if (selected?.from && selected?.to) {
                      setOpen(false)
                      setHoverDay(undefined)
                    }
                  }}
                  onDayMouseEnter={(date, modifiers) => {
                    if (!modifiers.disabled) setHoverDay(date)
                  }}
                  onDayMouseLeave={() => setHoverDay(undefined)}
                  modifiers={previewModifiers}
                  modifiersClassNames={previewModifiersClassNames}
                  {...sharedDPProps}
                />
              ) : (
                <DayPicker
                  mode="single"
                  selected={singleValue}
                  onSelect={(selected) => {
                    ;(props as DatePickerSingleProps).onChange?.(selected)
                    setOpen(false)
                  }}
                  {...sharedDPProps}
                />
              )}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {/* Hidden input for form submission (single mode only) */}
        {name && !isRange && singleValue && (
          <input
            type="hidden"
            name={name}
            value={dateFnsFormat(singleValue, 'yyyy-MM-dd')}
          />
        )}
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'
