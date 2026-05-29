import * as React from 'react'
import { cva } from 'class-variance-authority'
import { PanelLeftClose, PanelLeftOpen, type LucideIcon } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Tooltip, TooltipProvider } from '../../ui/Tooltip'

/* =================================================================
   Types
   ================================================================= */

export type SidebarTheme = 'dark' | 'light'

export type SidebarItem = {
  id: string
  label: string
  icon: LucideIcon
  active?: boolean
  onClick?: () => void
}

export type SidebarProps = {
  /** Whether the rail is in collapsed (icon-only) mode. */
  collapsed?: boolean
  /**
   * When provided, a collapse/expand toggle appears at the top-right of the
   * rail. The consumer is responsible for updating the `collapsed` prop in
   * response. When omitted the toggle is not rendered.
   */
  onCollapsedChange?: (collapsed: boolean) => void
  theme?: SidebarTheme
  primaryItems: SidebarItem[]
  secondaryItems?: SidebarItem[]
  className?: string
}

/* =================================================================
   Dimensions — single source of truth
   ================================================================= */

const W_COLLAPSED = 56
const W_EXPANDED  = 220

/* =================================================================
   CVA — rail-level theme variants
   ================================================================= */

const railVariants = cva(
  [
    'relative',               /* anchor for the absolute-positioned toggle */
    'flex flex-col h-full',
    'rounded-[var(--radius-xl)]',
    'shadow-lg',
    'overflow-hidden',
    /* width driven by inline style — only animate the width prop */
    'transition-[width] duration-300 ease-in-out',
  ],
  {
    variants: {
      theme: {
        dark:  'bg-foreground',
        light: 'bg-background border border-border',
      },
    },
    defaultVariants: { theme: 'dark' },
  }
)

/* =================================================================
   CVA — individual nav item
   ================================================================= */

const itemVariants = cva(
  [
    'flex items-center w-full',
    /* Fixed left padding keeps icon spatially stable across expand/collapse */
    'pl-[var(--spacing-m)] py-[var(--spacing-s)]',
    'rounded-[var(--radius-l)]',
    'transition-colors duration-150',
    'outline-none select-none cursor-pointer',
    'focus-visible:ring-2 focus-visible:ring-inset',
  ],
  {
    variants: {
      theme: {
        dark: [
          'text-[color-mix(in_srgb,var(--background)_65%,transparent)]',
          'hover:bg-[color-mix(in_srgb,var(--background)_10%,transparent)]',
          'hover:text-[color-mix(in_srgb,var(--background)_90%,transparent)]',
          'focus-visible:ring-[color-mix(in_srgb,var(--background)_25%,transparent)]',
        ],
        light: [
          'text-muted-foreground',
          'hover:bg-muted hover:text-foreground',
          'focus-visible:ring-selection',
        ],
      },
      active: { true: '', false: '' },
    },
    compoundVariants: [
      {
        theme: 'dark',
        active: true,
        className: [
          'bg-primary text-primary-foreground',
          'hover:bg-primary hover:text-primary-foreground',
          'hover:brightness-[0.92]',
        ],
      },
      {
        theme: 'light',
        active: true,
        className: [
          'bg-primary text-primary-foreground',
          'hover:bg-primary hover:text-primary-foreground',
          'hover:brightness-[0.92]',
        ],
      },
    ],
    defaultVariants: { theme: 'dark', active: false },
  }
)

/* =================================================================
   SidebarToggle — absolutely-positioned at top-right of the rail.
   Spatial stability: the button stays at the top-right corner
   regardless of the rail width, so it never appears to jump.
   ================================================================= */

type SidebarToggleProps = {
  collapsed: boolean
  theme: SidebarTheme
  onToggle: () => void
}

