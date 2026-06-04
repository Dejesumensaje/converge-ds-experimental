import * as React from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '../../../lib/utils'

/* =================================================================
   Types
   ================================================================= */

export type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'rows'
> & {
  label?: string
  helperText?: string
  /**
   * Error state. Pass `true` for visual-only error, or a string for error + message.
   */
  error?: boolean | string
  /** Number of visible text rows. Default: 3. */
  rows?: number
  /** className applied to the outer wrapper div */
  className?: string
}

/* =================================================================
   Component
   ================================================================= */

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      rows = 3,
      className,
      disabled,
      id: idProp,
      onFocus,
      onBlur,
      onMouseEnter,
      onMouseLeave,
      ...restProps
    },
    ref
  ) => {
    const autoId = React.useId()
    const textareaId = idProp ?? autoId
    const helperId = `${textareaId}-helper`

    /* ── Interaction state ──────────────────────────────────────── */
    const [focused, setFocused] = React.useState(false)
    const [hovered, setHovered] = React.useState(false)

    const isError = Boolean(error)
    const errorMessage = typeof error === 'string' ? error : undefined

    /* ── Ring (border) class ────────────────────────────────────── */
    const getRingClass = () => {
      if (disabled) return 'ring-1 ring-[var(--neutral-gray3)]'
      if (isError) return 'ring-2 ring-destructive'
      if (focused) return 'ring-2 ring-selection'
      if (hovered) return 'ring-1 ring-[var(--neutral-dark)]'
      return 'ring-1 ring-[var(--neutral-gray4)]'
    }

    /* ── Label color ─────────────────────────────────────────────── */
    const labelColor = disabled
      ? 'var(--text-disabled)'
      : isError
      ? 'var(--destructive)'
      : focused
      ? 'var(--selection)'
      : 'var(--muted-foreground)'

    /* ── Event handlers ─────────────────────────────────────────── */
    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setFocused(false)
      onBlur?.(e)
    }

    const handleMouseEnter = (e: React.MouseEvent<HTMLTextAreaElement>) => {
      if (!disabled) {
        setHovered(true)
        onMouseEnter?.(e)
      }
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLTextAreaElement>) => {
      if (!disabled) {
        setHovered(false)
        onMouseLeave?.(e)
      }
    }

    return (
      <div className={cn('flex flex-col gap-[var(--spacing-xxs)]', className)}>
        {/* ── Label ─────────────────────────────────────────────── */}
        {label && (
          <label
            htmlFor={textareaId}
            className="input-inputlabel"
            style={{ color: labelColor }}
          >
            {label}
          </label>
        )}

        {/* ── Textarea ──────────────────────────────────────────── */}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-invalid={isError || undefined}
          aria-describedby={errorMessage || helperText ? helperId : undefined}
          aria-disabled={disabled || undefined}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            /* layout */
            'w-full rounded-[var(--radius-m)] transition-all duration-150',
            /* self-contained reset (§3.6) */
            'appearance-none border-0 m-0 box-border outline-none',
            /* colors */
            'bg-[var(--input-background)] text-foreground',
            /* typography */
            'input-inputtext',
            /* placeholder */
            'placeholder:text-[var(--muted-foreground)]',
            /* spacing */
            'px-[var(--spacing-m)] py-[var(--spacing-m)]',
            /* resize — vertical only */
            'resize-y',
            /* ring */
            getRingClass(),
            /* disabled */
            disabled && 'opacity-40 cursor-not-allowed',
          )}
          {...restProps}
        />

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

Textarea.displayName = 'Textarea'
