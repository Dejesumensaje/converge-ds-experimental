import * as React from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, Filter, Search } from 'lucide-react'
import { cn } from '../../../lib/utils'

export type TableHeaderCellProps = Omit<
  React.ThHTMLAttributes<HTMLTableCellElement>,
  'align'
> & {
  sortable?: boolean
  /** Controlled sort direction. null = unsorted. */
  sortDirection?: 'asc' | 'desc' | null
  onSort?: () => void
  filterable?: boolean
  onFilterClick?: () => void
  searchable?: boolean
  onSearchClick?: () => void
  align?: 'left' | 'center' | 'right'
}

export const TableHeaderCell = React.forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  (
    {
      sortable,
      sortDirection = null,
      onSort,
      filterable,
      onFilterClick,
      searchable,
      onSearchClick,
      align = 'left',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const textAlignClass =
      align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'

    const justifyClass =
      align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'

    const SortIcon =
      sortDirection === 'asc'
        ? ChevronUp
        : sortDirection === 'desc'
        ? ChevronDown
        : ChevronsUpDown

    const sortAriaLabel =
      sortDirection === 'asc'
        ? 'Sorted ascending — click to sort descending'
        : sortDirection === 'desc'
        ? 'Sorted descending — click to clear sort'
        : 'Not sorted — click to sort ascending'

    const hasActions = sortable || filterable || searchable

    return (
      <th
        ref={ref}
        className={cn('th-cell', textAlignClass, className)}
        {...props}
      >
        <div className={cn('flex items-center gap-1.5', justifyClass)}>
          <span className="th-label body-body2-semibold text-[var(--foreground)]">
            {children}
          </span>

          {hasActions && (
            <span className="inline-flex items-center gap-0.5 flex-shrink-0">
              {sortable && (
                <button
                  type="button"
                  aria-label={sortAriaLabel}
                  onClick={onSort}
                  className={cn('th-icon-btn', sortDirection && 'th-icon-btn--active')}
                >
                  <SortIcon size={14} aria-hidden="true" />
                </button>
              )}
              {filterable && (
                <button
                  type="button"
                  aria-label="Filter column"
                  onClick={onFilterClick}
                  className="th-icon-btn"
                >
                  <Filter size={14} aria-hidden="true" />
                </button>
              )}
              {searchable && (
                <button
                  type="button"
                  aria-label="Search column"
                  onClick={onSearchClick}
                  className="th-icon-btn"
                >
                  <Search size={14} aria-hidden="true" />
                </button>
              )}
            </span>
          )}
        </div>
      </th>
    )
  }
)

TableHeaderCell.displayName = 'TableHeaderCell'
