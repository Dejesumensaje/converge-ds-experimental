import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '../../../lib/utils'

/* =================================================================
   CVA — structural classes only (no typography, handled separately)
   ================================================================= */

const countBadgeVariants = cva(
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
        sm: 'h-[18px] px-[var(--spacing-s)] gap-[var(--spacing-xxs)]',
        md: 'h-5 px-[var(--spacing-s)] gap-[var(--spacing-xxs)]',
        lg: 'h-6 px-[var(--spacing-m)] gap-[var(--spacing-xxs)]',
      },
    },
    defaultVariants: {
      tone: 'neutral',
      size: 'md',
    },
  }
)

/* =================================================================
   Typography + icon size maps — outside CVA (specificity safety)
   ================================================================= */

const TYPOGRAPHY: Record<NonNullable<VariantProps<typeof countBadgeVariants>['size']>, string> = {
  sm: 'notification-notification',
  md: 'tooltip-tooltip',
  lg: 'body-body2-semibold',
}

const ICON_SIZE: Record<NonNullable<VariantProps<typeof countBadgeVariants>['size']>, number> = {
  sm: 10,
  md: 12,
  lg: 14,
}

/* =================================================================
   Types
   ================================================================= */

export type CountBadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  count: number
  /** When count > maxCount, displays "+{maxCount}". Default 99. */
  maxCount?: number
  tone?: VariantProps<typeof countBadgeVariants>['tone']
  size?: VariantProps<typeof countBadgeVariants>['size']
  /** Leading trend icon. */
  trend?: 'up' | 'down'
}

/* =================================================================
   Component
   ================================================================= */

export const CountBadge = React.forwardRef<HTMLSpanElement, CountBadgeProps>(
  ({ count, maxCount = 99, tone, size = 'md', trend, className, ...restProps }, ref) => {
    const resolvedSize = size ?? 'md'
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null
    const displayText = count > maxCount ? `+${maxCount}` : String(count)

    return (
      <span
        ref={ref}
        className={cn(
          countBadgeVariants({ tone, size: resolvedSize }),
          TYPOGRAPHY[resolvedSize],
          className
        )}
        {...restProps}
      >
        {TrendIcon && <TrendIcon size={ICON_SIZE[resolvedSize]} aria-hidden="true" />}
        {displayText}
      </span>
    )
  }
)

CountBadge.displayName = 'CountBadge'
