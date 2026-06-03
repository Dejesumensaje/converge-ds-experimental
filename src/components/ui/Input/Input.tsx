import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { cn } from '../../../lib/utils'

/* =================================================================
   CVA — wrapper structural classes (size only)
   ================================================================= */

const inputWrapperVariants = cva(
  'relative flex items-center rounded-[var(--radius-m)] transition-all duration-150',
  {
    variants: {
      size: {
        sm: 'h-10',
        md: 'h-12',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

/* =================================================================
   Icon size map
   ================================================================= */

const ICON_SIZE: Record<NonNullable<VariantProps<typeof inputWrapperVariants>['size']>, number> = {
  sm: 16,
  md: 20,
}

/* =================================================================
   Types
   ================================================================= */

type InputSize = NonNullable<VariantProps<typeof inputWrapperVariants>['size']>

type BaseInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: InputSize
  variant?: 'default' | 'borderless'
  iconLeft?: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  iconRight?: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  /**
   * When true, renders an Eye/EyeOff toggle button in the right slot.
   * Manages `type` internally (password ↔ text). Supersedes `iconRight`.
   */
  revealable?: boolean
  errorMessage?: string
  helperText?: string
  /** className applied to the outer wrapper div */
  className?: string
}

export type InputProps =
  | (BaseInputProps & { label: string; 'aria-label'?: string })
  | (BaseInputProps & { label?: undefined; 'aria-label': string })

/* =================================================================
   Component
   ================================================================= */

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      'aria-label': ariaLabel,
      size = 'md',
      variant = 'default',
      iconLeft: IconLeft,
      iconRight: IconRight,
      revealable = false,
      errorMessage,
      helperText,
      className,
      disabled,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      onMouseEnter,
      onMouseLeave,
      id: idProp,
      type: typeProp,
      ...restProps
    },
    ref
  ) => {
    const autoId = React.useId()
    const inputId = idProp ?? autoId
    const helperId = `${inputId}-helper`

    /* ── Interaction state ──────────────────────────────────────── */
    const [focused, setFocused] = React.useState(false)
    const [hovered, setHovered] = React.useState(false)

    /* ── Password reveal state ──────────────────────────────────── */
    const [revealed, setRevealed] = React.useState(false)

    /* Effective input type — revealable overrides consumer's type prop */
    const inputType = revealable
      ? (revealed ? 'text' : 'password')
      : (typeProp ?? 'text')

    /* ── Controlled vs uncontrolled value tracking ─────────────── */
    const isControlled = value !== undefined
    const [localValue, setLocalValue] = React.useState<string>(
      defaultValue !== undefined ? String(defaultValue) : ''
    )
    const currentValue = isControlled ? String(value ?? '') : localValue
    const hasValue = currentValue.length > 0

    const isFloated = focused || hasValue
    const isError = Boolean(errorMessage)

    /* ── Ring (border) class ────────────────────────────────────── */
    const getRingClass = () => {
      if (disabled) return 'ring-1 ring-[var(--neutral-gray3)]'
      if (isError) return 'ring-2 ring-destructive'
      if (focused) return 'ring-2 ring-selection'
      if (variant === 'default') {
        if (hovered || hasValue) return 'ring-1 ring-[var(--neutral-dark)]'
        return 'ring-1 ring-[var(--neutral-gray4)]'
      }
      // borderless
      if (hasValue) return 'ring-1 ring-[var(--neutral-gray4)]'
      return ''
    }

    /* ── Background class ───────────────────────────────────────── */
    const getBgClass = () => {
      if (variant === 'borderless') {
        if (focused || hasValue || isError) return 'bg-[var(--input-background)]'
        if (hovered) return 'bg-muted'
        return 'bg-transparent'
      }
      return 'bg-[var(--input-background)]'
    }

    /* ── Icon horizontal offsets ────────────────────────────────── */
    const leftPad = IconLeft
      ? size === 'sm' ? 'pl-[36px]' : 'pl-[44px]'
      : size === 'sm' ? 'pl-[var(--spacing-m)]' : 'pl-[var(--spacing-l)]'

    /* revealable always occupies the right slot */
    const hasRightSlot = !!IconRight || revealable
    const rightPad = hasRightSlot
      ? size === 'sm' ? 'pr-[36px]' : 'pr-[44px]'
      : size === 'sm' ? 'pr-[var(--spacing-m)]' : 'pr-[var(--spacing-l)]'

    /* ── Floating label position ────────────────────────────────── */
    const labelLeftResting = IconLeft
      ? size === 'sm' ? '36px' : '44px'
      : size === 'sm' ? 'var(--spacing-m)' : 'var(--spacing-l)'

    const labelLeftFloated = size === 'sm' ? 'var(--spacing-m)' : 'var(--spacing-l)'

    const labelColor = disabled
      ? 'var(--text-disabled)'
      : isError
      ? 'var(--destructive)'
      : focused
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

    /* ── Event handlers ─────────────────────────────────────────── */
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false)
      onBlur?.(e)
    }

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      setHovered(true)
      onMouseEnter?.(e as unknown as React.MouseEvent<HTMLInputElement>)
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      setHovered(false)
      onMouseLeave?.(e as unknown as React.MouseEvent<HTMLInputElement>)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setLocalValue(e.target.value)
      onChange?.(e)
    }

    const iconColor = disabled ? 'var(--text-disabled)' : 'var(--muted-foreground)'

    /* Right-slot position shared by both static icon and reveal button */
    const rightSlotStyle: React.CSSProperties = {
      right: size === 'sm' ? 'var(--spacing-m)' : 'var(--spacing-l)',
      color: iconColor,
    }

    return (
      <div className={cn('flex flex-col gap-[var(--spacing-xxs)]', className)}>
        {/* ── Input wrapper ─────────────────────────────────────── */}
        <div
          className={cn(
            inputWrapperVariants({ size }),
            getRingClass(),
            getBgClass(),
            disabled && 'opacity-40 cursor-not-allowed'
          )}
          onMouseEnter={!disabled ? handleMouseEnter : undefined}
          onMouseLeave={!disabled ? handleMouseLeave : undefined}
        >
          {/* Left icon */}
          {IconLeft && (
            <span
              className="absolute pointer-events-none"
              style={{
                left: size === 'sm' ? 'var(--spacing-m)' : 'var(--spacing-l)',
                color: iconColor,
              }}
            >
              <IconLeft size={ICON_SIZE[size]} aria-hidden="true" />
            </span>
          )}

          {/* Floating label */}
          {label && (
            <label
              htmlFor={inputId}
              className="absolute whitespace-nowrap pointer-events-none transition-all duration-150"
              style={labelStyle}
            >
              {label}
            </label>
          )}

          {/* Native input */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            aria-label={!label ? ariaLabel : undefined}
            aria-describedby={errorMessage || helperText ? helperId : undefined}
            aria-invalid={isError || undefined}
            aria-required={restProps.required || undefined}
            aria-disabled={disabled || undefined}
            disabled={disabled}
            value={value}
            defaultValue={!isControlled ? defaultValue : undefined}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              'w-full h-full bg-transparent outline-none body-body1-regular',
              'appearance-none border-0 m-0 box-border',
              'text-foreground placeholder-transparent',
              leftPad,
              rightPad,
              disabled && 'cursor-not-allowed'
            )}
            {...restProps}
          />

          {/* Right slot — reveal button (interactive) or static icon */}
          {revealable ? (
            <button
              type="button"
              aria-label={revealed ? 'Hide password' : 'Show password'}
              aria-controls={inputId}
              disabled={disabled}
              onClick={() => setRevealed(r => !r)}
              /*
               * Prevent focus moving away from the input on click.
               * Same pattern used in SearchInput's clear button.
               */
              onMouseDown={e => e.preventDefault()}
              className={cn(
                'absolute flex items-center justify-center',
                'appearance-none border-0 bg-transparent m-0 [font:inherit]',
                'w-6 h-6 rounded-[var(--radius-m)]',
                'transition-colors duration-150',
                'outline-none',
                'focus-visible:ring-2 focus-visible:ring-inset',
                'focus-visible:ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]',
                disabled
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer hover:text-foreground',
              )}
              style={rightSlotStyle}
            >
              {revealed
                ? <EyeOff size={ICON_SIZE[size]} aria-hidden="true" />
                : <Eye    size={ICON_SIZE[size]} aria-hidden="true" />
              }
            </button>
          ) : IconRight ? (
            <span
              className="absolute pointer-events-none"
              style={rightSlotStyle}
            >
              <IconRight size={ICON_SIZE[size]} aria-hidden="true" />
            </span>
          ) : null}
        </div>

        {/* ── Helper / Error text ───────────────────────────────── */}
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

Input.displayName = 'Input'
