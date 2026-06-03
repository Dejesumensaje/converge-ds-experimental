import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2, type LucideIcon } from 'lucide-react'
import { cn } from '../../../lib/utils'
import './button.css'

/* =================================================================
   CVA — structural classes only (no typography, handled separately)
   ================================================================= */

const buttonVariants = cva(
  [
    'btn',
    'inline-flex items-center justify-center gap-2',
    'whitespace-nowrap shrink-0',
    'transition-colors duration-150',
    'cursor-pointer select-none',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-offset-2',
    'focus-visible:ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]',
    'disabled:opacity-40',
    'disabled:pointer-events-none',
    'disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-primary text-primary-foreground',
          'hover:bg-success',
          'rounded-[var(--radius-badge)]',
        ],
        secondary: [
          'border border-border text-foreground bg-transparent',
          'hover:bg-muted',
          'rounded-[var(--radius-badge)]',
        ],
        tertiary: [
          'text-foreground bg-transparent',
          'hover:bg-muted',
          'rounded-[var(--radius-badge)]',
        ],
        'text-link': [
          'text-foreground bg-transparent',
          'hover:underline',
          'rounded-none',
        ],
      },
      size: {
        sm: ['h-8', 'px-[var(--spacing-l)]', 'py-[var(--spacing-s)]'],
        md: ['h-10', 'px-[var(--spacing-xl)]', 'py-[var(--spacing-m)]'],
        lg: ['h-12', 'px-[var(--spacing-xxl)]', 'py-[var(--spacing-l)]'],
      },
      iconOnly: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // text-link: override size-driven height and padding (must come after size)
      { variant: 'text-link', className: 'h-auto p-0' },
      // icon-only: square, no padding
      { iconOnly: true, size: 'sm', className: 'w-8 h-8 p-0' },
      { iconOnly: true, size: 'md', className: 'w-10 h-10 p-0' },
      { iconOnly: true, size: 'lg', className: 'w-12 h-12 p-0' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      iconOnly: false,
    },
  }
)

/* =================================================================
   Typography map — computed outside CVA to avoid class collisions
   when text-link needs body-body1-regular instead of button-* sizes
   ================================================================= */

const TYPOGRAPHY: Record<NonNullable<VariantProps<typeof buttonVariants>['size']>, string> = {
  sm: 'button-small',
  md: 'button-medium',
  lg: 'button-large',
}

const ICON_SIZE: Record<NonNullable<VariantProps<typeof buttonVariants>['size']>, number> = {
  sm: 16,
  md: 20,
  lg: 24,
}

/* =================================================================
   Error class map — per variant
   ================================================================= */

function getErrorClasses(variant: string): string {
  switch (variant) {
    case 'primary':
      return 'bg-destructive text-destructive-foreground hover:bg-[color-mix(in_srgb,var(--destructive)_90%,black)]'
    case 'secondary':
      return 'border-destructive text-destructive bg-transparent hover:bg-[color-mix(in_srgb,var(--destructive)_8%,transparent)]'
    case 'tertiary':
      return 'text-destructive bg-transparent hover:bg-[color-mix(in_srgb,var(--destructive)_8%,transparent)]'
    default:
      // text-link — hover:underline already comes from the variant base
      return 'text-destructive'
  }
}

function getPressedClasses(variant: string): string {
  switch (variant) {
    case 'primary':
      // bg moves to --success (darker green). Text stays white (from variant base).
      // hover bg anchored to --success so mouse-over doesn't override the pressed state.
      return 'bg-success hover:bg-success'
    case 'secondary':
      // outline and text move to primary green. No bg (keeps outline-only identity).
      // hover bg cancelled so muted gray doesn't bleed through.
      return 'border-primary text-primary hover:bg-transparent'
    case 'tertiary':
      // text moves to primary green only. No outline, no bg (keeps ghost identity).
      // hover bg cancelled.
      return 'text-primary hover:bg-transparent'
    default:
      // text-link: pressed excluded by spec
      return ''
  }
}

/* =================================================================
   Types
   ================================================================= */

type BaseButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>
  & Omit<VariantProps<typeof buttonVariants>, 'iconOnly'>
  & {
    iconLeft?: LucideIcon
    iconRight?: LucideIcon
    /** Only meaningful when variant="secondary" */
    glass?: boolean
    /** Toggle-state button. Applies primary treatment + aria-pressed. Not for text-link. */
    pressed?: boolean
    /** Shows Loader2 spinner. pointer-events: none, aria-busy. No color change. */
    loading?: boolean
    /** Error state colors per variant. */
    error?: boolean
  }

export type ButtonProps =
  | (BaseButtonProps & { children: React.ReactNode; 'aria-label'?: string })
  | (BaseButtonProps & { children?: undefined; 'aria-label': string })

/* =================================================================
   Component
   ================================================================= */

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      iconLeft: IconLeft,
      iconRight: IconRight,
      glass = false,
      pressed,
      loading = false,
      error = false,
      children,
      disabled,
      onClick,
      ...restProps
    },
    ref
  ) => {
    const resolvedVariant = variant ?? 'primary'
    const resolvedSize = size ?? 'md'
    const isIconOnly = !children
    const iconSize = ICON_SIZE[resolvedSize]

    // Loading: show Loader2 in place of iconLeft (or as left icon if none)
    const RenderedLeftIcon = loading ? Loader2 : IconLeft
    const showLeftIcon = loading || !!IconLeft

    // Glass inline styles (base only; hover is in button.css)
    const glassStyle: React.CSSProperties | undefined =
      glass && resolvedVariant === 'secondary'
        ? {
            background: 'rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: [
              'inset 0 1px 0 rgba(255, 255, 255, 0.4)',
              'inset 0 -1px 0 rgba(0, 0, 0, 0.05)',
              '0 8px 32px rgba(0, 0, 0, 0.1)',
            ].join(', '),
          }
        : undefined

    const typographyClass =
      resolvedVariant === 'text-link' ? 'body-body1-regular' : TYPOGRAPHY[resolvedSize]

    const computedClassName = cn(
      buttonVariants({ variant: resolvedVariant, size: resolvedSize, iconOnly: isIconOnly }),
      typographyClass,
      // loading: prevent interaction but no opacity / color change
      loading && 'pointer-events-none',
      // error state
      error && getErrorClasses(resolvedVariant),
      // pressed: primary treatment (not for text-link)
      pressed && getPressedClasses(resolvedVariant),
      // glass: activates the CSS hover rule in button.css
      glass && resolvedVariant === 'secondary' && 'btn-glass',
      className
    )

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        aria-disabled={disabled ? true : undefined}
        aria-busy={loading ? true : undefined}
        aria-pressed={pressed !== undefined ? pressed : undefined}
        style={glassStyle}
        className={computedClassName}
        onClick={loading ? undefined : onClick}
        {...restProps}
      >
        {showLeftIcon && RenderedLeftIcon && (
          <RenderedLeftIcon
            size={iconSize}
            aria-hidden="true"
            className={loading ? 'animate-spin' : undefined}
          />
        )}

        {children}

        {IconRight && !loading && (
          <IconRight size={iconSize} aria-hidden="true" />
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
