import * as React from 'react'
import { cn } from '../../../lib/utils'
import './skeleton.css'

/*
  A11Y NOTE:
  Each <Skeleton> is purely decorative → aria-hidden="true".
  The CONTAINER that switches between skeleton and real content
  should carry:
    <div role="status" aria-live="polite" aria-busy={isLoading}>
  This announces "loading" once to screen readers, not per-skeleton.
*/

/* =================================================================
   Types
   ================================================================= */

export type SkeletonVariant = 'text' | 'circle' | 'rect'

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Shape preset:
   * - `rect`   (default) — rounded block placeholder
   * - `text`   — short, line-height-matched text placeholder
   * - `circle` — avatar / icon placeholder (radius-full)
   */
  variant?: SkeletonVariant
  /** CSS width — number = px, string = any CSS value. Defaults vary by variant. */
  width?: number | string
  /** CSS height — number = px, string = any CSS value. Defaults vary by variant. */
  height?: number | string
}

/* =================================================================
   Radius + default size per variant
   ================================================================= */

const RADIUS: Record<SkeletonVariant, string> = {
  text:   'rounded-[var(--radius-xs)]',   // 4px — text-line corners
  rect:   'rounded-[var(--radius-m)]',    // 8px — block corners
  circle: 'rounded-full',                 // 100px — avatar
}

const DEFAULT_SIZE: Record<SkeletonVariant, { width: number | string; height: number | string }> = {
  text:   { width: '100%', height: '1em' },
  rect:   { width: '100%', height: 120 },
  circle: { width: 40,     height: 40 },
}

/* =================================================================
   Skeleton
   ================================================================= */

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = 'rect', width, height, className, style, ...rest }, ref) => {
    const defaults = DEFAULT_SIZE[variant]
    const resolvedWidth  = width  ?? defaults.width
    const resolvedHeight = height ?? defaults.height

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn('skeleton', RADIUS[variant], className)}
        style={{ width: resolvedWidth, height: resolvedHeight, ...style }}
        {...rest}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'
