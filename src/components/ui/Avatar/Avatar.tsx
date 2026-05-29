import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '../../../lib/utils'

export type AvatarProps = {
  /** Image URL. When absent or broken, shows the fallback. */
  src?: string
  alt?: string
  /** Initials shown in the fallback (e.g. "NL"). Keep to 2 chars. */
  fallback: string
  className?: string
}

export const Avatar = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ src, alt, fallback, className }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-[28px] h-[28px] shrink-0 overflow-hidden rounded-full',
      className
    )}
  >
    <AvatarPrimitive.Image
      src={src}
      alt={alt ?? fallback}
      className="aspect-square h-full w-full object-cover"
    />
    <AvatarPrimitive.Fallback
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full',
        'bg-muted text-muted-foreground',
        'caption-caption select-none'
      )}
    >
      {fallback}
    </AvatarPrimitive.Fallback>
  </AvatarPrimitive.Root>
))

Avatar.displayName = 'Avatar'
