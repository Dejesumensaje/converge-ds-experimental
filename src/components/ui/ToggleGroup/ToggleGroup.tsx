import * as React from 'react'
import { cn } from '../../../lib/utils'
import './togglegroup.css'

/* =================================================================
   Types
   ================================================================= */

export type ToggleGroupOption = {
  value: string
  label: string
  disabled?: boolean
  /**
   * Icon component (LucideIcon).
   * Required when parent ToggleGroup has `iconOnly={true}`.
   * Ignored in text mode.
   */
  icon?: React.ComponentType<{
    size?: number
    className?: string
    'aria-hidden'?: boolean | 'true' | 'false'
  }>
}

export type ToggleGroupSize = 'sm' | 'md' | 'lg'

export type ToggleGroupProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'role' | 'aria-label'
> & {
  options: ToggleGroupOption[]
  value: string
  onValueChange: (value: string) => void
  size?: ToggleGroupSize
  disabled?: boolean
  /**
   * Render each option as an icon-only button.
   * `option.icon` must be provided; `option.label` becomes the aria-label.
   */
  iconOnly?: boolean
  'aria-label': string
}

/* =================================================================
   Dimension maps
   ================================================================= */

// Container has 4px padding on all sides → option height = container height - 8px
const OPTION_TEXT_CLASS: Record<ToggleGroupSize, string> = {
  sm: 'h-5 px-[var(--spacing-m)] button-small',    // 20px tall
  md: 'h-7 px-[var(--spacing-l)] button-medium',   // 28px tall
  lg: 'h-9 px-[var(--spacing-xl)] button-large',   // 36px tall
}

// Square options for iconOnly: width === height, p-0 overrides any browser default button padding
const OPTION_ICON_CLASS: Record<ToggleGroupSize, string> = {
  sm: 'h-5 w-5 p-0',  // 20×20
  md: 'h-7 w-7 p-0',  // 28×28
  lg: 'h-9 w-9 p-0',  // 36×36
}

const ICON_SIZE: Record<ToggleGroupSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
}

/* =================================================================
   Component
   ================================================================= */

export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      options,
      value,
      onValueChange,
      size = 'md',
      disabled = false,
      iconOnly = false,
      'aria-label': ariaLabel,
      className,
      ...restProps
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null)

    /* ── Dev warnings ───────────────────────────────────────────── */
    if (import.meta.env.DEV && iconOnly) {
      options.forEach((opt) => {
        if (!opt.icon) {
          console.warn(
            `[ToggleGroup] iconOnly=true but option "${opt.value}" is missing the \`icon\` prop. ` +
            `Falling back to label text.`
          )
        }
      })
    }

    /* ── Pill measurement ───────────────────────────────────────── */
    const measurePill = React.useCallback(() => {
      const container = containerRef.current
      if (!container) return
      // Fallback: if value not found in DOM, skip — pill stays at previous position
      const btn = container.querySelector<HTMLButtonElement>(
        `[data-value="${CSS.escape(String(value))}"]`
      )
      if (!btn) return
      const cRect = container.getBoundingClientRect()
      const bRect = btn.getBoundingClientRect()
      container.style.setProperty('--pill-x', `${bRect.left - cRect.left}px`)
      container.style.setProperty('--pill-w', `${bRect.width}px`)
    }, [value])

    // Sync pill before paint — no flash on first render
    React.useLayoutEffect(() => {
      measurePill()
    }, [measurePill])

    // Re-measure when container resizes (window resize, late font load)
    React.useLayoutEffect(() => {
      const container = containerRef.current
      if (!container) return
      const ro = new ResizeObserver(() => measurePill())
      ro.observe(container)
      return () => ro.disconnect()
    }, [measurePill])

    /* ── Keyboard navigation ────────────────────────────────────── */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return

      const enabledOptions = options.filter((o) => !o.disabled)
      const currentIndex = enabledOptions.findIndex((o) => o.value === value)

      let nextIndex: number | null = null

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault()
          nextIndex = (currentIndex + 1) % enabledOptions.length
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          nextIndex = (currentIndex - 1 + enabledOptions.length) % enabledOptions.length
          break
        case 'Home':
          e.preventDefault()
          nextIndex = 0
          break
        case 'End':
          e.preventDefault()
          nextIndex = enabledOptions.length - 1
          break
        default:
          return
      }

      if (nextIndex !== null) {
        const nextOption = enabledOptions[nextIndex]
        onValueChange(nextOption.value)
        const container = containerRef.current
        if (container) {
          const btn = container.querySelector<HTMLButtonElement>(
            `[data-value="${CSS.escape(nextOption.value)}"]`
          )
          btn?.focus()
        }
      }
    }

    return (
      <div
        ref={(node) => {
          containerRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        role="radiogroup"
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        className={cn('toggle-group-container', className)}
        onKeyDown={handleKeyDown}
        {...restProps}
      >
        {/* Sliding pill */}
        <div className="toggle-group-pill" aria-hidden="true" />

        {options.map((opt) => {
          const isSelected = opt.value === value
          const isDisabled = disabled || opt.disabled
          const IconComp = opt.icon
          const optionClass = iconOnly ? OPTION_ICON_CLASS[size] : OPTION_TEXT_CLASS[size]

          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={iconOnly ? opt.label : undefined}
              data-value={opt.value}
              disabled={isDisabled}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => {
                if (!isDisabled) onValueChange(opt.value)
              }}
              className={cn('toggle-group-option', optionClass)}
            >
              {iconOnly ? (
                IconComp ? (
                  <IconComp size={ICON_SIZE[size]} aria-hidden="true" />
                ) : (
                  opt.label
                )
              ) : (
                opt.label
              )}
            </button>
          )
        })}
      </div>
    )
  }
)

ToggleGroup.displayName = 'ToggleGroup'
