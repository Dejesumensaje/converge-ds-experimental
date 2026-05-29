import { cn } from '../../../lib/utils'
import logoFooter from '../../../assets/converge-logo-footer.png'

export type FooterProps = {
  className?: string
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        'border-t border-border',
        'px-[var(--spacing-l)] py-[var(--spacing-m)]',
        'flex items-center justify-center gap-[var(--spacing-s)]',
        className
      )}
    >
      <img
        src={logoFooter}
        alt="Converge"
      />
      <span className="text-xs text-muted-foreground">
        © 2026 All rights reserved.
      </span>
    </footer>
  )
}

Footer.displayName = 'Footer'
