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
   Module-level dismiss stack (C2 + W7 fix)

   Guarantees that:
   1. Only the topmost mounted ActionBar responds to Esc (multi-instance safe).
   2. Yields to Radix overlays — Dialog, AlertModal, Drawer, and
      FullScreenAlert all set document.body.style.pointerEvents = 'none'
      when open; if that flag is active the ActionBar stays silent.

   ⚠ Memoize onDismiss with useCallback to prevent effect churn on
     parent re-renders and avoid spurious stack push/pop cycles.
   ================================================================= */
const dismissStack: Array<() => void> = []

function isModalActive(): boolean {
  return typeof document !== 'undefined' &&
    document.body.style.pointerEvents === 'none'
}

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
   * Memoize with useCallback to avoid effect churn.
   */
  onDismiss?: () => void
  className?: string
  /** Extra classes forwarded to the inner dark pill div. */
  pillClassName?: string
  children?: React.ReactNode
}

export type ActionBarLeadingProps = React.HTMLAttributes<HTMLDivElement>

export type ActionBarActionsProps = React.HTMLAttributes<HTMLDivElement>

/* =================================================================
   Position presets
   ================================================================= */

const POSITION_STYLE: Record<ActionBarPosition, React.CSSProperties> = {
  'bottom-center': { position: 'fixed', bottom: 'var(--spacing-xl)', left: '50%', transform: 'translateX(-50%)', zIndex: 100 },
  'bottom-right':  { position: 'fixed', bottom: 'var(--spacing-xl)', right: 'var(--spacing-xl)', zIndex: 100 },
  'top-center':    { position: 'fixed', top: 'var(--spacing-xl)', left: '50%', transform: 'translateX(-50%)', zIndex: 100 },
  'top-right':     { position: 'fixed', top: 'var(--spacing-xl)', right: 'var(--spacing-xl)', zIndex: 100 },
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
      pillClassName,
      children,
    },
    ref
  ) => {
    /* Esc → onDismiss: topmost instance only, yields to modal overlays */
    React.useEffect(() => {
      if (!onDismiss) return
      dismissStack.push(onDismiss)

      const handle = (e: KeyboardEvent) => {
        if (e.key !== 'Escape') return
        if (isModalActive()) return
        if (dismissStack[dismissStack.length - 1] !== onDismiss) return
        onDismiss()
      }
      document.addEventListener('keydown', handle)

      return () => {
        document.removeEventListener('keydown', handle)
        const idx = dismissStack.lastIndexOf(onDismiss)
        if (idx !== -1) dismissStack.splice(idx, 1)
      }
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
            'px-[var(--spacing-xl)] py-[var(--spacing-s)]',
            'text-[var(--sidebar-foreground)]',
            pillClassName,
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
                /* C3: solid --sidebar-foreground ring (white in light mode) over
                   the dark pill gives 12.92:1 contrast — well above the 3:1 minimum.
                   ring-offset-[var(--sidebar)] matches the pill bg so the 2px gap
                   is invisible and the ring appears to hug the button cleanly. */
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                'focus-visible:ring-[var(--sidebar-foreground)]',
                'focus-visible:ring-offset-[var(--sidebar)]',
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
   W2: extends HTMLAttributes so consumers can pass data-testid, aria-*,
   event handlers directly on the slot element.
   W3: min-w-0 + overflow-hidden allow the leading text to shrink when
   the pill is tight, preventing actions from being pushed off-screen.
   ================================================================= */

export const ActionBarLeading = React.forwardRef<HTMLDivElement, ActionBarLeadingProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      className={cn(
        'flex items-center gap-[var(--spacing-s)] min-w-0 overflow-hidden',
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
   shrink-0 ensures the actions area never gets squeezed when the
   leading slot has long text.
   ================================================================= */

export const ActionBarActions = React.forwardRef<HTMLDivElement, ActionBarActionsProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      className={cn(
        'flex items-center gap-[var(--spacing-s)] ml-auto shrink-0',
        className
      )}
    >
      {children}
    </div>
  )
)

ActionBarActions.displayName = 'ActionBarActions'
