import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '../../../lib/utils'
import './breadcrumb.css'

/* =================================================================
   Types
   ================================================================= */

export type BreadcrumbItem = {
  label: string
  /** When provided, the item is rendered as an interactive link. */
  href?: string
  /** When provided (and href is absent), the item is rendered as an interactive button. */
  onClick?: () => void
}

export type BreadcrumbProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  /** Trail of items. The last item is the current page (non-interactive, aria-current="page"). */
  items: BreadcrumbItem[]
  /**
   * Custom separator node rendered between items.
   * Defaults to ChevronRight (16px).
   */
  separator?: React.ReactNode
  /**
   * Maximum number of items to show before collapsing the middle ones into "…".
   * Requires at least 3 items to have any effect (keeps first + ellipsis + last).
   * Omit to always show all items.
   */
  maxItems?: number
}

/* =================================================================
   Shared interactive classes
   ================================================================= */

const INTERACTIVE_CLASSES = [
  'breadcrumb-interactive', // browser reset (see breadcrumb.css)
  'body-body2-regular',
  'text-muted-foreground',
  'hover:text-foreground',
  'transition-colors duration-150',
  'rounded-[var(--radius-xs)]',
  'outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-offset-1',
  'focus-visible:ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]',
].join(' ')

/* =================================================================
   Breadcrumb
   ================================================================= */

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, separator, maxItems, className, ...props }, ref) => {
    const [expanded, setExpanded] = React.useState(false)

    const sep = separator ?? (
      <ChevronRight
        size={14}
        aria-hidden="true"
        className="shrink-0 text-muted-foreground"
      />
    )

    /* ---- Truncation logic ---- */
    const shouldCollapse =
      !expanded &&
      maxItems !== undefined &&
      maxItems >= 3 &&
      items.length > maxItems

    // Slot type: BreadcrumbItem or null (null = ellipsis placeholder)
    type Slot = BreadcrumbItem | null
    let slots: Slot[]

    if (shouldCollapse) {
      // Keep first 1, show "…", keep last (maxItems - 2) items
      const tailCount = maxItems - 2
      const tail = items.slice(items.length - tailCount)
      slots = [items[0], null, ...tail]
    } else {
      slots = items
    }

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn('breadcrumb-root', className)}
        {...props}
      >
        <ol className="breadcrumb-list">
          {slots.map((slot, idx) => {
            const isLast = idx === slots.length - 1
            const isEllipsis = slot === null

            /* stable key */
            const key = isEllipsis
              ? '__ellipsis'
              : `${slot!.label}-${idx}`

            return (
              <React.Fragment key={key}>
                <li className="breadcrumb-item">
                  {isEllipsis ? (
                    /* Collapsed middle items — expand on click */
                    <button
                      type="button"
                      aria-label="Show all breadcrumb items"
                      onClick={() => setExpanded(true)}
                      className={cn(INTERACTIVE_CLASSES, 'px-[var(--spacing-xxs)]')}
                    >
                      &hellip;
                    </button>
                  ) : isLast ? (
                    /* Current page — non-interactive */
                    <span
                      aria-current="page"
                      className={cn(
                        'body-body2-regular',
                        'text-foreground',
                      )}
                    >
                      {slot!.label}
                    </span>
                  ) : slot!.href ? (
                    /* Link item */
                    <a
                      href={slot!.href}
                      className={cn(INTERACTIVE_CLASSES, 'breadcrumb-link')}
                    >
                      {slot!.label}
                    </a>
                  ) : slot!.onClick ? (
                    /* Button item */
                    <button
                      type="button"
                      onClick={slot!.onClick}
                      className={INTERACTIVE_CLASSES}
                    >
                      {slot!.label}
                    </button>
                  ) : (
                    /* Static non-interactive non-current item (no href, no onClick) */
                    <span
                      className={cn('body-body2-regular', 'text-muted-foreground')}
                    >
                      {slot!.label}
                    </span>
                  )}
                </li>

                {/* Separator — aria-hidden, outside navigable content */}
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
