import * as React from 'react'
import { Card, CardHeader, CardContent, CardFooter } from '../Card'
import { cn } from '../../../lib/utils'

export type MetricCardProps = {
  title?: React.ReactNode
  statusNode?: React.ReactNode
  iconNode?: React.ReactNode
  primaryValue: string | number
  secondaryValue?: string | number
  trendValue?: React.ReactNode
  trendLabel?: string
  actionNode?: React.ReactNode
  topRightAction?: React.ReactNode
  className?: string
}

export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      title,
      statusNode,
      iconNode,
      primaryValue,
      secondaryValue,
      trendValue,
      trendLabel,
      actionNode,
      topRightAction,
      className,
    },
    ref
  ) => {
    const hasTrend = trendValue !== undefined || trendLabel !== undefined
    const hasFooter = hasTrend || actionNode !== undefined

    return (
      <Card ref={ref} className={cn('flex flex-col', className)}>
        {/* Header: title (left) + statusNode (right) */}
        {(title !== undefined || statusNode !== undefined) && (
          <CardHeader className="flex-row items-center justify-between gap-[var(--spacing-s)]">
            {title !== undefined && (
              <h3 className="body-body2-semibold text-muted-foreground">{title}</h3>
            )}
            {statusNode}
          </CardHeader>
        )}

        {/* Content: iconNode + primaryValue + secondaryValue + topRightAction */}
        <CardContent className="flex flex-row items-center gap-[var(--spacing-m)]">
          {iconNode && <div className="flex-shrink-0">{iconNode}</div>}
          <div className="flex flex-col flex-1 min-w-0">
            <h4 className="titles-h4-semibold text-foreground">{primaryValue}</h4>
            {secondaryValue !== undefined && (
              <p className="titles-h7 text-muted-foreground">{secondaryValue}</p>
            )}
          </div>
          {topRightAction && <div className="flex-shrink-0 ml-auto">{topRightAction}</div>}
        </CardContent>

        {/* Footer: trendValue + trendLabel (left) + actionNode (right) */}
        {hasFooter && (
          <CardFooter className="justify-between gap-[var(--spacing-s)]">
            {hasTrend && (
              <div className="flex items-center gap-[var(--spacing-xxs)]">
                {trendValue && <span className="body-body2-semibold text-foreground">{trendValue}</span>}
                {trendLabel && <span className="body-body2-regular text-muted-foreground">{trendLabel}</span>}
              </div>
            )}
            {actionNode && <div className="ml-auto">{actionNode}</div>}
          </CardFooter>
        )}
      </Card>
    )
  }
)

MetricCard.displayName = 'MetricCard'
