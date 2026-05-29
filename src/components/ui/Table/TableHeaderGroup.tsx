import * as React from 'react'
import { cn } from '../../../lib/utils'

export type TableHeaderGroupProps = Omit<
  React.ThHTMLAttributes<HTMLTableCellElement>,
  'align'
> & {
  /** Required — defines how many columns this group header spans. */
  colSpan: number
  align?: 'left' | 'center' | 'right'
}

export const TableHeaderGroup = React.forwardRef<HTMLTableCellElement, TableHeaderGroupProps>(
  ({ colSpan, align = 'left', className, children, ...props }, ref) => {
    const textAlignClass =
      align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'

    const justifyClass =
      align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'

    return (
      <th
        ref={ref}
        colSpan={colSpan}
        className={cn('th-group-cell', textAlignClass, className)}
        {...props}
      >
        <div className={cn('flex items-center', justifyClass)}>
          <span className="body-body2-regular text-[var(--foreground)]">{children}</span>
        </div>
      </th>
    )
  }
)

TableHeaderGroup.displayName = 'TableHeaderGroup'
