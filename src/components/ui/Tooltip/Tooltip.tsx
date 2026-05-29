import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '../../../lib/utils'

/* =================================================================
   Re-export Provider so consumers can wrap their tree once
   ================================================================= */

export const TooltipProvider = TooltipPrimitive.Provider

/* =================================================================
   Types
   ================================================================= */

export type TooltipProps = {
  /** Text or node rendered inside the tooltip bubble. */
  content: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Delay before the tooltip opens, in ms. Default: 400. */
  delayDuration?: number
  className?: string
}

/* =================================================================
   Component
   ================================================================= */

export function Tooltip({
  content,
  children,
  side = 'top',
  delayDuration = 400,
  className,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root delayDuration={delayDuration}>
      <TooltipPrimitive.Trigger asChild>
        {children}
      </TooltipPrimitive.Trigger>

      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={6}
          className={cn(
            /* layout */
            'z-50 px-[var(--spacing-s)] py-[var(--spacing-xxs)] rounded-[var(--radius-m)]',
            /* colors — dark bubble */
            'bg-[var(--neutral-dark)] text-white',
            /* typography */
            'caption-caption',
            /* shadow */
            'shadow-md',
            /* prevent text selection in tooltip */
            'select-none',
            /* fade + slide animation driven by Radix data-state / data-side */
            'origin-[var(--radix-tooltip-transform-origin)]',
            'transition-[opacity,transform] duration-150 ease-out',
            'data-[state=delayed-open]:opacity-100 data-[state=delayed-open]:scale-100',
            'data-[state=closed]:opacity-0 data-[state=closed]:scale-95',
            className
          )}
        >
          {content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}

Tooltip.displayName = 'Tooltip'
