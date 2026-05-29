import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { X, type LucideIcon } from 'lucide-react'
import { cn } from '../../../lib/utils'

/* =================================================================
   CVA — structural + state classes (no typography)
   ================================================================= */

const chipVariants = cva(
  [
    'inline-flex items-center',
    'rounded-[var(--radius-full)]',
    'border border-border',
    'bg-background text-foreground',
    'transition-colors duration-150',
    'select-none',
  ],
  {
    variants: {
      size: {
        sm: ['h-6', 'px-[var(--spacing-s)]',  'gap-[var(--spacing-xxs)]'],
        md: ['h-7', 'px-[var(--spacing-m)]',  'gap-[var(--spacing-xxs)]'],
        lg: ['h-8', 'px-[var(--spacing-l)]',  'gap-[var(--spacing-s)]'],
      },
      isInteractive: {
        true:  'cursor-pointer',
        false: 'cursor-default',
      },
      selected: { true: '', false: '' },
      error:    { true: '', false: '' },
      disabled: {
        true:  'opacity-40 pointer-events-none cursor-not-allowed',
        false: '',
      },
    },
    compoundVariants: [
      // Default hover — interactive, not selected, not error, not disabled
      {
        isInteractive: true,
        selected: false,
        error: false,
        disabled: false,
        className: 'hover:bg-muted',
      },
      // Selected (only when not in error state)
      {
        selected: true,
        error: false,
        className: 'bg-selection border-selection text-selection-foreground',
      },
      // Selected + hover
      {
        selected: true,
        error: false,
        isInteractive: true,
        disabled: false,
        className: 'hover:bg-[color-mix(in_srgb,var(--selection)_90%,white)]',
      },
      // Error — comes AFTER selected rules to override them
      {
        error: true,
        className: 'border-destructive text-destructive',
      },
      // Error + hover
      {
        error: true,
        isInteractive: true,
        disabled: false,
        className: 'hover:bg-error-bg-light',
      },
    ],
    defaultVariants: {
      size: 'md',
      isInteractive: false,
      selected: false,
      error: false,
      disabled: false,
    },
  }
)

/* =================================================================
   Typography + icon size maps — outside CVA (specificity safety)
   ================================================================= */

const TYPOGRAPHY: Record<NonNullable<VariantProps<typeof chipVariants>['size']>, string> = {
  sm: 'tooltip-tooltip',
  md: 'body-body2-semibold',
  lg: 'body-body1-semibold',
}

const ICON_SIZE: Record<NonNullable<VariantProps<typeof chipVariants>['size']>, number> = {
  sm: 12,
  md: 14,
  lg: 16,
}

/* =================================================================
   Types
   ================================================================= */

export type ChipProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> & {
  size?: VariantProps<typeof chipVariants>['size']
  /** Leading icon (optional). */
  icon?: LucideIcon
  /** If provided, chip body becomes interactive (role="button"). */
  onClick?: () => void
  /** If provided, renders a close button with an X icon. */
  onClose?: () => void
  /** aria-label for the close button. Default "Remove". */
  closeLabel?: string
  /** Visual + ARIA selected state. Meaningful when onClick is also set. */
  selected?: boolean
  /** Error state: destructive border + text. */
  error?: boolean
  /** Disabled: opacity 0.4, pointer-events none, removed from tab order. */
  disabled?: boolean
  children: React.ReactNode
}

/* =================================================================
   Component
   ================================================================= */

export const Chip = React.forwardRef<HTMLElement, ChipProps>(
  (
    {
      size = 'md',
      icon: Icon,
      onClick,
      onClose,
      closeLabel = 'Remove',
      selected = false,
      error = false,
      disabled = false,
      children,
      className,
      ...restProps
    },
    ref
  ) => {
    const resolvedSize = size ?? 'md'
    const iconSize = ICON_SIZE[resolvedSize]
    const typographyClass = TYPOGRAPHY[resolvedSize]

    // Body is interactive only when onClick is present
    const hasBodyInteraction = !!onClick
    // Root is a div whenever any interactivity is present (onClick or onClose)
    const hasAnyInteraction = !!onClick || !!onClose

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClick?.()
      }
    }

    const computedClassName = cn(
      chipVariants({
        size: resolvedSize,
        isInteractive: hasBodyInteraction,
        selected,
        error,
        disabled,
      }),
      typographyClass,
      className
    )

    // Close button — lives inside the chip as a separate focus stop
    const closeButton = onClose ? (
      <button
        type="button"
        aria-label={closeLabel}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          'flex items-center',
          'hover:opacity-70',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm'
        )}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation() // must not trigger the chip body's onClick
          onClose()
        }}
      >
        <X size={iconSize} aria-hidden="true" />
      </button>
    ) : null

    const content = (
      <>
        {Icon && <Icon size={iconSize} aria-hidden="true" />}
        {children}
        {closeButton}
      </>
    )

    // ── Interactive root (div) ──────────────────────────────────────
    if (hasAnyInteraction) {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          role={hasBodyInteraction ? 'button' : undefined}
          tabIndex={hasBodyInteraction ? (disabled ? -1 : 0) : undefined}
          aria-pressed={hasBodyInteraction ? selected : undefined}
          aria-disabled={disabled ? true : undefined}
          onClick={hasBodyInteraction && !disabled ? onClick : undefined}
          onKeyDown={hasBodyInteraction ? handleKeyDown : undefined}
          className={computedClassName}
          {...(restProps as React.HTMLAttributes<HTMLDivElement>)}
        >
          {content}
        </div>
      )
    }

    // ── Display-only root (span) ────────────────────────────────────
    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        className={computedClassName}
        {...(restProps as React.HTMLAttributes<HTMLSpanElement>)}
      >
        {content}
      </span>
    )
  }
)

Chip.displayName = 'Chip'
