import * as React from 'react'
import { cva } from 'class-variance-authority'
import { type LucideIcon } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { CountBadge } from '../CountBadge'

/* =================================================================
   Types
   ================================================================= */

export type TabItem = {
  id: string
  label: string
  /** Icon rendered to the left of the label. */
  icon?: LucideIcon
  /**
   * When provided, renders a CountBadge to the right of the label.
   * Reutilizes the existing CountBadge component — no new badge built.
   */
  count?: number
  countTone?: 'neutral' | 'success' | 'negative' | 'warning' | 'in-progress'
  disabled?: boolean
}

export type TabsProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  items: TabItem[]
  /** Id of the currently active tab. */
  value: string
  onValueChange: (value: string) => void
  /**
   * `md` — default, primary usage (recommended max 5 tabs).
   * `sm` — compact variant (recommended max 7 tabs).
   */
  size?: 'sm' | 'md'
}

/* =================================================================
   Icon size map
   ================================================================= */

const ICON_SIZE: Record<NonNullable<TabsProps['size']>, number> = {
  sm: 14,
  md: 16,
}

/* =================================================================
   CVA — tab button structural classes (no typography)
   ================================================================= */

const tabButtonVariants = cva(
  [
    'relative inline-flex items-center shrink-0',
    /*
     * -mb-px trick: the tab's 2-px bottom border sits 1 px lower than the
     * tab list's 1-px border, so the active underline visually "covers" the
     * grey line and connects the tab to the content area.
     */
    '-mb-px border-b-2 border-transparent',
    'transition-[color,border-color] duration-150',
    'select-none cursor-pointer',
    'outline-none',
    'focus-visible:ring-2 focus-visible:ring-offset-0',
    'focus-visible:ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]',
    /* disabled handled via HTML disabled attribute */
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
  ],
  {
    variants: {
      size: {
        md: ['h-10', 'px-[var(--spacing-l)]',  'gap-[var(--spacing-s)]'],
        sm: ['h-8',  'px-[var(--spacing-m)]',  'gap-[var(--spacing-xxs)]'],
      },
    },
    defaultVariants: { size: 'md' },
  }
)

/* =================================================================
   Tabs
   ================================================================= */

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ items, value, onValueChange, size = 'md', className, ...props }, ref) => {
    /* Only enabled tabs participate in keyboard navigation */
    const enabledIds = items.filter(item => !item.disabled).map(item => item.id)

    function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, itemId: string) {
      const idx = enabledIds.indexOf(itemId)
      if (idx === -1) return

      let nextIdx = idx

      switch (e.key) {
        case 'ArrowRight': e.preventDefault(); nextIdx = (idx + 1) % enabledIds.length;                   break
        case 'ArrowLeft':  e.preventDefault(); nextIdx = (idx - 1 + enabledIds.length) % enabledIds.length; break
        case 'Home':       e.preventDefault(); nextIdx = 0;                                                break
        case 'End':        e.preventDefault(); nextIdx = enabledIds.length - 1;                            break
        default:           return
      }

      onValueChange(enabledIds[nextIdx])
    }

    return (
      <div
        ref={ref}
        role="tablist"
        aria-orientation="horizontal"
        className={cn('flex border-b border-border', className)}
        {...props}
      >
        {items.map((item) => {
          const Icon  = item.icon
          const isActive = item.id === value

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-disabled={item.disabled}
              tabIndex={isActive && !item.disabled ? 0 : -1}
              disabled={item.disabled}
              onClick={() => { if (!item.disabled) onValueChange(item.id) }}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              className={cn(
                tabButtonVariants({ size }),
                /* Active: underline with selection token (black) + stronger text */
                isActive
                  ? '[border-bottom-color:var(--selection)] text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
                /* Typography — active gets semibold emphasis */
                isActive
                  ? (size === 'md' ? 'body-body1-semibold' : 'body-body2-semibold')
                  : (size === 'md' ? 'body-body1-regular'  : 'body-body2-regular'),
              )}
            >
              {Icon && (
                <Icon
                  size={ICON_SIZE[size]}
                  aria-hidden="true"
                  className="shrink-0"
                />
              )}

              {item.label}

              {item.count !== undefined && (
                <CountBadge
                  count={item.count}
                  tone={item.countTone ?? 'neutral'}
                  size={size === 'sm' ? 'sm' : 'md'}
                />
              )}
            </button>
          )
        })}
      </div>
    )
  }
)

Tabs.displayName = 'Tabs'
