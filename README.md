# Converge Design System

React component library for the Converge platform suite (Deloitte).

> **Status:** `0.1.0-alpha.1` — internal / Figma Make only. Not for production use.

---

## Installation

```bash
npm install @dejesumensaje/converge-ds-experimental
```

Peer dependencies (must be installed by the consumer):

```bash
npm install react@^18 react-dom@^18
```

---

## Usage

Import styles once at your app root:

```tsx
import '@dejesumensaje/converge-ds-experimental/styles'
```

Then import components:

```tsx
import { Button, Input, Select, Modal, Drawer, Table } from '@dejesumensaje/converge-ds-experimental'
import { Header, Sidebar, Footer } from '@dejesumensaje/converge-ds-experimental'
```

---

## Components

### UI Primitives
`Button` · `Input` · `Select` · `Tabs` · `Switch` · `ToggleGroup` · `SearchInput`

### Display
`Badge` · `Chip` · `Dot` · `CountBadge` · `Avatar` · `Tooltip` / `TooltipProvider`

### Cards
`Card` · `MetricCard` · `InformativeCard`

### Data
`Table` · `TableHeader` · `TableHeaderRow` · `TableHeaderCell` · `TableHeaderGroup` · `TableBody` · `TableRow` · `TableCell`

### Overlays
`Modal` · `AlertModal` · `FullScreenAlert` · `Drawer`

### Layout
`Header` · `Sidebar` · `Footer`

---

## Stack

- React 18 + TypeScript
- Tailwind CSS v4
- Radix UI primitives
- CVA for variant management
- lucide-react for icons

---

## Token system

All design tokens are exported via the CSS file (`dist/converge-ds.css`). Tokens follow the shadcn naming convention with Converge brand values. Override via CSS custom properties on `:root`.

Key tokens:
- `--primary` — Deloitte green `#26890D` (reserved for CTAs only)
- `--selection` — Active/selected state `#000000`
- `--spacing-{size}` — `xxs` · `s` · `m` · `l` · `xl` · `xxl` · `jumbo`
- `--radius-{size}` — `m` · `l` · `xl` · `full` · `badge`
