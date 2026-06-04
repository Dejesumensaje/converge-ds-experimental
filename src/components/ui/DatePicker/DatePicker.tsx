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
  /** id forwarded to the Group element */
  id?: string
  /** hidden input name (single mode) */
  name?: string
  className?: string
  placeholder?: string
  error?: boolean
  /**
   * BCP 47 locale tag for date formatting and calendar.
   * Defaults to "en-US" (MM/DD/YYYY, week starts Sunday, English month names).
   */
  locale?: string
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
  'focus-visible:ring-2',
  'focus-visible:ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]',
)

const CALENDAR_ICON_BTN = cn(
  'appearance-none border-0 m-0 bg-transparent box-border [font:inherit]',
  'flex-shrink-0 w-8 h-8 rounded-[var(--radius-m)]',
  'flex items-center justify-center',
  'text-muted-foreground hover:text-foreground hover:bg-muted',
  'cursor-pointer transition-colors duration-100',
  'outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]',
)

const CLEAR_BTN = cn(
  'appearance-none border-0 m-0 bg-transparent box-border [font:inherit]',
  'flex-shrink-0 w-6 h-6 rounded-[var(--radius-m)]',
  'flex items-center justify-center',
  'text-muted-foreground hover:text-foreground hover:bg-muted',
  'cursor-pointer transition-colors duration-100 mr-[var(--spacing-xxs)]',
  'outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]',
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
  todayDate: CalendarDate,
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
    const isToday = date.compare(todayDate) === 0
    const isEndpoint = isSelectionStart || isSelectionEnd
    const isMiddle = isSelected && !isEndpoint

    return cn(
      /* reset */
      'appearance-none border-0 m-0 box-border [font:inherit]',
      /* layout */
      sz, 'rounded-full flex items-center justify-center cursor-pointer',
      /* typography */
      'body-body2-regular text-foreground outline-none',
      /* transitions */
      'transition-colors duration-100',
      /* focus ring */
      isFocusVisible &&
        'ring-2 ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]',
      /* today indicator (ring, never green) */
      isToday && !isSelected &&
        'ring-1 ring-[var(--neutral-gray3)] ring-offset-1 ring-offset-background',
      /* outside month — faded */
      isOutsideMonth && 'opacity-30',
      /* disabled */
      isDisabled && 'opacity-30 cursor-not-allowed pointer-events-none',
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
      /* ring */
      open || isFocusWithin
        ? 'ring-2 ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]'
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
  const todayDate = today(getLocalTimeZone())
  const cellClass = React.useMemo(
    () => makeCellClass(isNarrow, todayDate),
    [isNarrow, todayDate],
  )
  const numMonths = mode === 'range' && !isNarrow ? 2 : 1

  const headerRow = (
    <div
      className={cn(
        'flex items-center justify-between',
        'mb-[var(--spacing-s)]',
      )}
    >
      <Button slot="previous" className={NAV_BTN}>
        <ChevronLeft size={16} aria-hidden="true" />
      </Button>
      <Heading className="body-body1-semibold text-foreground" />
      <Button slot="next" className={NAV_BTN}>
        <ChevronRight size={16} aria-hidden="true" />
      </Button>
    </div>
  )

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
              'caption-caption text-muted-foreground font-normal text-center',
            )}
          >
            {day}
          </CalendarHeaderCell>
        )}
      </CalendarGridHeader>
      <CalendarGridBody>
        {(date) => (
          <CalendarCell
            date={date}
            className={cellClass}
          />
        )}
      </CalendarGridBody>
    </CalendarGrid>
  )

  const grids = (
    <div
      className={cn(
        'flex',
        numMonths > 1 && 'gap-[var(--spacing-xl)]',
      )}
    >
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
        <Calendar
          className="outline-none"
        >
          {headerRow}
          {grids}
        </Calendar>
      ) : (
        <RangeCalendar
          className="outline-none"
          visibleDuration={{ months: numMonths }}
        >
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
  'rounded-[var(--radius-xs)] px-[2px] tabular-nums',
  /* placeholder handled via CSS .dp-segment[data-placeholder] */
  /* focus handled via CSS .dp-segment[data-focused] */
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
  className?: string
  placeholder?: string
  error: boolean
  locale: string
}

function SingleDatePicker({
  value,
  onChange,
  disabled,
  min,
  max,
  id,
  name,
  className,
  error,
  locale,
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
      className={cn('w-full', className)}
    >
      <Group
        id={id}
        className={groupClass(open, hasValue, error, disabled)}
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
          <Button className={CALENDAR_ICON_BTN}>
            <CalIcon size={18} aria-hidden="true" />
          </Button>
        </div>
      </Group>

      <Popover
        placement="bottom start"
        offset={4}
        className="z-50 outline-none"
      >
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
  className?: string
  placeholder?: string
  error: boolean
  locale: string
}

function RangeDatePicker({
  value,
  onChange,
  disabled,
  min,
  max,
  id,
  className,
  error,
  locale,
}: RangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const isNarrow = useIsNarrow()
  const hasValue = Boolean(value?.from)

  const calValue =
    value?.from
      ? {
          start: jsToCalDate(value.from),
          end: value.to ? jsToCalDate(value.to) : jsToCalDate(value.from),
        }
      : null

  const minValue = min ? jsToCalDate(min) : undefined
  const maxValue = max ? jsToCalDate(max) : undefined

  const handleClear = () => onChange?.(undefined)

  return (
    <I18nProvider locale={locale}>
    <DateRangePicker
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
      className={cn(className)}
    >
      <Group
        id={id}
        className={groupClass(open, hasValue, error, disabled, true)}
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
          <Button className={CALENDAR_ICON_BTN}>
            <CalIcon size={18} aria-hidden="true" />
          </Button>
        </div>
      </Group>

      <Popover
        placement="bottom start"
        offset={4}
        className="z-50 outline-none"
      >
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
      placeholder,
      error = false,
      locale = 'en-US',
    } = props

    const isRange = props.mode === 'range'

    return (
      <div
        ref={ref}
        className={cn(isRange ? 'inline-block' : 'block w-full', className)}
      >
        {isRange ? (
          <RangeDatePicker
            value={(props as DatePickerRangeProps).value}
            onChange={(props as DatePickerRangeProps).onChange}
            disabled={disabled}
            min={min}
            max={max}
            id={id}
            placeholder={placeholder}
            error={error}
            locale={locale}
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
            placeholder={placeholder}
            error={error}
            locale={locale}
          />
        )}
      </div>
    )
  },
)

DatePicker.displayName = 'DatePicker'
