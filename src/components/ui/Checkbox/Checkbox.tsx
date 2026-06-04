import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus, AlertCircle } from 'lucide-react'
import { cn } from '../../../lib/utils'
import './checkbox.css'

/* =================================================================
   Types
   ================================================================= */

export type CheckboxSize = 'sm' | 'md'

type BaseCheckboxProps = {
  id?: string
  size?: CheckboxSize
  /** Pass `'indeterminate'` for tri-state. Requires controlled mode. */
  checked?: boolean | 'indeterminate'
  defaultChecked?: boolean | 'indeterminate'
  onCheckedChange?: (checked: boolean | 'indeterminate') => void
  disabled?: boolean
  /** Triggers error styling (red border). */
  error?: boolean
  helperText?: string
  /** Optional error copy. Also sets error state when present. */
  errorMessage?: string
  className?: string
}

/**
 * Either `label` or `aria-label` is required to give the control an accessible name.
 * When both are provided the visible label takes precedence for sighted users; `aria-label`
 * is forwarded to the underlying button for screen readers.
 */
export type CheckboxProps =
  | (BaseCheckboxProps & { label: string; 'aria-label'?: string })
  | (BaseCheckboxProps & { label?: never; 'aria-label': string })

/* =================================================================
   Dimension maps
   ================================================================= */

const BOX: Record<CheckboxSize, { size: string; border: string; icon: number }> = {
  sm: { size: 'w-[14px] h-[14px]', border: 'border-[1.5px]', icon: 10 },
  md: { size: 'w-[16px] h-[16px]', border: 'border-2',       icon: 12 },
}

const LABEL_TYPE: Record<CheckboxSize, string> = {
  sm: 'body-body2-regular',
  md: 'body-body1-regular',
}

/* =================================================================
   Checkbox
   ================================================================= */

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    {
      id,
      size = 'md',
      checked,
      defaultChecked,
      onCheckedChange,
      disabled = false,
      error = false,
      label,
      helperText,
      errorMessage,
      className,
      'aria-label': ariaLabel,
    },
    ref
  ) => {
    const autoId = React.useId()
    const inputId = id ?? autoId
    const errorId  = `${inputId}-error`
    const helperId = `${inputId}-helper`
    const hasError  = error || !!errorMessage
    const descById  = errorMessage ? errorId : helperText ? helperId : undefined
    const b = BOX[size]

    /* Indicator icon — indeterminate only ever set explicitly (controlled). */
    const isIndeterminate = checked === 'indeterminate'

    return (
      <div className="inline-flex flex-col gap-[var(--spacing-xxs)]">
        {/* ── Control row — min-h-[44px] ensures 44px effective touch target ── */}
        <div className="inline-flex min-h-[44px] items-center gap-[var(--spacing-s)]">
          <CheckboxPrimitive.Root
            ref={ref}
            id={inputId}
            checked={checked}
            defaultChecked={defaultChecked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            aria-label={ariaLabel}
            aria-invalid={hasError ? true : undefined}
            aria-disabled={disabled || undefined}
            aria-describedby={descById}
            className={cn(
              /* Self-contained reset — must not rely on preflight */
              'checkbox-root [box-sizing:border-box] appearance-none',
              /* Layout + shape */
              'inline-flex shrink-0 items-center justify-center',
              /* radius-xs = 4px — soft-square corner */
              'rounded-[var(--radius-xs)]',
              b.border,
              b.size,
              'transition-colors duration-150 cursor-pointer',
              /* Unchecked base — --foreground border ensures ≥3:1 contrast (WCAG 1.4.11) */
              'border-[var(--foreground)] bg-transparent',
              /* Unchecked hover — bg tint; border already dark so no border change needed */
              'hover:bg-[var(--muted)]',
              /* Checked fill → --selection (#000 light / #FFF dark) */
              'data-[state=checked]:bg-[var(--selection)]',
              'data-[state=checked]:border-[var(--selection)]',
              'data-[state=checked]:hover:bg-[color-mix(in_srgb,var(--selection)_85%,var(--background))]',
              'data-[state=checked]:hover:border-[color-mix(in_srgb,var(--selection)_85%,var(--background))]',
              /* Indeterminate fill → --selection */
              'data-[state=indeterminate]:bg-[var(--selection)]',
              'data-[state=indeterminate]:border-[var(--selection)]',
              'data-[state=indeterminate]:hover:bg-[color-mix(in_srgb,var(--selection)_85%,var(--background))]',
              'data-[state=indeterminate]:hover:border-[color-mix(in_srgb,var(--selection)_85%,var(--background))]',
              /* Error — override border with --destructive regardless of state */
              hasError && [
                'border-[var(--destructive)] hover:border-[var(--destructive)]',
                'data-[state=checked]:border-[var(--destructive)]',
                'data-[state=checked]:hover:border-[var(--destructive)]',
                'data-[state=indeterminate]:border-[var(--destructive)]',
                'data-[state=indeterminate]:hover:border-[var(--destructive)]',
              ],
              /* Focus ring — --ring (green) via brand color */
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              'focus-visible:ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]',
              /* Active press feedback */
              'active:opacity-80',
              /* Disabled */
              'disabled:cursor-not-allowed disabled:opacity-40 disabled:pointer-events-none',
              className
            )}
          >
            {/* --selection-foreground adapts per theme: #FFF on black (light), #212121 on white (dark) */}
            <CheckboxPrimitive.Indicator className="checkbox-indicator flex items-center justify-center text-[var(--selection-foreground)]">
              {isIndeterminate
                ? <Minus   size={b.icon} strokeWidth={3} aria-hidden />
                : <Check   size={b.icon} strokeWidth={3} aria-hidden />
              }
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>

          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                LABEL_TYPE[size],
                'select-none',
                disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
              )}
            >
              {label}
            </label>
          )}
        </div>

        {/* ── Below-control messaging ──────────────────────────────── */}
        {errorMessage ? (
          <div id={errorId} role="status" className="flex items-center gap-[var(--spacing-xxs)]">
            <AlertCircle size={12} className="text-[var(--destructive)] shrink-0" aria-hidden />
            <span className="body-body2-regular text-[var(--destructive)]">{errorMessage}</span>
          </div>
        ) : helperText ? (
          <p id={helperId} className="body-body2-regular text-foreground m-0">
            {helperText}
          </p>
        ) : null}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
