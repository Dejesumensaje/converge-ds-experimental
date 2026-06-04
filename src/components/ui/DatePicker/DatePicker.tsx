import * as React from 'react'
import {
  DatePicker as RACDatePicker,
  DateRangePicker,
  DateInput,
  DateSegment,
  Button,
  Calendar,
  RangeCalendar,
  CalendarGrid,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarGridBody,
  CalendarCell,
  Heading,
  Popover,
  Dialog,
  Group,
  I18nProvider,
} from 'react-aria-components'
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date'
import { Calendar as CalIcon, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '../../../lib/utils'
import './datepicker.css'

/* ─────────────────────────────────────────────────────────────────
   Public types
   ───────────────────────────────────────────────────────────────── */

export type DateRange = { from?: Date; to?: Date }

type DatePickerBase = {
  disabled?: boolean
  min?: Date
  max?: Date
  id?: string
  /** hidden input name (single mode) */
  name?: string
  className?: string
  error?: boolean
  /**
   * BCP 47 locale tag. Default "en-US" → MM/DD/YYYY, Sunday start, English months.
   * Pass a different tag (e.g. "es-419") to override.
   */
  locale?: string
  /** Accessible label. Use when no visible <label> element is available. */
  'aria-label'?: string
  /**
   * Space-separated list of element IDs that label this field.
   * Preferred pattern: render a <label id="my-label"> and pass aria-labelledby="my-label".
   */
  'aria-labelledby'?: string
}

type DatePickerSingleProps = DatePickerBase & {
  mode?: 'single'
  value?: Date
  onChange?: (date: Date | undefined) => void
}

type DatePickerRangeProps = DatePickerBase & {
  mode: 'range'
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps

/* ─────────────────────────────────────────────────────────────────
   Date conversion (JS Date ↔ CalendarDate)
   ───────────────────────────────────────────────────────────────── */

function jsToCalDate(d: Date): CalendarDate {
  return new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
}

function calToJsDate(cd: CalendarDate): Date {
  return new Date(cd.year, cd.month - 1, cd.day)
}

/* ─────────────────────────────────────────────────────────────────
   Responsive hook — collapses to 1 month below 640px
   ───────────────────────────────────────────────────────────────── */

function useIsNarrow(bp = 640): boolean {
  const [narrow, setNarrow] = React.useState(
    () => typeof window !== 'undefined' && window.innerWidth < bp,
  )
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${bp - 1}px)`)
    setNarrow(mq.matches)
    const h = (e: MediaQueryListEvent) => setNarrow(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [bp])
  return narrow
}

/* ─────────────────────────────────────────────────────────────────
   Shared style constants
   ───────────────────────────────────────────────────────────────── */

const NAV_BTN = cn(
  'appearance-none border-0 m-0 bg-transparent box-border [font:inherit]',
  'w-8 h-8 rounded-[var(--radius-m)] flex items-center justify-center',
  'text-muted-foreground hover:text-foreground hover:bg-muted',
  'cursor-pointer transition-colors duration-100',
  'outline-none',
  'focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
)

const CALENDAR_ICON_BTN = cn(
  'appearance-none border-0 m-0 bg-transparent box-border [font:inherit]',
  'flex-shrink-0 w-8 h-8 rounded-[var(--radius-m)]',
  'flex items-center justify-center',
  'text-muted-foreground hover:text-foreground hover:bg-muted',
  'cursor-pointer transition-colors duration-100',
  'outline-none',
  'focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
)

const CLEAR_BTN = cn(
  'appearance-none border-0 m-0 bg-transparent box-border [font:inherit]',
  'flex-shrink-0 w-6 h-6 rounded-[var(--radius-m)]',
  'flex items-center justify-center',
  'text-muted-foreground hover:text-foreground hover:bg-muted',
  'cursor-pointer transition-colors duration-100 mr-[var(--spacing-xxs)]',
  'outline-none',
  'focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
)

/* ─────────────────────────────────────────────────────────────────
   CalendarCell class factory
   ───────────────────────────────────────────────────────────────── */

type CellRenderState = {
  isSelected: boolean
  isSelectionStart: boolean
  isSelectionEnd: boolean
  isFocusVisible: boolean
  isDisabled: boolean
  isOutsideMonth: boolean
  date: CalendarDate
}

function makeCellClass(
  isNarrow: boolean,
  todayDateStr: string,
): (state: CellRenderState) => string {
  const sz = isNarrow ? 'w-11 h-11' : 'w-8 h-8'
  return ({
    isSelected,
    isSelectionStart,
    isSelectionEnd,
    isFocusVisible,
    isDisabled,
    isOutsideMonth,
    date,
  }) => {
    const isToday = date.toString() === todayDateStr
    const isEndpoint = isSelectionStart || isSelectionEnd
    const isMiddle = isSelected && !isEndpoint

    return cn(
      /* reset */
      'appearance-none border-0 m-0 box-border [font:inherit]',
      /* layout */
      sz, 'rounded-[var(--radius-full)] flex items-center justify-center cursor-pointer',
      /* typography */
      'body-body2-regular text-foreground outline-none',
      /* transitions */
      'transition-colors duration-100',
      /* focus ring — full --ring color, no mix */
      isFocusVisible && 'ring-2 ring-[var(--ring)]',
      /* today indicator — neutral-gray4 for visibility */
      isToday && !isSelected &&
        'ring-1 ring-[var(--neutral-gray4)] ring-offset-1 ring-offset-background',
      /* outside month — opacity-40 for contrast */
      isOutsideMonth && 'opacity-40',
      /* disabled — opacity-40 */
      isDisabled && 'opacity-40 cursor-not-allowed pointer-events-none',
      /* hover (non-selected) */
      !isSelected && !isDisabled && 'hover:bg-muted',
      /* selected endpoints */
      isEndpoint &&
        'bg-[var(--selection)] text-[var(--selection-foreground)] hover:bg-[var(--selection)]',
      /* range middle — transparent; <td> carries the tint via CSS */
      isMiddle && 'bg-transparent',
    )
  }
}

/* ─────────────────────────────────────────────────────────────────
   Group class factory — the trigger field ring
   ───────────────────────────────────────────────────────────────── */

type GroupRenderState = {
  isFocusWithin: boolean
  isHovered: boolean
  isDisabled: boolean
}

function groupClass(
  open: boolean,
  hasValue: boolean,
  error: boolean,
  disabled: boolean,
  compact = false,
) {
  return ({ isFocusWithin, isHovered }: GroupRenderState) =>
    cn(
      /* base */
      'relative items-center',
      compact ? 'inline-flex' : 'flex w-full',
      'h-12 rounded-[var(--radius-m)]',
      'bg-[var(--input-background)]',
      'appearance-none box-border',
      'cursor-text transition-shadow duration-150',
      /* ring — full --ring on focus/open, no color-mix */
      open || isFocusWithin
        ? 'ring-2 ring-[var(--ring)]'
        : error
        ? 'ring-1 ring-[var(--destructive)]'
        : isHovered || hasValue
        ? 'ring-1 ring-[var(--neutral-dark)]'
        : 'ring-1 ring-[var(--neutral-gray4)]',
      /* disabled */
      disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
    )
}

/* ─────────────────────────────────────────────────────────────────
   CalendarPanel — shared between single and range
   ───────────────────────────────────────────────────────────────── */

interface CalendarPanelProps {
  mode: 'single' | 'range'
  isNarrow: boolean
}

function CalendarPanel({ mode, isNarrow }: CalendarPanelProps) {
  /* todayDateStr is stable within a session — memoized by string comparison */
  const todayDateStr = React.useMemo(
    () => today(getLocalTimeZone()).toString(),
    [],
  )
  const cellClass = React.useMemo(
    () => makeCellClass(isNarrow, todayDateStr),
    [isNarrow, todayDateStr],
  )
  const numMonths = mode === 'range' && !isNarrow ? 2 : 1

  const headerRow = (
    <div className="flex items-center justify-between mb-[var(--spacing-s)]">
      <Button slot="previous" className={NAV_BTN}>
        <ChevronLeft size={16} aria-hidden="true" />
      </Button>
      <Heading className="body-body1-semibold text-foreground" />
      <Button slot="next" className={NAV_BTN}>
        <ChevronRight size={16} aria-hidden="true" />
      </Button>
    </div>
  )

  /* Weekday headers: body-body2-regular (14px/400) — no raw weight override */
  const weekdaySz = isNarrow ? 'w-11 h-11' : 'w-8 h-8'

  const gridContent = (offset?: { months: number }) => (
    <CalendarGrid
      offset={offset}
      className={cn(
        'border-collapse',
        mode === 'range' && 'dp-range-grid',
      )}
    >
      <CalendarGridHeader>
        {(day) => (
          <CalendarHeaderCell
            className={cn(
              weekdaySz,
              'body-body2-regular text-muted-foreground text-center',
            )}
          >
            {day}
          </CalendarHeaderCell>
        )}
      </CalendarGridHeader>
      <CalendarGridBody>
        {(date) => (
          <CalendarCell date={date} className={cellClass} />
        )}
      </CalendarGridBody>
    </CalendarGrid>
  )

  const grids = (
    <div className={cn('flex', numMonths > 1 && 'gap-[var(--spacing-xl)]')}>
      {gridContent()}
      {numMonths > 1 && gridContent({ months: 1 })}
    </div>
  )

  return (
    <div
      className={cn(
        'bg-background border border-border rounded-[var(--radius-l)] shadow-md',
        'p-[var(--spacing-m)] outline-none',
      )}
    >
      {mode === 'single' ? (
        <Calendar className="outline-none">
          {headerRow}
          {grids}
        </Calendar>
      ) : (
        <RangeCalendar className="outline-none" visibleDuration={{ months: numMonths }}>
          {headerRow}
          {grids}
        </RangeCalendar>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Shared segment + input styles
   ───────────────────────────────────────────────────────────────── */

const SEGMENT_CLASS = cn(
  'dp-segment body-body1-regular outline-none',
  /* px-[var(--spacing-tiny)] = 2px per token --spacing-tiny */
  'rounded-[var(--radius-xs)] px-[var(--spacing-tiny)] tabular-nums',
)

const DATE_INPUT_CLASS = cn(
  'flex items-center h-full pl-[var(--spacing-l)]',
  'body-body1-regular cursor-text',
)

/* ─────────────────────────────────────────────────────────────────
   SingleDatePicker
   ───────────────────────────────────────────────────────────────── */

interface SinglePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  disabled: boolean
  min?: Date
  max?: Date
  id?: string
  name?: string
  error: boolean
  locale: string
  'aria-label'?: string
  'aria-labelledby'?: string
}

function SingleDatePicker({
  value,
  onChange,
  disabled,
  min,
  max,
  id,
  name,
  error,
  locale,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: SinglePickerProps) {
  const [open, setOpen] = React.useState(false)
  const isNarrow = useIsNarrow()
  const hasValue = Boolean(value)

  const calValue = value ? jsToCalDate(value) : null
  const minValue = min ? jsToCalDate(min) : undefined
  const maxValue = max ? jsToCalDate(max) : undefined

  const handleClear = () => onChange?.(undefined)

  return (
    <I18nProvider locale={locale}>
      <RACDatePicker
        id={id}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        value={calValue}
        onChange={(v) => {
          if (!v) { onChange?.(undefined); return }
          onChange?.(calToJsDate(v as CalendarDate))
          setOpen(false)
        }}
        isDisabled={disabled}
        minValue={minValue}
        maxValue={maxValue}
        isOpen={open}
        onOpenChange={setOpen}
        className="w-full"
      >
        <Group
          className={groupClass(open, hasValue, error, disabled)}
          aria-invalid={error || undefined}
          aria-disabled={disabled || undefined}
        >
          <DateInput className={DATE_INPUT_CLASS}>
            {(segment) => (
              <DateSegment segment={segment} className={SEGMENT_CLASS} />
            )}
          </DateInput>

          {/* Right slot */}
          <div className="flex items-center flex-shrink-0 pr-[var(--spacing-s)]">
            {hasValue && !disabled && (
              <button
                type="button"
                aria-label="Clear date"
                tabIndex={-1}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleClear()
                }}
                className={CLEAR_BTN}
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
            <Button aria-label="Open calendar" className={CALENDAR_ICON_BTN}>
              <CalIcon size={18} aria-hidden="true" />
            </Button>
          </div>
        </Group>

        <Popover placement="bottom start" offset={4} className="z-50 outline-none">
          <Dialog className="outline-none">
            <CalendarPanel mode="single" isNarrow={isNarrow} />
          </Dialog>
        </Popover>

        {/* Hidden form input */}
        {name && value && (
          <input
            type="hidden"
            name={name}
            value={`${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`}
          />
        )}
      </RACDatePicker>
    </I18nProvider>
  )
}

/* ─────────────────────────────────────────────────────────────────
   RangeDatePicker
   ───────────────────────────────────────────────────────────────── */

interface RangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  disabled: boolean
  min?: Date
  max?: Date
  id?: string
  error: boolean
  locale: string
  'aria-label'?: string
  'aria-labelledby'?: string
}

function RangeDatePicker({
  value,
  onChange,
  disabled,
  min,
  max,
  id,
  error,
  locale,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: RangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const isNarrow = useIsNarrow()
  const hasValue = Boolean(value?.from)

  /*
   * Only pass a complete range to RAC (both start + end defined).
   * Partial ranges (from set, to undefined) are represented as null so both
   * DateInput segments show their placeholder rather than mirroring the start date.
   */
  const calValue =
    value?.from && value?.to
      ? { start: jsToCalDate(value.from), end: jsToCalDate(value.to) }
      : null

  const minValue = min ? jsToCalDate(min) : undefined
  const maxValue = max ? jsToCalDate(max) : undefined

  const handleClear = () => onChange?.(undefined)

  return (
    <I18nProvider locale={locale}>
      <DateRangePicker
        id={id}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        value={calValue}
        onChange={(v) => {
          if (!v) { onChange?.(undefined); return }
          const from = calToJsDate(v.start as CalendarDate)
          const to = calToJsDate(v.end as CalendarDate)
          onChange?.({ from, to })
          setOpen(false)
        }}
        isDisabled={disabled}
        minValue={minValue}
        maxValue={maxValue}
        isOpen={open}
        onOpenChange={setOpen}
      >
        <Group
          className={groupClass(open, hasValue, error, disabled, true)}
          aria-invalid={error || undefined}
          aria-disabled={disabled || undefined}
        >
          <div className="flex shrink-0 items-center h-full pl-[var(--spacing-l)]">
            <DateInput slot="start" className="flex items-center body-body1-regular cursor-text">
              {(segment) => (
                <DateSegment segment={segment} className={SEGMENT_CLASS} />
              )}
            </DateInput>
            <span
              aria-hidden="true"
              className="body-body1-regular text-muted-foreground select-none mx-[var(--spacing-xxs)]"
            >
              –
            </span>
            <DateInput slot="end" className="flex items-center body-body1-regular cursor-text">
              {(segment) => (
                <DateSegment segment={segment} className={SEGMENT_CLASS} />
              )}
            </DateInput>
          </div>

          {/* Right slot */}
          <div className="flex items-center flex-shrink-0 pr-[var(--spacing-s)]">
            {hasValue && !disabled && (
              <button
                type="button"
                aria-label="Clear dates"
                tabIndex={-1}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleClear()
                }}
                className={CLEAR_BTN}
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
            <Button aria-label="Open calendar" className={CALENDAR_ICON_BTN}>
              <CalIcon size={18} aria-hidden="true" />
            </Button>
          </div>
        </Group>

        <Popover placement="bottom start" offset={4} className="z-50 outline-none">
          <Dialog className="outline-none">
            <CalendarPanel mode="range" isNarrow={isNarrow} />
          </Dialog>
        </Popover>
      </DateRangePicker>
    </I18nProvider>
  )
}

/* ─────────────────────────────────────────────────────────────────
   DatePicker — public export
   ───────────────────────────────────────────────────────────────── */

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (props, ref) => {
    const {
      disabled = false,
      min,
      max,
      id,
      name,
      className,
      error = false,
      locale = 'en-US',
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
    } = props

    const isRange = props.mode === 'range'

    return (
      <div
        ref={ref}
        className={cn(
          /*
           * min-w-[240px]: floor so the trigger is never narrower than a
           * standard form input. Both modes share the same floor for alignment.
           * Single: block + w-full (fills container). Range: inline-block (content-sized).
           */
          isRange ? 'inline-block min-w-[240px]' : 'block w-full min-w-[240px]',
          className,
        )}
      >
        {isRange ? (
          <RangeDatePicker
            value={(props as DatePickerRangeProps).value}
            onChange={(props as DatePickerRangeProps).onChange}
            disabled={disabled}
            min={min}
            max={max}
            id={id}
            error={error}
            locale={locale}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
          />
        ) : (
          <SingleDatePicker
            value={(props as DatePickerSingleProps).value}
            onChange={(props as DatePickerSingleProps).onChange}
            disabled={disabled}
            min={min}
            max={max}
            id={id}
            name={name}
            error={error}
            locale={locale}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
          />
        )}
      </div>
    )
  },
)

DatePicker.displayName = 'DatePicker'
