import * as React from 'react'
import { Card, CardHeader, CardContent, CardFooter } from '../Card'
import { cn } from '../../../lib/utils'

export type InformativeCardProps = {
  imageSrc?: string
  tags?: React.ReactNode[]
  category?: string
  title: string
  subtitle?: string
  children?: React.ReactNode
  actions?: React.ReactNode
  footerLinks?: React.ReactNode
  className?: string
}

export const InformativeCard = React.forwardRef<HTMLDivElement, InformativeCardProps>(
  (
    {
      imageSrc,
      tags,
      category,
      title,
      subtitle,
      children,
      actions,
      footerLinks,
      className,
    },
    ref
  ) => {
    const hasContent = children !== undefined || actions !== undefined
    const hasFooter = footerLinks !== undefined

    return (
      <Card ref={ref} className={cn('flex flex-col overflow-hidden', className)}>
        {/* Image — outside CardHeader to avoid padding interference */}
        {imageSrc && (
          <img
            src={imageSrc}
            alt=""
            aria-hidden="true"
            className="w-full object-cover"
            style={{ borderRadius: 'var(--radius-l) var(--radius-l) 0 0', maxHeight: 180 }}
          />
        )}

        {/* Header: tags, category, title, subtitle */}
        <CardHeader>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-[var(--spacing-xxs)]">
              {tags.map((tag, i) => (
                <React.Fragment key={i}>{tag}</React.Fragment>
              ))}
            </div>
          )}
          {category && (
            <span className="caption-caption text-muted-foreground uppercase tracking-wide">
              {category}
            </span>
          )}
          <span className="titles-h6 text-foreground">{title}</span>
          {subtitle && (
            <span className="body-body2-regular text-muted-foreground">{subtitle}</span>
          )}
        </CardHeader>

        {/* Content: children block + actions */}
        {hasContent && (
          <CardContent className="flex flex-col gap-[var(--spacing-m)]">
            {children && (
              <div
                className="rounded-[var(--radius-m)] p-[var(--spacing-m)]"
                style={{ background: 'var(--muted)' }}
              >
                {children}
              </div>
            )}
            {actions && (
              <div className="flex flex-wrap gap-[var(--spacing-s)]">{actions}</div>
            )}
          </CardContent>
        )}

        {/* Footer: footerLinks with top border */}
        {hasFooter && (
          <CardFooter
            className={cn('flex-wrap gap-[var(--spacing-s)] pt-[var(--spacing-l)]')}
            style={{ borderTop: '1px solid var(--border)' }}
          >
            {footerLinks}
          </CardFooter>
        )}
      </Card>
    )
  }
)

InformativeCard.displayName = 'InformativeCard'
