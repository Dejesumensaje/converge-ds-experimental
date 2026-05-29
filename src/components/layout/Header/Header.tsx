import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Bell, Settings, HelpCircle, MessageSquare, LogOut } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Avatar } from '../../ui/Avatar'
import logoHeader from '../../../assets/converge-logo-header.png'

/* =================================================================
   Account Dropdown
   ================================================================= */

const accountMenuItemClass = cn(
  'flex items-center gap-[var(--spacing-m)] px-[var(--spacing-m)] py-[var(--spacing-s)]',
  'rounded-[var(--radius-m)] cursor-pointer select-none outline-none',
  'body-body2-regular text-foreground',
  'transition-colors duration-100',
  'data-[highlighted]:bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)]',
  'data-[disabled]:opacity-40 data-[disabled]:pointer-events-none'
)

function AccountDropdown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-selection focus-visible:ring-offset-2"
          aria-label="Account menu"
        >
          <Avatar
            src="https://i.pravatar.cc/150?img=12"
            alt="Rob Hasting"
            fallback="RH"
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className={cn(
            'z-50 w-[220px]',
            'bg-popover border border-border rounded-[var(--radius-l)] shadow-lg',
            'p-[var(--spacing-xxs)]',
            'outline-none',
            /* fade + slide-in animation */
            'transition-[opacity,transform] duration-150 ease-out origin-top-right',
            'data-[state=open]:opacity-100 data-[state=open]:scale-100',
            'data-[state=closed]:opacity-0 data-[state=closed]:scale-95'
          )}
        >
          {/* Profile header */}
          <div className="flex items-center gap-[var(--spacing-m)] px-[var(--spacing-m)] py-[var(--spacing-s)] mb-[var(--spacing-xxs)]">
            <Avatar
              src="https://i.pravatar.cc/150?img=12"
              alt="Rob Hasting"
              fallback="RH"
            />
            <div className="flex flex-col min-w-0">
              <span className="body-body2-semibold text-foreground truncate">Rob Hasting</span>
              <span className="caption-caption text-muted-foreground truncate">rob.hasting@converge.io</span>
            </div>
          </div>

          <DropdownMenu.Separator className="h-px bg-border mx-[var(--spacing-m)] my-[var(--spacing-xxs)]" />

          <DropdownMenu.Item className={accountMenuItemClass}>
            <HelpCircle size={16} aria-hidden="true" className="flex-shrink-0 text-muted-foreground" />
            Help center
          </DropdownMenu.Item>
          <DropdownMenu.Item className={accountMenuItemClass}>
            <MessageSquare size={16} aria-hidden="true" className="flex-shrink-0 text-muted-foreground" />
            Feedback
          </DropdownMenu.Item>
          <DropdownMenu.Item className={accountMenuItemClass}>
            <Settings size={16} aria-hidden="true" className="flex-shrink-0 text-muted-foreground" />
            Preferences
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-border mx-[var(--spacing-m)] my-[var(--spacing-xxs)]" />

          <DropdownMenu.Item className={cn(accountMenuItemClass, 'text-destructive data-[highlighted]:bg-[color-mix(in_srgb,var(--destructive)_8%,transparent)]')}>
            <LogOut size={16} aria-hidden="true" className="flex-shrink-0" />
            Log out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

/* =================================================================
   Header
   ================================================================= */

export type HeaderProps = {
  productName?: string
  className?: string
}

export function Header({ productName = 'Product name', className }: HeaderProps) {
  return (
    <header
      className={cn(
        'fixed top-0 w-full z-40 h-16',
        'bg-background border-b border-border',
        'px-[var(--spacing-l)] flex items-center justify-between',
        className
      )}
    >
      {/* ── Left: brand ─────────────────────────────────────── */}
      <div className="flex items-center gap-[var(--spacing-m)]">
        <img
          src={logoHeader}
          alt="Converge"
          className="h-6 w-auto object-contain"
        />
        <span className="w-px h-4 bg-border" aria-hidden="true" />
        <span className="body-body1-regular text-foreground">{productName}</span>
      </div>

      {/* ── Right: notifications + account ──────────────────── */}
      <div className="flex items-center gap-[var(--spacing-l)]">
        {/* Bell with notification dot */}
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <Bell size={18} aria-hidden="true" />
          </button>
          <span
            aria-hidden="true"
            className="absolute top-[6px] right-[6px] w-[7px] h-[7px] rounded-full bg-destructive ring-2 ring-background"
          />
        </div>

        <AccountDropdown />
      </div>
    </header>
  )
}

Header.displayName = 'Header'
