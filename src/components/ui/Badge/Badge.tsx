import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { type LucideIcon } from 'lucide-react'
import { cn } from '../../../lib/utils'

/* =================================================================
   CVA — structural classes only (no typography, handled separately)
   ================================================================= */

const badgeVariants = cva(
  'inline-flex items-center shrink-0 rounded-[var(--radius-full)]',
  {
    variants: {
      tone: {
        neutral:       'bg-muted text-foreground',
        success:       'bg-success-bg-light text-success',
        negative:      'bg-error-bg-light text-destructive',
        warning:       'bg-warning-bg-light text-warning-foreground',
        'in-progress': 'bg-informative-bg-light text-informative',
      },
      size: {
        sm: 'h-5 px-[var(--spacing-s)] gap-[var(--spacing-xxs)]',
        md: 'h-6 px-[var(--spacing-m)] gap-[var(--spacing-xxs)]',
        lg: 'h-7 px-[var(--spacing-m)] gap-[var(--spacing-s)]',
      },
    },
    defaultVariants: {
      tone: 'neutral',
      size: 'md',
    },
  }
)

/* =================================================================
   Typography map — outside CVA to avoid specificity collisions
   ================================================================= */

const TYPOGRAPHY: Record<NonNullable<VariantProps<typeof badgeVariants>['size']>, string> = {
  sm: 'notification-notification',
  md: 'tooltip-tooltip',
  lg: 'body-body2-semibold',
}

const ICON_SIZE: Record<NonNullable<VariantProps<typeof badgeVariants>['size']>, number> = {
  sm: 12,
  md: 14,
  lg: 16,
}

/* =================================================================
   Types
   ================================================================= */

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: VariantProps<typeof badgeVariants>['tone']
  size?: VariantProps<typeof badgeVariants>['size']
  icon?: LucideIcon
  children: React.ReactNode
}

/* =================================================================
   Component
   ================================================================= */

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ tone, size = 'md', icon: Icon, children, className, ...restProps }, ref) => {
    const resolvedSize = size ?? 'md'
    const iconSize = ICON_SIZE[resolvedSize]
    const typographyClass = TYPOGRAPHY[resolvedSize]

    return (
      <span
        ref={ref}
        className={cn(
          badgeVariants({ tone, size: resolvedSize }),
          typographyClass,
          className
        )}
        {...restProps}
      >
        {Icon && <Icon size={iconSize} aria-hidden="true" />}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'
