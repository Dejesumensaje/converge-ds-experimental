import * as React from 'react'

export const TableHeaderRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ children, ...props }, ref) => (
  <tr ref={ref} {...props}>
    {children}
  </tr>
))

TableHeaderRow.displayName = 'TableHeaderRow'
