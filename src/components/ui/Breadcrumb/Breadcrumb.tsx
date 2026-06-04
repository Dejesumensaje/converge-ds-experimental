import * as React from 'react'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import { cn } from '../../../lib/utils'
import './breadcrumb.css'

/* =================================================================
   Types
   ================================================================= */

export type BreadcrumbItem = {
  label: string
  /** Renders as <a>. */
  href?: string
  /** Renders as <button> when href is absent. */
  onClick?: () => void
}

type BaseHtmlProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'>

export type BreadcrumbTrailProps = BaseHtmlProps & {
  variant?: 'trail'
  /** Trail of items. Last item = current page (non-interactive, aria-current="page"). */
  items: BreadcrumbItem[]
  /** Custom separator. Defaults to ChevronRight (14px). */
  separator?: React.ReactNode
  /**
   * Collapse middle items into "…" when the trail exceeds this count.
   * Must be ≥ 3. Omit to always show all items.
   */
  maxItems?: number
}

export type BreadcrumbBackProps = BaseHtmlProps & {
  variant: 'back'
  /** Full label, e.g. "Back to scenarios". */
  label: string
  /** Renders as <a>. Takes priority over onClick. */
  href?: string
  /** Renders as <button role="link"> when href is absent. */
  onClick?: () => void
}

export type BreadcrumbProps = BreadcrumbTrailProps | BreadcrumbBackProps

/* =================================================================
   Shared style constants
   ================================================================= */

/**
 * Trail interactive items (text only, display: inline to match the current-page <span>).
 * `no-underline` resets UA <a> underline; `hover:underline` / `focus-visible:underline`
 * provide affordance. Both are in @layer utilities so they beat any unlayered reset.
 */
const TRAIL_LINK_CLS = cn(
  'breadcrumb-interactive', // CSS reset: appearance/bg/border/margin/padding/cursor/font-family/display:inline
  'body-body2-regular',
  'text-muted-foreground hover:text-foreground',
  'no-underline hover:underline focus-visible:underline',
  'transition-colors duration-150',
  'rounded-[var(--radius-xs)] outline-none',
  'focus-visible:ring-2 focus-visible:ring-offset-1',
  'focus-visible:ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]',
)

/**
 * Back variant interactive element (icon + text, needs inline-flex for vertical alignment).
 */
const BACK_LINK_CLS = cn(
  'breadcrumb-back-btn', // CSS reset: same as above but display:inline-flex + align-items:center + gap
  'body-body2-regular',
  'text-muted-foreground hover:text-foreground',
  'no-underline hover:underline focus-visible:underline',
  'transition-colors duration-150',
  'rounded-[var(--radius-xs)] outline-none',
  'focus-visible:ring-2 focus-visible:ring-offset-1',
  'focus-visible:ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]',
)

/* =================================================================
   Breadcrumb
   ================================================================= */

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (props, ref) => {
    // useState must be unconditional — only used in trail branch
    const [expanded, setExpanded] = React.useState(false)

    /* ----------------------------------------------------------------
       Back variant
    ---------------------------------------------------------------- */
    if (props.variant === 'back') {
      const { variant: _v, label, href, onClick, className, ...navProps } = props

      const content = href ? (
        <a href={href} className={BACK_LINK_CLS}>
          <ArrowLeft size={16} aria-hidden="true" className="shrink-0" />
          {label}
        </a>
      ) : onClick ? (
        <button
          type="button"
          role="link"
          onClick={onClick}
          className={BACK_LINK_CLS}
        >
          <ArrowLeft size={16} aria-hidden="true" className="shrink-0" />
          {label}
        </button>
      ) : (
        // Non-interactive fallback (no href, no onClick)
        <span className="body-body2-regular text-muted-foreground breadcrumb-back-static">
          <ArrowLeft size={16} aria-hidden="true" className="shrink-0" />
          {label}
        </span>
      )

      return (
        <nav
          ref={ref}
          aria-label="Breadcrumb"
          className={cn('breadcrumb-root', className)}
          {...navProps}
        >
          {content}
        </nav>
      )
    }

    /* ----------------------------------------------------------------
       Trail variant (TypeScript narrows props to BreadcrumbTrailProps here)
    ---------------------------------------------------------------- */
    const {
      variant: _v,
      items,
      separator,
      maxItems,
      className,
      ...navProps
    } = props as BreadcrumbTrailProps

    const sep = separator ?? (
      <ChevronRight size={14} aria-hidden="true" className="shrink-0 text-muted-foreground" />
    )

    /* Truncation */
    const shouldCollapse =
      !expanded &&
      maxItems !== undefined &&
      maxItems >= 3 &&
      items.length > maxItems

    type Slot = BreadcrumbItem | null
    let slots: Slot[]

    if (shouldCollapse) {
      const tailCount = maxItems - 2
      slots = [items[0], null, ...items.slice(items.length - tailCount)]
    } else {
      slots = items
    }

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn('breadcrumb-root', className)}
        {...navProps}
      >
        <ol className="breadcrumb-list">
          {slots.map((slot, idx) => {
            const isLast = idx === slots.length - 1
            const isEllipsis = slot === null
            const key = isEllipsis ? '__ellipsis' : `${slot!.label}-${idx}`

            return (
              <React.Fragment key={key}>
                <li className="breadcrumb-item">
                  {isEllipsis ? (
                    /* Expand collapsed items */
                    <button
                      type="button"
                      aria-label="Show all breadcrumb items"
                      onClick={() => setExpanded(true)}
                      className={cn(
                        'breadcrumb-interactive',
                        'body-body2-regular',
                        'text-muted-foreground hover:text-foreground',
                        'no-underline', // ellipsis doesn't get underline
                        'transition-colors duration-150',
                        'px-[var(--spacing-xxs)]',
                        'rounded-[var(--radius-xs)] outline-none',
                        'focus-visible:ring-2 focus-visible:ring-offset-1',
                        'focus-visible:ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]',
                      )}
                    >
                      &hellip;
                    </button>
                  ) : isLast ? (
                    /* Current page — non-interactive */
                    <span
                      aria-current="page"
                      className="body-body2-regular text-foreground"
                    >
                      {slot!.label}
                    </span>
                  ) : slot!.href ? (
                    <a href={slot!.href} className={TRAIL_LINK_CLS}>
                      {slot!.label}
                    </a>
                  ) : slot!.onClick ? (
                    <button
                      type="button"
                      onClick={slot!.onClick}
                      className={TRAIL_LINK_CLS}
                    >
                      {slot!.label}
                    </button>
                  ) : (
                    /* Static non-current item */
                    <span className="body-body2-regular text-muted-foreground">
                      {slot!.label}
                    </span>
                  )}
                </li>

                {!isLast && (
                  <li aria-hidden="true" className="breadcrumb-sep">
                    {sep}
                  </li>
                )}
              </React.Fragment>
            )
          })}
        </ol>
      </nav>
    )
  }
)

Breadcrumb.displayName = 'Breadcrumb'