function SidebarToggle({ collapsed, theme, onToggle }: SidebarToggleProps) {
  const label = collapsed ? 'Expand sidebar' : 'Collapse sidebar'

  return (
    /*
     * Collapsed: center over the icon axis (left 50% − half button width).
     * Expanded:  anchor to the right edge (right 8 px).
     * This keeps the toggle optically aligned with the nav icons in both states.
     */
    <div style={{
      position: 'absolute',
      top: 8,
      zIndex: 1,
      ...(collapsed
        ? { left: '50%', transform: 'translateX(-50%)' }
        : { right: 8 }),
    }}>
      <Tooltip content={label} side="right" delayDuration={400}>
        <button
          type="button"
          onClick={onToggle}
          aria-label={label}
          className={cn(
            'flex items-center justify-center',
            'w-7 h-7 rounded-[var(--radius-m)]',
            'transition-colors duration-150',
            'outline-none',
            'focus-visible:ring-2 focus-visible:ring-inset',
            theme === 'dark'
              ? [
                  'text-[color-mix(in_srgb,var(--background)_45%,transparent)]',
                  'hover:bg-[color-mix(in_srgb,var(--background)_12%,transparent)]',
                  'hover:text-[color-mix(in_srgb,var(--background)_80%,transparent)]',
                  'focus-visible:ring-[color-mix(in_srgb,var(--background)_25%,transparent)]',
                ]
              : [
                  'text-muted-foreground',
                  'hover:bg-muted hover:text-foreground',
                  'focus-visible:ring-selection',
                ],
          )}
        >
          {/* Icon swap: action-oriented, clean crossfade via opacity transition */}
          <span className="relative flex items-center justify-center w-4 h-4">
            <PanelLeftClose
              size={16}
              aria-hidden="true"
              className={cn(
                'absolute transition-opacity duration-200',
                collapsed ? 'opacity-0' : 'opacity-100',
              )}
            />
            <PanelLeftOpen
              size={16}
              aria-hidden="true"
              className={cn(
                'absolute transition-opacity duration-200',
                collapsed ? 'opacity-100' : 'opacity-0',
              )}
            />
          </span>
        </button>
      </Tooltip>
    </div>
  )
}

/* =================================================================
   NavItem
   ================================================================= */

type NavItemProps = {
  item: SidebarItem
  collapsed: boolean
  theme: SidebarTheme
}

function NavItem({ item, collapsed, theme }: NavItemProps) {
  const Icon = item.icon
  const isActive = item.active ?? false

  const button = (
    <button
      type="button"
      onClick={item.onClick}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        itemVariants({ theme, active: isActive }),
        /* Collapsed: square geometry + centered icon */
        collapsed && 'justify-center p-0 h-[40px] rounded-full',
      )}
    >
      <Icon size={20} aria-hidden="true" className="shrink-0" />

      {/* Label fades in/out; max-width collapses to prevent layout shift */}
      <span
        className={cn(
          'whitespace-nowrap overflow-hidden body-body2-regular',
          'transition-[opacity,max-width,margin-left] duration-200 ease-in-out',
          collapsed
            ? 'opacity-0 max-w-0 ml-0 pointer-events-none'
            : 'opacity-100 max-w-[140px] ml-[var(--spacing-m)]'
        )}
      >
        {item.label}
      </span>
    </button>
  )

  /* Tooltip only in collapsed mode */
  if (collapsed) {
    return (
      <Tooltip content={item.label} side="right" delayDuration={300}>
        {button}
      </Tooltip>
    )
  }

  return button
}

/* =================================================================
   Separator
   ================================================================= */

function Separator({ theme }: { theme: SidebarTheme }) {
  return (
    <div
      className={cn(
        'h-px mx-[var(--spacing-s)] my-[var(--spacing-xxs)]',
        theme === 'dark'
          ? 'bg-[color-mix(in_srgb,var(--background)_15%,transparent)]'
          : 'bg-border'
      )}
    />
  )
}

/* =================================================================
   Sidebar
   ================================================================= */

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      collapsed = false,
      onCollapsedChange,
      theme = 'dark',
      primaryItems,
      secondaryItems = [],
      className,
    },
    ref
  ) => (
    /* Self-contained TooltipProvider so consumers don't need to wrap */
    <TooltipProvider>
      <nav
        ref={ref}
        aria-label="Primary navigation"
        style={{ width: collapsed ? W_COLLAPSED : W_EXPANDED }}
        className={cn(railVariants({ theme }), className)}
      >
        {/* Toggle — absolutely positioned at top-right, spatially stable */}
        {onCollapsedChange && (
          <SidebarToggle
            collapsed={collapsed}
            theme={theme}
            onToggle={() => onCollapsedChange(!collapsed)}
          />
        )}

        {/* Primary navigation — top padding makes room for the toggle when present */}
        <div
          className={cn(
            'flex-1 flex flex-col gap-[var(--spacing-xxs)] p-[var(--spacing-s)]',
            onCollapsedChange && 'pt-[44px]',
          )}
        >
          {primaryItems.map((item) => (
            <NavItem key={item.id} item={item} collapsed={collapsed} theme={theme} />
          ))}
        </div>

        {/* Separator + secondary navigation */}
        {secondaryItems.length > 0 && (
          <>
            <Separator theme={theme} />
            <div className="flex flex-col gap-[var(--spacing-xxs)] p-[var(--spacing-s)]">
              {secondaryItems.map((item) => (
                <NavItem key={item.id} item={item} collapsed={collapsed} theme={theme} />
              ))}
            </div>
          </>
        )}
      </nav>
    </TooltipProvider>
  )
)

Sidebar.displayName = 'Sidebar'
