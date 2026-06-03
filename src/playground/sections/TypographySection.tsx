import * as React from 'react'
import { ComponentHeader } from '../helpers'

type TypographyRow = {
  cls: string
  figma: string
  size: string
  weight: string
  lh: string
  sample: string
}

const TYPOGRAPHY_DATA: TypographyRow[] = [
  { cls: 'titles-h1',               figma: 'Titles/H1',                     size: '96px', weight: '400', lh: '1.2',  sample: 'Aa' },
  { cls: 'titles-h2',               figma: 'Titles/H2',                     size: '60px', weight: '400', lh: '1.2',  sample: 'Aa' },
  { cls: 'titles-h3',               figma: 'Titles/H3',                     size: '48px', weight: '400', lh: '1.45', sample: 'Aa' },
  { cls: 'titles-h4',               figma: 'Titles/H4',                     size: '34px', weight: '400', lh: '1.52', sample: 'Heading' },
  { cls: 'titles-h1-semibold',      figma: 'Titles/H1/Semibold',            size: '96px', weight: '600', lh: '1.2',  sample: 'Aa' },
  { cls: 'titles-h2-semibold',      figma: 'Titles/H2/Semibold',            size: '60px', weight: '600', lh: '1.2',  sample: 'Aa' },
  { cls: 'titles-h3-semibold',      figma: 'Titles/H3/Semibold',            size: '48px', weight: '600', lh: '1.45', sample: 'Aa' },
  { cls: 'titles-h4-semibold',      figma: 'Titles/H4/Semibold',            size: '34px', weight: '600', lh: '1.52', sample: 'Heading' },
  { cls: 'titles-h5',               figma: 'Titles/H5',                     size: '24px', weight: '600', lh: '1.52', sample: 'The quick brown fox' },
  { cls: 'titles-h6',               figma: 'Titles/H6',                     size: '20px', weight: '600', lh: '1.52', sample: 'The quick brown fox' },
  { cls: 'titles-h7',               figma: 'Titles/H7',                     size: '16px', weight: '600', lh: '1.52', sample: 'The quick brown fox' },
  { cls: 'body-body1-regular',      figma: 'Body/Body1/Regular',            size: '16px', weight: '400', lh: '1.52', sample: 'The quick brown fox jumps over the lazy dog' },
  { cls: 'body-body1-semibold',     figma: 'Body/Body1/Semibold',           size: '16px', weight: '600', lh: '1.68', sample: 'The quick brown fox jumps over the lazy dog' },
  { cls: 'body-body2-regular',      figma: 'Body/Body2/Regular',            size: '14px', weight: '400', lh: '1.62', sample: 'The quick brown fox jumps over the lazy dog' },
  { cls: 'body-body2-semibold',     figma: 'Body/Body2/Semibold',           size: '14px', weight: '600', lh: '1.52', sample: 'The quick brown fox jumps over the lazy dog' },
  { cls: 'input-inputtext',         figma: 'Input/InputText',               size: '16px', weight: '400', lh: '1.52', sample: 'Input field text' },
  { cls: 'input-inputlabel',        figma: 'Input/InputLabel',              size: '12px', weight: '400', lh: '1.5',  sample: 'Field label' },
  { cls: 'button-small',            figma: 'Button/Small',                  size: '12px', weight: '600', lh: '1',    sample: 'Button label' },
  { cls: 'button-medium',           figma: 'Button/Medium',                 size: '14px', weight: '600', lh: '1',    sample: 'Button label' },
  { cls: 'button-large',            figma: 'Button/Large',                  size: '16px', weight: '600', lh: '1',    sample: 'Button label' },
  { cls: 'caption-caption',         figma: 'Caption/Caption',               size: '13px', weight: '600', lh: '1.52', sample: 'Caption text' },
  { cls: 'tooltip-tooltip',         figma: 'Tooltip/Tooltip',               size: '12px', weight: '600', lh: '1.52', sample: 'Tooltip label' },
  { cls: 'notification-notification', figma: 'Notification/Notification',   size: '10px', weight: '600', lh: '1.52', sample: 'Notification' },
]

export function TypographySection() {
  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="typography" title="Typography" />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {TYPOGRAPHY_DATA.map((row, i) => (
          <div
            key={row.cls}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 240px',
              gap: 'var(--spacing-l)',
              alignItems: 'center',
              padding: 'var(--spacing-s) 0',
              borderBottom: i < TYPOGRAPHY_DATA.length - 1 ? '1px solid var(--border)' : undefined,
            }}
          >
            <span
              className={row.cls}
              style={{ color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {row.sample}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
              <span className="caption-caption" style={{ color: 'var(--foreground)' }}>
                .{row.cls}
              </span>
              <span className="notification-notification" style={{ color: 'var(--muted-foreground)' }}>
                {row.figma}
              </span>
              <span className="notification-notification" style={{ color: 'var(--muted-foreground)' }}>
                {row.size} / {row.weight} / lh {row.lh}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
