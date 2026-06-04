import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '../../../lib/utils'
import './actionbar.css'

/*
  A11Y USAGE NOTES:
  ─────────────────
  • Each <ActionBar> carries role="region" + aria-label (required).
    This names the landmark without announcing every render.

  • ActionBar does NOT steal or trap focus — it is non-modal.
    Tab reaches its controls naturally; Esc dismisses (if onDismiss present).

  • To announce dynamic content (e.g. "3 items selected"), wrap the
    changing text inside ActionBarLeading with aria-live="polite":
      <ActionBarLeading>
        <span aria-live="polite">{count} items selected</span>
      </ActionBarLeading>
    Do NOT put aria-live on the region itself — it over-announces.

  • For exit animation: v1 unmounts immediately (consumer controls visibility).
    Use a presence wrapper (e.g. Radix Presence, Framer motion AnimatePresence)
    for an animated exit. Example:
      {open && <ActionBar ...>...</ActionBar>}
*/

/* =================================================================
   Types
   ================================================================= */

export type ActionBarPosition =
  | 'bottom-center'
  | 'bottom-right'
  | 'top-center'
  | 'top-right'

export type ActionBarProps = {
  /** Required — names the region for screen readers. */
  'aria-label': string
  /**
   * When set, applies position:fixed with a preset anchor.
   * Omit for inline placement (consumer positions the element).
   */
  position?: ActionBarPosition
  /**
   * When provided, renders an integrated X button and wires Esc → onDismiss.
   * Omit to let consumers place their own dismiss action inside a slot.
   */
  onDismiss?: () => void
  className?: string
  children?: React.ReactNode
}

export type ActionBarLeadingProps = {
  children?: React.ReactNode
  className?: string
}

export type ActionBarActionsProps = {
  children?: React.ReactNode
  className?: string
}

/* =================================================================
   Position presets
   ================================================================= */

const POSITION_STYLE: Record<ActionBarPosition, React.CSSProperties> = {
  'bottom-center': { position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 100 },
  'bottom-right':  { position: 'fixed', bottom: 24, right: 24, zIndex: 100 },
  'top-center':    { position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 100 },
  'top-right':     { position: 'fixed', top: 24, right: 24, zIndex: 100 },
}

/* =================================================================
   ActionBar (root)
   ================================================================= */

export const ActionBar = React.forwardRef<HTMLDivElement, ActionBarProps>(
  (
    {
      'aria-label': ariaLabel,
      position,
      onDismiss,
      className,
      children,
    },
    ref
  ) => {
    /* Esc → onDismiss (non-capturing, non-trapping) */
    React.useEffect(() => {
      if (!onDismiss) return
      const handle = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onDismiss()
      }
      document.addEventListener('keydown', handle)
      return () => document.removeEventListener('keydown', handle)
    }, [onDismiss])

    const positionStyle = position ? POSITION_STYLE[position] : undefined

    return (
      /* ── Outer: glass shell ──────────────────────────────────── */
      <div
        ref={ref}
        role="region"
        aria-label={ariaLabel}
        data-position={position}
        className={cn('action-bar-container inline-flex', className)}
        style={positionStyle}
      >
        {/* ── Inner: dark pill ─────────────────────────────────── */}
        <div
          className={cn(
            'flex items-center gap-[var(--spacing-m)]',
            'bg-[var(--sidebar)] rounded-full',
            'px-[var(--spacing-m)] py-[var(--spacing-s)]',
            'text-[var(--sidebar-foreground)]',
          )}
        >
          {children}

          {/* Integrated dismiss button — only when onDismiss is provided */}
          {onDismiss && (
            <button
              type="button"
              aria-label="Dismiss"
              onClick={onDismiss}
              className={cn(
                'inline-flex items-center justify-center shrink-0',
                'w-7 h-7 rounded-full',
                'text-[var(--sidebar-foreground)] opacity-60',
                'hover:opacity-100 hover:bg-white/10',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
                'focus-visible:ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]',
                'transition-opacity duration-150 cursor-pointer',
                '[box-sizing:border-box] appearance-none border-none bg-transparent m-0',
              )}
            >
              <X size={14} aria-hidden />
            </button>
          )}
        </div>
      </div>
    )
  }
)

ActionBar.displayName = 'ActionBar'

/* =================================================================
   ActionBarLeading — left slot
   ================================================================= */

export const ActionBarLeading = React.forwardRef<HTMLDivElement, ActionBarLeadingProps>(
  ({ children, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-[var(--spacing-s)] shrink-0',
        'body-body2-regular text-[var(--sidebar-foreground)] opacity-80',
        className
      )}
    >
      {children}
    </div>
  )
)

ActionBarLeading.displayName = 'ActionBarLeading'

/* =================================================================
   ActionBarActions — right slot (pushes to far right via ml-auto)
   ================================================================= */

export const ActionBarActions = React.forwardRef<HTMLDivElement, ActionBarActionsProps>(
  ({ children, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-[var(--spacing-s)] ml-auto',
        className
      )}
    >
      {children}
    </div>
  )
)

ActionBarActions.displayName = 'ActionBarActions'
