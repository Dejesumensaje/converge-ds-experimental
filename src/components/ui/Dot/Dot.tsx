import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../lib/utils'

const dotVariants = cva(
  'block shrink-0 rounded-full',
  {
    variants: {
      tone: {
        neutral:     'bg-muted-foreground',
        success:     'bg-success',
        negative:    'bg-destructive',
        warning:     'bg-warning',
        'in-progress': 'bg-informative',
      },
      size: {
        sm: 'w-1.5 h-1.5',   // 6px
        md: 'w-2 h-2',        // 8px
        lg: 'w-3 h-3',        // 12px
      },
    },
    defaultVariants: {
      tone: 'neutral',
      size: 'md',
    },
  }
)

export type DotProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'aria-label'> & {
  tone?: VariantProps<typeof dotVariants>['tone']
  size?: VariantProps<typeof dotVariants>['size']
  'aria-label': string
}

export const Dot = React.forwardRef<HTMLSpanElement, DotProps>(
  ({ tone, size, className, ...restProps }, ref) => (
    <span
      ref={ref}
      role="img"
      className={cn(dotVariants({ tone, size }), className)}
      {...restProps}
    />
  )
)

Dot.displayName = 'Dot'
