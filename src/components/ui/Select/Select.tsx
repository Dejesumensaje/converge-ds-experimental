import * as React from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Command } from 'cmdk'
import { Check, ChevronDown, AlertCircle, Search } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../lib/utils'
import { Chip } from '../Chip'

/* =================================================================
   CVA — wrapper structural classes (mirrors Input exactly)
   ================================================================= */

const selectWrapperVariants = cva(
  'relative flex items-center rounded-[var(--radius-m)] transition-all duration-150',
  {
    variants: {
      size: {
        sm: 'h-10',
        md: 'h-12',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

type SelectSize = NonNullable<VariantProps<typeof selectWrapperVariants>['size']>

/* =================================================================
   Types
   ================================================================= */

export type SelectOption = {
  label: string
  value: string
  icon?: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  category?: string
}

export type SelectProps = {
  options: SelectOption[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  multiple?: boolean
  searchable?: boolean
  label: string
  size?: SelectSize
  error?: boolean
  errorMessage?: string
  helperText?: string
  disabled?: boolean
  placeholder?: string
  className?: string
}

/* =================================================================
   Helpers — mirrors Input's ring/bg logic exactly
   ================================================================= */

function getRingClass(opts: {
  disabled?: boolean
  isError: boolean
  focused: boolean
  hovered: boolean
  hasValue: boolean
}) {
  const { disabled, isError, focused, hovered, hasValue } = opts
  if (disabled) return 'ring-1 ring-[var(--neutral-gray3)]'
  if (isError) return 'ring-2 ring-destructive'
  if (focused) return 'ring-2 ring-selection'
  if (hovered || hasValue) return 'ring-1 ring-[var(--neutral-dark)]'
  return 'ring-1 ring-[var(--neutral-gray4)]'
}

function getBgClass() {
  return 'bg-[var(--input-background)]'
}

/* =================================================================
   Component
   ================================================================= */

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      multiple = false,
      searchable = false,
      label,
      size = 'md',
      error = false,
      errorMessage,
      helperText,
      disabled = false,
      placeholder,
      className,
    },
    ref
  ) => {
    const autoId = React.useId()
    const helperId = `${autoId}-helper`

    const [open, setOpen] = React.useState(false)
    const [hovered, setHovered] = React.useState(false)
    const [search, setSearch] = React.useState('')

    /* ── Derived state ─────────────────────────────────────────── */
    const selectedValues: string[] = multiple
      ? Array.isArray(value) ? value : []
      : typeof value === 'string' && value ? [value] : []

    const hasValue = selectedValues.length > 0
    const isError = error || Boolean(errorMessage)

    // Label floats when open, has a value, or search text exists
    const isFloated = open || hasValue || search.length > 0

    /* ── Floating label style — mirrors Input exactly ──────────── */
    const labelLeftFloated = size === 'sm' ? 'var(--spacing-m)' : 'var(--spacing-l)'
    const labelLeftResting = size === 'sm' ? 'var(--spacing-m)' : 'var(--spacing-l)'

    const labelColor = disabled
      ? 'var(--text-disabled)'
      : isError
      ? 'var(--destructive)'
      : open
      ? 'var(--selection)'
      : 'var(--muted-foreground)'

    const floatedStyle: React.CSSProperties = {
      top: '-9px',
      fontSize: '11px',
      lineHeight: '14px',
      letterSpacing: '0.02em',
      color: labelColor,
      left: labelLeftFloated,
      paddingLeft: '4px',
      paddingRight: '4px',
      backgroundColor: 'var(--input-background)',
    }

    const restingStyle: React.CSSProperties = {
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: size === 'sm' ? '13px' : '14px',
      lineHeight: '20px',
      color: 'var(--muted-foreground)',
      left: labelLeftResting,
    }

    const labelStyle = isFloated ? floatedStyle : restingStyle

    /* ── Selection helpers ─────────────────────────────────────── */
    const isSelected = (val: string) => selectedValues.includes(val)

    const handleSelect = (val: string) => {
      if (multiple) {
        const next = isSelected(val)
          ? selectedValues.filter((v) => v !== val)
          : [...selectedValues, val]
        onChange(next)
        // keep popover open for multi-select
      } else {
        onChange(val)
        setOpen(false)
        setSearch('')
      }
    }

    /* ── Group options by category ─────────────────────────────── */
    const grouped = React.useMemo(() => {
      const filtered = options.filter((o) =>
        search ? o.label.toLowerCase().includes(search.toLowerCase()) : true
      )
      const map = new Map<string | undefined, SelectOption[]>()
      for (const opt of filtered) {
        const key = opt.category
        if (!map.has(key)) map.set(key, [])
        map.get(key)!.push(opt)
      }
      return map
    }, [options, search])

    /* ── Chip display (max 2 + overflow) ───────────────────────── */
    const MAX_CHIPS = 2
    const visibleChips = selectedValues.slice(0, MAX_CHIPS)
    const overflowCount = selectedValues.length - MAX_CHIPS

    const getLabel = (val: string) =>
      options.find((o) => o.value === val)?.label ?? val

    /* ── Trigger content ───────────────────────────────────────── */
    const pl = size === 'sm' ? 'pl-[var(--spacing-m)]' : 'pl-[var(--spacing-l)]'
    const pr = size === 'sm' ? 'pr-[36px]' : 'pr-[44px]'

    return (
      <div className={cn('flex flex-col gap-[var(--spacing-xxs)]', className)}>
        <Popover.Root open={open} onOpenChange={(o) => { if (!disabled) setOpen(o) }}>
          {/* ── Trigger (visually = Input wrapper) ────────────── */}
          <Popover.Trigger asChild>
            <button
              ref={ref}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-label={label}
              aria-describedby={errorMessage || helperText ? helperId : undefined}
              aria-invalid={isError || undefined}
              aria-disabled={disabled || undefined}
              disabled={disabled}
              className={cn(
                selectWrapperVariants({ size }),
                getRingClass({ disabled, isError, focused: open, hovered, hasValue }),
                getBgClass(),
                'w-full text-left cursor-pointer',
                disabled && 'opacity-40 cursor-not-allowed'
              )}
              onMouseEnter={() => !disabled && setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {/* Floating label */}
              <span
                className="absolute whitespace-nowrap pointer-events-none transition-all duration-150 z-10"
                style={labelStyle}
              >
                {label}
              </span>

              {/* Selected value display */}
              <span className={cn('flex flex-row items-center flex-nowrap gap-[var(--spacing-xxs)] overflow-hidden w-full', pl, pr)}>
                {multiple ? (
                  hasValue ? (
                    <>
                      {visibleChips.map((val) => (
                        <Chip key={val} size="sm" className="min-w-0 flex-shrink">
                          <span className="truncate">{getLabel(val)}</span>
                        </Chip>
                      ))}
                      {overflowCount > 0 && (
                        <Chip size="sm" className="flex-shrink-0">+{overflowCount} more</Chip>
                      )}
                    </>
                  ) : (
                    <span className="body-body1-regular text-transparent select-none">
                      {placeholder ?? '\u00A0'}
                    </span>
                  )
                ) : (
                  <span
                    className={cn(
                      'body-body1-regular truncate',
                      hasValue ? 'text-foreground' : 'text-transparent'
                    )}
                  >
                    {hasValue ? getLabel(selectedValues[0]) : (placeholder ?? '\u00A0')}
                  </span>
                )}
              </span>

              {/* Chevron */}
              <span
                className={cn(
                  'absolute pointer-events-none transition-transform duration-150',
                  open && 'rotate-180'
                )}
                style={{
                  right: size === 'sm' ? 'var(--spacing-m)' : 'var(--spacing-l)',
                  color: disabled ? 'var(--text-disabled)' : 'var(--muted-foreground)',
                }}
              >
                <ChevronDown size={size === 'sm' ? 16 : 20} aria-hidden="true" />
              </span>
            </button>
          </Popover.Trigger>

          {/* ── Dropdown ──────────────────────────────────────── */}
          <Popover.Portal>
            <Popover.Content
              side="bottom"
              align="start"
              sideOffset={4}
              className="z-50 w-[var(--radix-popover-trigger-width)] bg-background border border-border rounded-[var(--radius-m)] shadow-md p-1 outline-none"
            >
              <Command shouldFilter={false}>
                {searchable && (
                  <div className="flex items-center gap-[var(--spacing-s)] px-[var(--spacing-m)] py-[var(--spacing-s)] border-b border-border mb-1">
                    <Search size={14} className="text-muted-foreground flex-shrink-0" aria-hidden="true" />
                    <Command.Input
                      value={search}
                      onValueChange={setSearch}
                      placeholder="Search…"
                      className="flex-1 bg-transparent outline-none body-body2-regular text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                )}

                <Command.List>
                  {grouped.size === 0 && (
                    <Command.Empty className="body-body2-regular text-muted-foreground text-center py-[var(--spacing-m)]">
                      No options found.
                    </Command.Empty>
                  )}

                  {Array.from(grouped.entries()).map(([category, opts]) => {
                    const items = opts.map((opt) => {
                      const selected = isSelected(opt.value)
                      return (
                        <Command.Item
                          key={opt.value}
                          value={opt.value}
                          onSelect={() => handleSelect(opt.value)}
                          className={cn(
                            'flex items-center gap-[var(--spacing-m)] px-[var(--spacing-m)] py-[var(--spacing-s)]',
                            'rounded-[var(--radius-m)] cursor-pointer select-none body-body2-regular',
                            'text-foreground transition-colors duration-100',
                            'data-[selected=true]:bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)]',
                            'hover:bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)]',
                            selected && 'font-semibold'
                          )}
                        >
                          {/* Option icon */}
                          {opt.icon && (
                            <opt.icon size={16} aria-hidden="true" />
                          )}

                          <span className="flex-1 truncate">{opt.label}</span>

                          {/* Check mark */}
                          {selected && (
                            <Check size={14} className="flex-shrink-0 text-foreground" aria-hidden="true" />
                          )}
                        </Command.Item>
                      )
                    })

                    if (category) {
                      return (
                        <Command.Group
                          key={category}
                          heading={category}
                          className="[&_[cmdk-group-heading]]:px-[var(--spacing-m)] [&_[cmdk-group-heading]]:py-[var(--spacing-xxs)] [&_[cmdk-group-heading]]:caption-caption [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide"
                        >
                          {items}
                        </Command.Group>
                      )
                    }

                    return <React.Fragment key="__ungrouped">{items}</React.Fragment>
                  })}
                </Command.List>
              </Command>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {/* ── Helper / Error text — mirrors Input ─────────────────── */}
        {(errorMessage || helperText) && (
          <p
            id={helperId}
            role={isError ? 'alert' : undefined}
            className={cn(
              'flex items-center gap-[var(--spacing-xxs)] body-body2-regular',
              isError ? 'text-destructive' : 'text-[var(--text-secondary)]'
            )}
          >
            {isError && <AlertCircle size={14} aria-hidden="true" />}
            {errorMessage ?? helperText}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
