import * as React from 'react'
import { DismissableLayer } from '@radix-ui/react-dismissable-layer'
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

  • For dynamic leading content (e.g. "3 items selected"), pass the liveText
    prop — ActionBar renders a sr-only live region automatically:
      <ActionBar liveText={`${count} items selected`} ...>
    Omit liveText when the leading is static — no live region is rendered.
    Use politeness="assertive" for urgent state changes; default is "polite".

  • For exit animation: v1 unmounts immediately (consumer controls visibility).
    Use a presence wrapper (e.g. Radix Presence, Framer motion AnimatePresence)
    for an animated exit. Example:
      {open && <ActionBar ...>...</ActionBar>}

  • Esc handling is delegated to @radix-ui/react-dismissable-layer.
    DismissableLayer automatically:
    1. Stacks layers — only the topmost layer responds to Esc.
    2. Yields to Radix overlays (Dialog, Sheet, etc.) which push their own
       DismissableLayer onto the stack, taking precedence.
    Pointer-outside and focus-outside dismiss are suppressed — ActionBar
    is non-modal and should not close on incidental outside interaction.
    Memoize onDismiss with useCallback to keep the layer stable.
*/

/* =================================================================
   Types
   ================================================================= */

export type ActionBarPosition =
  | 'bottom-center'
  | 'bottom-right'
  | 'top-center'
  | 'top-right'

export type ActionBarProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'aria-label'> & {
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
  /** Extra classes forwarded to the inner dark pill div. */
  pillClassName?: string
  /**
   * When set, ActionBar renders a sr-only live region and announces this
   * text to screen readers on every change. Use for dynamic leading content
   * (e.g., selection count). Omit when the leading is static — no region
   * is rendered, so AT users are not interrupted unnecessarily.
   */
  liveText?: string
  /**
   * Controls the urgency of the live region. 'polite' (default) waits for
   * the user to finish their current task; 'assertive' interrupts immediately.
   * Use 'assertive' only for critical state changes.
   */
  politeness?: 'polite' | 'assertive'
}

export type ActionBarLeadingProps = React.HTMLAttributes<HTMLDivElement>

export type ActionBarActionsProps = React.HTMLAttributes<HTMLDivElement>

/* =================================================================
   Position presets
   Note: centered presets set transform: translateX(-50%) for horizontal
   centering. If the consumer passes a style.transform it will override
   this value — acceptable escape hatch, but centering will break.
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
      liveText,
      politeness = 'polite',
      children,
      style,
      ...restProps
    },
    ref
  ) => {
    const positionStyle = position ? POSITION_STYLE[position] : undefined

    const rootDiv = (
      /* ── Outer: glass shell ──────────────────────────────────── */
      <div
        {...restProps}
        ref={ref}
        role="region"
        aria-label={ariaLabel}
        data-position={position}
        className={cn('action-bar-container inline-flex', className)}
        style={{ ...positionStyle, ...style }}
      >
        {/* sr-only live region — only rendered when liveText is provided */}
        {liveText !== undefined && (
          <div
            role="status"
            aria-live={politeness}
            aria-atomic="true"
            className="sr-only"
          >
            {liveText}
          </div>
        )}

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
                   the dark pill gives 12.67:1 contrast — well above the 3:1 minimum.
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

    /*
      DismissableLayer handles Esc stacking natively:
      - Only the topmost layer receives the Esc event.
      - Radix overlays (Dialog, Drawer, etc.) push their own layer and take
        precedence automatically — no manual isModalActive() check needed.
      - pointer-outside and focus-outside dismiss are suppressed: ActionBar
        is non-modal and must not close on incidental outside interaction.
      - When onDismiss is absent, render the div unwrapped so no layer is
        registered and Esc does nothing.
    */
    if (!onDismiss) return rootDiv

    return (
      <DismissableLayer
        asChild
        onEscapeKeyDown={onDismiss}
        onPointerDownOutside={e => e.preventDefault()}
        onFocusOutside={e => e.preventDefault()}
      >
        {rootDiv}
      </DismissableLayer>
    )
  }
)

ActionBar.displayName = 'ActionBar'

/* =================================================================
   ActionBarLeading — left slot
   Extends HTMLAttributes so consumers can pass data-testid, aria-*,
   event handlers directly on the slot element.
   min-w-0 + overflow-hidden allow the leading text to shrink when
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
