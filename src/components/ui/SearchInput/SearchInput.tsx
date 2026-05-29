import * as React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '../../../lib/utils'

/* =================================================================
   Types
   ================================================================= */

type BaseSearchInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'size' | 'aria-label'
> & {
  value: string
  onValueChange: (value: string) => void
  /**
   * Visual expansion direction. Note: actual growth direction also
   * depends on how the component is positioned in its parent. For
   * 'left', wrap in a flex container with justify-content: flex-end
   * (or margin-left: auto) so the component is right-anchored and
   * expands leftward.
   *
   * @example
   * // Grows right (default) — anchor left
   * <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
   *   <SearchInput expandDirection="right" ... />
   * </div>
   *
   * // Grows left — anchor right
   * <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
   *   <SearchInput expandDirection="left" ... />
   * </div>
   */
  expandDirection?: 'left' | 'right'
  size?: 'sm' | 'md'
  disabled?: boolean
  onSubmit?: (value: string) => void
  placeholder?: string
}

export type SearchInputProps = BaseSearchInputProps & {
  'aria-label': string
}

/* =================================================================
   Dimension maps
   ================================================================= */

const DIMS = {
  sm: {
    collapsedPx: 32,
    expandedPx:  200,
    searchIcon:  16,
    xIcon:       14,
    triggerSize: 32,
  },
  md: {
    collapsedPx: 40,
    expandedPx:  240,
    searchIcon:  20,
    xIcon:       16,
    triggerSize: 40,
  },
} as const

/* =================================================================
   Component
   ================================================================= */

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onValueChange,
      expandDirection = 'right',
      size = 'md',
      disabled = false,
      onSubmit,
      placeholder,
      'aria-label': ariaLabel,
      className,
      ...restProps
    },
    ref
  ) => {
    const dims = DIMS[size]

    const [expanded, setExpanded] = React.useState(false)
    const [hovered,  setHovered]  = React.useState(false)
    const [focused,  setFocused]  = React.useState(false)

    const inputRef = React.useRef<HTMLInputElement | null>(null)

    /* ── Merge forwarded ref with internal ref ──────────────────── */
    const mergedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
      },
      [ref]
    )

    /* ── Container ring ─────────────────────────────────────────── */
    const ringClass = focused
      ? 'ring-2 ring-selection'
      : hovered
      ? 'ring-1 ring-[var(--neutral-dark)]'
      : 'ring-1 ring-[var(--neutral-gray4)]'

    /* ── Expand / trigger click ─────────────────────────────────── */
    const handleTriggerClick = () => {
      if (disabled) return
      if (expanded) {
        inputRef.current?.focus()
        return
      }
      setExpanded(true)
      // rAF ensures the width transition has started and the input is
      // no longer clipped before we attempt focus
      requestAnimationFrame(() => inputRef.current?.focus())
    }

    /* ── Clear (X button) ───────────────────────────────────────── */
    const handleClear = () => {
      onValueChange('')
      setExpanded(false)
      setFocused(false)
      inputRef.current?.blur()
    }

    /* ── Input events ───────────────────────────────────────────── */
    const handleFocus = () => setFocused(true)

    const handleBlur = () => {
      setFocused(false)
      // Keep expanded only if there's a value — don't lose the search
      if (!value) setExpanded(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onValueChange('')
        setExpanded(false)
        setFocused(false)
        inputRef.current?.blur()
      } else if (e.key === 'Enter') {
        onSubmit?.(value)
      }
    }

    /* ── Close-button margin: pushes away from the nearest edge ── */
    const closeBtnStyle: React.CSSProperties =
      expandDirection === 'right'
        ? { marginRight: '4px' }
        : { marginLeft: '4px' }

    return (
      <div
        className={cn(
          'inline-flex items-center overflow-hidden rounded-full',
          'bg-[var(--input-background)]',
          ringClass,
          disabled && 'opacity-40 pointer-events-none',
          className
        )}
        style={{
          width: expanded ? `${dims.expandedPx}px` : `${dims.collapsedPx}px`,
          flexDirection: expandDirection === 'left' ? 'row-reverse' : 'row',
          transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onMouseEnter={() => !disabled && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Search trigger ──────────────────────────────────── */}
        <button
          type="button"
          aria-label={expanded ? ariaLabel : `Open ${ariaLabel}`}
          onClick={handleTriggerClick}
          disabled={disabled}
          className={cn(
            'inline-flex items-center justify-center flex-shrink-0',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
            'focus-visible:ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]',
            'rounded-full'
          )}
          style={{
            width:  dims.triggerSize,
            height: dims.triggerSize,
            color: expanded ? 'var(--foreground)' : 'var(--muted-foreground)',
          }}
        >
          <Search size={dims.searchIcon} aria-hidden="true" />
        </button>

        {/* ── Text input ──────────────────────────────────────── */}
        <input
          ref={mergedRef}
          aria-label={ariaLabel}
          aria-hidden={!expanded || undefined}
          tabIndex={expanded ? 0 : -1}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={expanded ? placeholder : undefined}
          disabled={disabled}
          className={cn(
            'flex-1 min-w-0 bg-transparent border-none outline-none',
            'input-inputtext text-[var(--foreground)]',
            'placeholder:text-[var(--muted-foreground)]',
            expanded ? 'px-[var(--spacing-s)]' : 'px-0'
          )}
          {...restProps}
        />

        {/* ── Clear button (only when expanded + has value) ─── */}
        {expanded && value && (
          <button
            type="button"
            aria-label="Clear search"
            onMouseDown={(e) => e.preventDefault()} // prevent input blur before clear
            onClick={handleClear}
            className={cn(
              'flex-shrink-0 inline-flex items-center justify-center rounded-full',
              'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
              'hover:bg-black/5 transition-colors duration-100'
            )}
            style={{ padding: '4px', ...closeBtnStyle }}
          >
            <X size={dims.xIcon} aria-hidden="true" />
          </button>
        )}
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'
