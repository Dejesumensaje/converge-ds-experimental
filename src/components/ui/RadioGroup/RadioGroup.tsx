import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { AlertCircle } from 'lucide-react'
import { cn } from '../../../lib/utils'
import './radiogroup.css'

/* =================================================================
   Types
   ================================================================= */

export type RadioGroupSize = 'sm' | 'md'

export type RadioGroupProps = {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
  size?: RadioGroupSize
  /** Triggers error styling on all items. */
  invalid?: boolean
  /** Error copy rendered below the group. Also sets invalid. */
  errorMessage?: string
  helperText?: string
  className?: string
  children: React.ReactNode
}

export type RadioGroupItemProps = {
  value: string
  id?: string
  label: string
  description?: string
  disabled?: boolean
  /** Override the parent group size for this item. */
  size?: RadioGroupSize
  className?: string
}

/* =================================================================
   Dimension maps
   ================================================================= */

const CIRCLE: Record<RadioGroupSize, { circle: string; border: string; dot: string }> = {
  sm: { circle: 'w-[14px] h-[14px]', border: 'border-[1.5px]', dot: 'w-[6px] h-[6px]' },
  md: { circle: 'w-[16px] h-[16px]', border: 'border-2',       dot: 'w-[8px] h-[8px]' },
}

const LABEL_TYPE: Record<RadioGroupSize, string> = {
  sm: 'body-body2-regular',
  md: 'body-body1-regular',
}

/* =================================================================
   Context — propagates size + error state to items
   ================================================================= */

type RadioGroupCtx = { size: RadioGroupSize; invalid: boolean }
const RadioGroupContext = React.createContext<RadioGroupCtx>({ size: 'md', invalid: false })

/* =================================================================
   RadioGroup (root)
   ================================================================= */

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      disabled = false,
      orientation = 'vertical',
      size = 'md',
      invalid = false,
      errorMessage,
      helperText,
      className,
      children,
    },
    ref
  ) => {
    const baseId   = React.useId()
    const errorId  = `${baseId}-error`
    const helperId = `${baseId}-helper`
    const hasError  = invalid || !!errorMessage
    const descById  = errorMessage ? errorId : helperText ? helperId : undefined

    return (
      <RadioGroupContext.Provider value={{ size, invalid: hasError }}>
        <div className="inline-flex flex-col gap-[var(--spacing-xxs)]">
          <RadioGroupPrimitive.Root
            ref={ref}
            value={value}
            defaultValue={defaultValue}
            onValueChange={onValueChange}
            disabled={disabled}
            orientation={orientation}
            aria-invalid={hasError ? true : undefined}
            aria-describedby={descById}
            className={cn(
              'flex gap-[var(--spacing-s)]',
              orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
              className
            )}
          >
            {children}
          </RadioGroupPrimitive.Root>

          {/* ── Below-group messaging ──────────────────────────────── */}
          {errorMessage ? (
            <div id={errorId} role="alert" className="flex items-center gap-[var(--spacing-xxs)]">
              <AlertCircle size={12} className="text-[var(--destructive)] shrink-0" aria-hidden />
              <span className="body-body2-regular text-[var(--destructive)]">{errorMessage}</span>
            </div>
          ) : helperText ? (
            <p id={helperId} className="body-body2-regular text-muted-foreground" style={{ margin: 0 }}>
              {helperText}
            </p>
          ) : null}
        </div>
      </RadioGroupContext.Provider>
    )
  }
)

RadioGroup.displayName = 'RadioGroup'

/* =================================================================
   RadioGroupItem
   ================================================================= */

export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(
  (
    {
      value,
      id,
      label,
      description,
      disabled = false,
      size: sizeProp,
      className,
    },
    ref
  ) => {
    const autoId = React.useId()
    const itemId = id ?? autoId
    const { size: ctxSize, invalid } = React.useContext(RadioGroupContext)
    const size = sizeProp ?? ctxSize
    const d = CIRCLE[size]

    return (
      <div className={cn('flex items-start gap-[var(--spacing-s)]', className)}>
        <RadioGroupPrimitive.Item
          ref={ref}
          id={itemId}
          value={value}
          disabled={disabled}
          className={cn(
            /* Self-contained reset */
            '[box-sizing:border-box] appearance-none',
            /* Shape — full circle, --radius-full */
            'inline-flex shrink-0 items-center justify-center rounded-full',
            d.circle,
            d.border,
            'transition-colors duration-150 cursor-pointer',
            /* Optical alignment with first line of label */
            'mt-[var(--spacing-tiny)]',
            /* Unselected base */
            'border-[var(--border)] bg-transparent',
            'hover:border-[var(--foreground)]',
            /* Selected → --selection */
            'data-[state=checked]:border-[var(--selection)]',
            'data-[state=checked]:hover:border-[color-mix(in_srgb,var(--selection)_85%,white)]',
            /* Error — override border */
            invalid && [
              'border-[var(--destructive)] hover:border-[var(--destructive)]',
              'data-[state=checked]:border-[var(--destructive)]',
              'data-[state=checked]:hover:border-[var(--destructive)]',
            ],
            /* Focus ring */
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            'focus-visible:ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]',
            /* Disabled */
            'disabled:cursor-not-allowed disabled:opacity-40 disabled:pointer-events-none',
          )}
        >
          <RadioGroupPrimitive.Indicator className="radio-indicator flex items-center justify-center">
            <span
              className={cn(
                'block rounded-full',
                d.dot,
                invalid ? 'bg-[var(--destructive)]' : 'bg-[var(--selection)]',
              )}
            />
          </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>

        <label
          htmlFor={itemId}
          className={cn(
            'flex flex-col gap-[var(--spacing-xxs)]',
            disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
          )}
        >
          <span className={cn(LABEL_TYPE[size], 'select-none text-foreground')}>
            {label}
          </span>
          {description && (
            <span className="body-body2-regular text-muted-foreground select-none">
              {description}
            </span>
          )}
        </label>
      </div>
    )
  }
)

RadioGroupItem.displayName = 'RadioGroupItem'
