import * as React from 'react'
import * as Popover from '@radix-ui/react-popover'
import { DayPicker, type Matcher } from 'react-day-picker'
import { format as dateFnsFormat } from 'date-fns'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../../lib/utils'

/* =================================================================
   Types
   ================================================================= */

export type DatePickerProps = {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  /** Disable days before this date */
  min?: Date
  /** Disable days after this date */
  max?: Date
  id?: string
  name?: string
  /** date-fns format string. Default: "MMM d, yyyy" → "Jun 4, 2026" */
  format?: string
  /** className applied to the outer wrapper div */
  className?: string
}

/* =================================================================
   Internal shared class strings
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

const DAY_BTN = cn(
  /* reset — §3.6 self-contained */
  'appearance-none border-0 m-0 bg-transparent box-border [font:inherit]',
  /* layout */
  'w-8 h-8 rounded-full flex items-center justify-center',
  /* typography */
  'body-body2-regular',
  /* colors */
  'text-foreground',
  /* interaction */
  'cursor-pointer hover:bg-muted transition-colors duration-100',
  /* focus ring — primary (green), as allowed per brand rules */
  'outline-none focus-visible:ring-2',
  'focus-visible:ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]',
  /* ── State styles via parent <td> data attributes ── */
  /* day is selected → --selection (black), brand scarcity rule */
  'group-data-[selected=true]:bg-[var(--selection)]',
  'group-data-[selected=true]:text-[var(--selection-foreground)]',
  'group-data-[selected=true]:hover:bg-[var(--selection)]',
  /* today → subtle ring, NOT green */
  'group-data-[today=true]:ring-1',
  'group-data-[today=true]:ring-[var(--neutral-gray3)]',
  'group-data-[today=true]:ring-offset-1',
  'group-data-[today=true]:ring-offset-background',
  /* outside current month → dim */
  'group-data-[outside=true]:opacity-30',
  /* disabled → dim + block interaction */
  'group-data-[disabled=true]:opacity-30',
  'group-data-[disabled=true]:cursor-not-allowed',
  'group-data-[disabled=true]:pointer-events-none',
)

/* =================================================================
   Component
   ================================================================= */

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Select a date',
      disabled = false,
      min,
      max,
      id: idProp,
      name,
      format = 'MMM d, yyyy',
      className,
    },
    ref
  ) => {
    const autoId = React.useId()
    const triggerId = idProp ?? autoId

    const [open, setOpen] = React.useState(false)
    const [hovered, setHovered] = React.useState(false)

    const hasValue = value !== undefined

    /* ── Ring class — mirrors Input ─────────────────────────────── */
    const getRingClass = () => {
      if (disabled) return 'ring-1 ring-[var(--neutral-gray3)]'
      if (open) return 'ring-2 ring-selection'
      if (hovered || hasValue) return 'ring-1 ring-[var(--neutral-dark)]'
      return 'ring-1 ring-[var(--neutral-gray4)]'
    }

    /* ── DayPicker disabled matchers ────────────────────────────── */
    const disabledMatchers: Matcher[] = [
      ...(min ? [{ before: min }] : []),
      ...(max ? [{ after: max }] : []),
    ]

    return (
      <div className={cn('inline-block w-full', className)}>
        <Popover.Root
          open={open}
          onOpenChange={(o) => { if (!disabled) setOpen(o) }}
        >
          {/* ── Trigger — visually identical to Input (md size) ── */}
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
                /* sizing — mirrors Input md */
                'relative h-12 w-full rounded-[var(--radius-m)] transition-all duration-150',
                /* reset */
                'appearance-none border-0 m-0 box-border [font:inherit]',
                /* colors */
                'bg-[var(--input-background)]',
                /* ring */
                getRingClass(),
                /* layout */
                'flex items-center text-left cursor-pointer',
                /* padding — room for Calendar icon on the right */
                'pl-[var(--spacing-l)] pr-[44px]',
                disabled && 'opacity-40 cursor-not-allowed',
              )}
            >
              {/* Date text or placeholder */}
              <span
                className={cn(
                  'body-body1-regular flex-1 truncate',
                  hasValue ? 'text-foreground' : 'text-[var(--muted-foreground)]',
                )}
              >
                {hasValue ? dateFnsFormat(value!, format) : placeholder}
              </span>

              {/* Calendar icon */}
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
              <DayPicker
                mode="single"
                selected={value}
                onSelect={(selected) => {
                  onChange?.(selected)
                  setOpen(false)
                }}
                disabled={disabledMatchers.length > 0 ? disabledMatchers : undefined}
                components={{
                  Chevron: ({ orientation }) =>
                    orientation === 'left'
                      ? <ChevronLeft size={16} aria-hidden="true" />
                      : <ChevronRight size={16} aria-hidden="true" />,
                }}
                classNames={{
                  root: '',
                  months: '',
                  month: '',
                  /* caption row: label left, nav right */
                  month_caption: 'flex items-center justify-between mb-[var(--spacing-s)]',
                  caption_label: 'body-body1-semibold text-foreground',
                  nav: 'flex items-center gap-[var(--spacing-xxs)]',
                  button_previous: NAV_BTN,
                  button_next: NAV_BTN,
                  month_grid: 'w-full border-collapse',
                  weekdays: '',
                  weekday:
                    'w-8 h-8 text-center caption-caption text-muted-foreground font-normal',
                  weeks: '',
                  week: '',
                  /*
                   * Day cell (<td>) — "group" enables group-data-[*]: variants
                   * on the DayButton inside.
                   */
                  day: 'group p-[2px] text-center',
                  day_button: DAY_BTN,
                  /* Modifier classes (applied on the day cell alongside "day") */
                  selected: '',   // data-selected on td is enough; DAY_BTN reads it
                  today: '',      // data-today on td is enough; DAY_BTN reads it
                  outside: '',    // data-outside on td is enough
                  disabled: '',   // data-disabled on td is enough
                  hidden: 'invisible',
                  focused: '',
                  /* Range classes (unused in single mode, but required by type) */
                  range_end: '',
                  range_middle: '',
                  range_start: '',
                  /* Animation (not used) */
                  weeks_before_enter: '',
                  weeks_before_exit: '',
                  weeks_after_enter: '',
                  weeks_after_exit: '',
                  caption_after_enter: '',
                  caption_after_exit: '',
                  caption_before_enter: '',
                  caption_before_exit: '',
                }}
              />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {/* Hidden input for form name submission */}
        {name && (
          <input
            type="hidden"
            name={name}
            value={value ? dateFnsFormat(value, 'yyyy-MM-dd') : ''}
          />
        )}
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'
