import * as React from 'react'

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ children, ...props }, ref) => (
  <tbody ref={ref} {...props}>
    {children}
  </tbody>
))

TableBody.displayName = 'TableBody'
