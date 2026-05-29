import * as React from 'react'
import { cn } from '../../../lib/utils'
import './switch.css'

/* =================================================================
   Types
   ================================================================= */

type BaseSwitchProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'role' | 'onClick'
> & {
  checked: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  labelPosition?: 'left' | 'right'
  size?: 'sm' | 'md'
  disabled?: boolean
}

export type SwitchProps =
  | (BaseSwitchProps & { label: string; 'aria-label'?: string })
  | (BaseSwitchProps & { label?: undefined; 'aria-label': string })

/* =================================================================
   Dimension maps
   ================================================================= */

const TRACK: Record<'sm' | 'md', { track: string; knob: string; translate: string }> = {
  sm: {
    track: 'w-8 h-4',          // 32×16px
    knob:  'w-3 h-3',          // 12×12px
    translate: 'translateX(16px)',
  },
  md: {
    track: 'w-10 h-5',         // 40×20px
    knob:  'w-4 h-4',          // 16×16px
    translate: 'translateX(20px)',
  },
}

const LABEL_TYPOGRAPHY: Record<'sm' | 'md', string> = {
  sm: 'body-body2-regular',
  md: 'body-body1-regular',
}

/* =================================================================
   Component
   ================================================================= */

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      onCheckedChange,
      label,
      'aria-label': ariaLabel,
      labelPosition = 'right',
      size = 'md',
      disabled = false,
      className,
      ...restProps
    },
    ref
  ) => {
    const dims = TRACK[size]

    const handleClick = () => {
      if (!disabled) onCheckedChange?.(!checked)
    }

    const trackBg = checked
      ? 'bg-selection hover:bg-[color-mix(in_srgb,var(--selection)_90%,white)]'
      : 'bg-[var(--neutral-gray3)] hover:bg-[var(--neutral-gray4)]'

    const labelEl = label ? (
      <span className={cn(LABEL_TYPOGRAPHY[size], 'select-none', disabled && 'opacity-40')}>
        {label}
      </span>
    ) : null

    const track = (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={!label ? ariaLabel : undefined}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          'switch-track',
          'inline-flex items-center shrink-0 rounded-full p-0.5 cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'focus-visible:ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]',
          'disabled:cursor-not-allowed disabled:opacity-40 disabled:pointer-events-none',
          trackBg,
          dims.track,
          className
        )}
        {...restProps}
      >
        <span
          className={cn(
            'switch-knob',
            'block rounded-full bg-[var(--neutral-light)]',
            dims.knob
          )}
          style={{
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.15)',
            transform: checked ? dims.translate : 'translateX(0)',
          }}
        />
      </button>
    )

    return (
      <label
        className={cn(
          'inline-flex items-center gap-3',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        )}
      >
        {labelPosition === 'left' && labelEl}
        {track}
        {labelPosition === 'right' && labelEl}
      </label>
    )
  }
)

Switch.displayName = 'Switch'
