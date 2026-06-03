# Converge Design System — Full Handoff Report
**Date:** 2026-06-03
**Status:** Active development. Library published experimentally to npm. Playground deployed to Vercel.

---

## 1. Project Context

**Converge Design System** is a React component library for Deloitte's Converge platform suite — a B2B SaaS product targeting retail, CPG, and restaurant franchise clients.

**Consumed in two ways:**
1. **Figma Make** (primary, near-term): PMs vibe-code prototypes using a Make Kit that imports this package.
2. **Production Converge apps** (future): same components in real product code.

**Rule:** Components must be production-quality from day one. No playground-only shortcuts.

---

## 2. Tech Stack

| Tool | Version | Notes |
|---|---|---|
| React | 18 + 19 peer compat | `^18 \|\| ^19` peerDep |
| TypeScript | ~5.7.2 | strict mode, noUnusedLocals |
| Vite | ^6.0.5 | library + SPA mode via env var |
| Tailwind CSS | ^4.0.0 | v4 via `@tailwindcss/vite`, NO tailwind.config.js |
| CVA | ^0.7.1 | variant management |
| clsx + tailwind-merge | latest | composed into `cn()` |
| Radix UI | various | Select (Popover+CMDK), Dialog, Tooltip, Avatar, DropdownMenu |
| lucide-react | ^0.469.0 | all icons, no emoji |
| vite-plugin-dts | ^4.5.0 | type declarations for library build |

---

## 3. Repository Structure

```
converge-ds/
├── src/
│   ├── components/
│   │   ├── ui/                    ← published library components
│   │   │   ├── Button/
│   │   │   ├── Badge/
│   │   │   ├── Dot/
│   │   │   ├── CountBadge/
│   │   │   ├── Chip/
│   │   │   ├── Input/
│   │   │   ├── Switch/
│   │   │   ├── ToggleGroup/
│   │   │   ├── SearchInput/
│   │   │   ├── Select/
│   │   │   ├── Avatar/
│   │   │   ├── Tooltip/
│   │   │   ├── Tabs/
│   │   │   ├── Card/
│   │   │   ├── MetricCard/
│   │   │   ├── InformativeCard/
│   │   │   ├── Modal/
│   │   │   ├── AlertModal/
│   │   │   ├── FullScreenAlert/
│   │   │   ├── Drawer/
│   │   │   ├── Table/
│   │   │   └── index.ts           ← UI barrel export
│   │   └── layout/                ← published layout components
│   │       ├── Header/
│   │       ├── Sidebar/
│   │       ├── Footer/
│   │       └── index.ts           ← layout barrel export
│   ├── lib/
│   │   └── utils.ts               ← cn() helper
│   ├── styles/
│   │   ├── theme.css              ← tokens + typography utility classes (SINGLE SOURCE OF TRUTH)
│   │   ├── globals.css            ← @import tailwindcss + @import theme.css
│   │   └── playground.css        ← PLAYGROUND ONLY (not in published package)
│   ├── assets/
│   │   ├── converge-logo-header.png
│   │   ├── converge-logo-footer.png
│   │   ├── error.gif
│   │   ├── success.gif
│   │   └── loading.gif
│   ├── App.tsx                    ← playground/showcase (not in library)
│   ├── main.tsx                   ← Vite SPA entry
│   ├── index.ts                   ← library entry (imports globals.css, exports all)
│   └── vite-env.d.ts
├── vite.config.ts                 ← dual-mode: SPA or lib via BUILD_LIB env var
├── tsconfig.lib.json              ← library-only TS check (excludes App.tsx)
├── tsconfig.app.json
├── tsconfig.json
├── package.json
└── README.md
```

---

## 4. NPM Package

```
@dejesumensaje/converge-ds-experimental@0.1.0-alpha.4
```

**This is an experimental scope for validation only.** The production scope will be `@converge-labs` when ready for official release.

### Consumer installation

```bash
npm install @dejesumensaje/converge-ds-experimental
npm install react@^18 react-dom@^18   # or react@^19
```

### Consumer usage

```tsx
// Import styles once at app root
import '@dejesumensaje/converge-ds-experimental/styles.css'
// also works:
import '@dejesumensaje/converge-ds-experimental/styles'

// Import components
import { Button, Input, Select, Modal, Drawer, Table } from '@dejesumensaje/converge-ds-experimental'
import { Header, Sidebar, Footer } from '@dejesumensaje/converge-ds-experimental'
```

### package.json exports map

```json
{
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/converge-ds.js",
    "require": "./dist/converge-ds.umd.cjs"
  },
  "./styles.css": "./dist/converge-ds.css",
  "./styles": "./dist/converge-ds.css"
}
```

---

## 5. Build System

### Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server for playground at localhost:5173 |
| `npm run build` | SPA build → Vercel playground deployment |
| `npm run build:lib` | Library build → npm publishable dist/ |
| `npm run typecheck` | Full TypeScript check including App.tsx |
| `npm run preview` | Preview SPA build locally |

### Dual-mode config

`vite.config.ts` switches via `process.env.BUILD_LIB`:
- `BUILD_LIB=true` → lib mode: entry=`src/index.ts`, externals, dts plugin, single CSS
- default → SPA mode: entry=`index.html`, bundles everything for Vercel

### Release workflow

```bash
# Publish to npm
npm run build:lib
npm publish --access public

# Deploy playground (Vercel auto-runs npm run build)
git push
```

### Dev server recovery (if blank page)

```bash
pkill -9 -f "node.*vite"
rm -rf node_modules/.vite
npm run dev -- --force    # pre-warms deps before serving
```

**Root cause of blank page:** Multiple Vite instances corrupt `node_modules/.vite/deps/`. First HTTP request triggers dep optimization, freezing all responses. WebSocket can't connect either → silent deadlock. The `--force` flag pre-runs optimization at startup instead.

---

## 6. Architecture Rules (immutable)

### 6.1 Design Tokens

- `src/styles/theme.css` is the **single source of truth**. DO NOT regenerate or restructure without explicit user approval.
- shadcn naming convention: `--primary`, `--muted`, `--border`, `--ring`, etc.
- All spacing tokens include `px` units: `--spacing-s: 8px`
- All radius tokens include `px` units

**Critical tokens:**
```css
--primary: #26890D          /* Deloitte green — RESERVED for CTAs only */
--selection: #000000        /* active/selected states on non-CTA components */
--selection-foreground: #FFFFFF

/* Spacing sequence (NO --spacing-xs) */
--spacing-tiny: 2px  --spacing-xxs: 4px  --spacing-s: 8px
--spacing-m: 12px    --spacing-l: 16px   --spacing-xl: 24px
--spacing-xxl: 32px  --spacing-jumbo: 48px

/* Radius (NO --radius-xs, NO --radius-s) */
--radius-m: 8px   --radius-l: 16px   --radius-xl: 24px
--radius-full: 100px   --radius-badge: 100px
```

### 6.2 Color discipline — brand scarcity

`--primary` (#26890D Deloitte green) is RESERVED exclusively for:
- `Button variant="primary"`
- Focus rings (`--ring`)
- CTAs

**Exception:** Sidebar active state uses `--primary` (explicit design decision).

All other active/selected states → `--selection` (black).
Status meaning → `--success`, `--destructive`, `--warning`, `--informative` + their `*-bg-light` variants.

### 6.3 Component patterns

- All components use `React.forwardRef`
- Variants via CVA, never inline `style={}` (exception: dynamic rgba/blur for glass effect)
- `cn()` helper for class composition
- Named exports only, no defaults
- `displayName` set on all forwardRef components
- Buttons default to `type="button"`
- TypeScript discriminated unions for icon-only buttons (require `aria-label`)

### 6.4 Typography naming — strict 1:1 with Figma

```
Figma: Titles/H5        → CSS: .titles-h5
Figma: Body/Body1/Regular → CSS: .body-body1-regular
Figma: Caption/Caption  → CSS: .caption-caption  (double segment kept)
```

Typography utility classes live in `theme.css` (published).
Global element defaults (`h1`-`h6`, `body`, `html`) live ONLY in `playground.css` (NOT published).

### 6.5 CSS leakage rule

The published CSS (`dist/converge-ds.css`) must NOT contain bare tag selectors like `h1 { font-size: 96px }`. Only Tailwind's own normalize reset is acceptable. Component styles are class-scoped. Token styles are on `:root`.

### 6.6 Z-index hierarchy

```
Sidebar overlay: z-40 (Header)
Drawer:          z-49 (overlay) / z-50 (panel)
Modal:           z-59 (overlay) / z-60 (content)
FullScreenAlert: z-80
```

### 6.7 Accessibility (non-negotiable)

- WCAG 2.1 AA minimum, AAA for body text contrast
- `:focus-visible` only, never `:focus`
- 44×44px minimum touch targets
- `aria-pressed` on toggles, `aria-busy` on loading, `aria-disabled` on disabled
- Icon-only buttons: `aria-label` required, TypeScript-enforced

---

## 7. Components Built

### UI Primitives

| Component | Key notes |
|---|---|
| **Button** | 4 variants (primary/secondary/tertiary/text-link) × 3 sizes × glass effect × full state matrix (hover/focus/pressed/disabled/error/loading). Pill shape (`--radius-badge`). `Loader2` spin for loading state. Glass effect = Apple Liquid Glass–inspired, CSS-only. |
| **Input** | Size sm/md/lg. iconLeft/iconRight. error + helperText. `revealable` prop for password toggle (Eye/EyeOff). Floating label. `onMouseDown={e.preventDefault()}` on reveal button to prevent blur-before-click. |
| **Select** | Radix Popover + CMDK. Single and multi-select. Floating label. Multi: slice(0,2) chips + "+N more". Width controlled from outside via `className`. |
| **Switch** | `<button role="switch">` inside `<label>`. |
| **ToggleGroup** | Radio-group semantics. Moving pill indicator via CSS custom properties (`--pill-x`, `--pill-w`). `useLayoutEffect` + `ResizeObserver`. |
| **SearchInput** | Expandable. `expandDirection` prop. X button needs `onMouseDown={e.preventDefault()}`. |
| **Tabs** | `border-b-2 border-transparent -mb-px` trick for clean underline. ArrowLeft/Right/Home/End keyboard nav. CountBadge integration. Active uses `--selection` (NOT `--primary`). |

### Display

| Component | Key notes |
|---|---|
| **Badge** | Multiple variants + tones. |
| **Dot** | Status indicator. `aria-label` required (TypeScript-enforced discriminated union). |
| **CountBadge** | Number badge. `aria-label` required. |
| **Chip** | Dismissible (`onClose`), icon slot (`icon` prop — not `iconLeft`). |
| **Avatar** | Radix `@radix-ui/react-avatar`. Fixed 28×28px. Fallback: initials on muted bg. |
| **Tooltip** | Radix. Dark bubble. Export `TooltipProvider` separately — wrap tree once at app level. |

### Cards

| Component | Key notes |
|---|---|
| **Card** | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`. Max 1 level deep nesting. |
| **MetricCard** | Metric display with trend indicator. |
| **InformativeCard** | Status/info display card. |

### Data

| Component | Key notes |
|---|---|
| **Table** | 8 sub-components compound pattern. Variants: `default`, `zebra`, `standout`, `minimal`. `table.css` uses `!important` for selected/standout states. `TableHeaderGroup` requires `colSpan` (TypeScript-enforced). `min-width: 0` on `.cell-text` critical for truncation in flex. |

### Overlays

| Component | Key notes |
|---|---|
| **Modal** | Radix Dialog. Sticky header + scrollable body + sticky footer. Sizes: sm/md/lg/xl. `dismissible` prop. `showCloseButton` prop (decoupled from dismissible). `a11yTitle` for sr-only accessible label when no visible header. **Animation:** uses CSS `scale` standalone property (NOT `transform: scale()`) to avoid conflict with Tailwind's CSS variable–based centering transforms (`--tw-translate-x/y`). |
| **AlertModal** | Recipe on top of Modal. Variants: `alert`, `success`, `loading`. Always passes `title={undefined}` and `showCloseButton={false}` to Modal — no visual header ever. Non-dismissible when loading. Assets: `error.gif`, `success.gif`, `loading.gif`. |
| **FullScreenAlert** | Independent component — does NOT extend Modal. `fixed inset-0 z-[80] bg-background`. No overlay. Opacity-only animation (no transform needed for fixed inset-0). `dismissible` defaults to `variant !== 'loading'`. |
| **Drawer** | Right-side workspace panel. Sibling of Modal, not a wrapper. `fixed inset-y-0 right-0 z-[50]`. Softer overlay: `bg-black/[0.16] backdrop-blur-[4px]`. Slide animation: `translateX(32px → 0)` — safe to use transform here (no centering transform conflict). Always dismissible (no non-dismissible mode). |

### Layout

| Component | Key notes |
|---|---|
| **Header** | `fixed top-0 w-full z-40 h-16`. Radix DropdownMenu for AccountDropdown. PNG logo import. |
| **Sidebar** | NOT position:fixed internally — consumer positions. Width: `collapsed ? 56 : 220` via inline style. Toggle button absolutely positioned at top-right. `onCollapsedChange` optional prop — toggle only appears if provided. Dark theme: `bg-foreground`. Light: `bg-background`. Active: `--primary` (explicit exception to brand scarcity rule). |
| **Footer** | Centered layout. PNG logo. Copyright text only. |

---

## 8. Known Patterns & Gotchas

### CSS animation vs Tailwind transform conflict (Modal)

Modal uses `-translate-x-1/2 -translate-y-1/2` for centering (Tailwind CSS vars `--tw-translate-x`, `--tw-translate-y`). CSS keyframes that set `transform: scale()` directly override those vars during animation. At animation end, vars reassert → positional snap/jump.

**Fix:** Use CSS `scale` standalone property (CSS Transforms L2, not part of `transform` shorthand). Does not conflict.

```css
/* WRONG */
@keyframes show { from { transform: scale(0.97); } }

/* CORRECT */
@keyframes show { from { scale: 0.97; opacity: 0; } }
```

Drawer animation is safe to use `transform: translateX()` because `fixed inset-y-0 right-0` has no Tailwind centering transform to conflict with.

### ref.current read-only (React 18.3+)

`React.useRef<T>(null)` returns `RefObject<T>` where `current` is read-only. Use `React.useRef<T | null>(null)` for mutable refs. Cast forwarded refs: `(ref as React.MutableRefObject<T | null>).current = node`.

### Vite static import of vite-plugin-dts

Static import hangs Vite dev server. Always use dynamic import gated by `command === 'build'`:

```ts
command === 'build' && import('vite-plugin-dts').then(m => m.default({...}))
```

### playground.css @apply

`playground.css` cannot use `@apply` Tailwind directives — it has no `@import "tailwindcss"` context and will silently hang the Vite CSS processor. Use direct CSS custom property values instead:

```css
/* WRONG — hangs Vite */
* { @apply border-border; }

/* CORRECT */
* { border-color: var(--border); }
```

### Radix Dialog animation

Radix waits for CSS `animation` (not `transition`) `animationend` event before unmounting. Must use `animation:` in CSS, not `transition:`. Exit animations work because of this.

### SearchInput / Input reveal button

Interactive icons/buttons inside inputs need `onMouseDown={e => e.preventDefault()}` to prevent the input from losing focus before the click registers.

---

## 9. CSS Architecture

### Published package CSS

`dist/converge-ds.css` contains:
- Tailwind preflight/normalize
- `@theme inline` — Tailwind v4 color/spacing/radius utilities
- `:root` — design tokens
- `.dark` — dark mode token overrides
- `@layer base` — typography utility classes (`.titles-h1`–`.titles-h7`, `.body-body1-regular`, etc.)
- Component CSS files (button.css, modal.css, drawer.css, etc.)

### NOT in published CSS

- `h1 { font-size: 96px }` element defaults — playground only
- `body { font-family: ... }` — playground only
- `html { font-size: ... }` — playground only

### Typography utility class naming

```
.titles-h1 through .titles-h7
.titles-h1-semibold through .titles-h4-semibold
.body-body1-regular / .body-body1-semibold
.body-body2-regular / .body-body2-semibold
.input-inputtext / .input-inputlabel
.button-small / .button-medium / .button-large
.caption-caption / .tooltip-tooltip / .notification-notification
```

---

## 10. App.tsx Playground Structure

Five sections with sticky side nav (`PlaygroundNav`):

1. **Foundations** — tokens, typography, color palette
2. **Inputs & Selection** — Button, Input (incl. password reveal), Select, Switch, ToggleGroup, SearchInput, Tabs, Chip, Badge, Dot, CountBadge, Avatar, Tooltip
3. **Data Display** — Card family, MetricCard, InformativeCard, Table (all variants)
4. **Feedback & Guidance** — Modal (sm/md/lg/xl), AlertModal (alert/success/loading), FullScreenAlert (alert/success/loading), Drawer (sm/md/lg)
5. **Navigation & Layout** — Header preview, Sidebar (light/dark, collapsed/expanded), Footer

**Rule:** Every stateful instance has fully isolated state. Never share state between demos.

---

## 11. Release History

| Version | PR | Description |
|---|---|---|
| `0.1.0-alpha.1` | PR27 | Initial library packaging. UI + layout exports. tsconfig.lib.json. |
| `0.1.0-alpha.2` | PR27.1 | React 19 peerDep compatibility (`^18 \|\| ^19`). |
| `0.1.0-alpha.3` | PR27.2 | Fixed CSS export — added `"./styles.css"` to exports map. |
| `0.1.0-alpha.4` | PR27.3 | Removed global CSS leakage (h1–h6/body/html) from published bundle. Extracted to `playground.css`. |

**Current:** `0.1.0-alpha.4` — ready for publish once `npm publish --access public` is approved.

**Package name used:** `@dejesumensaje/converge-ds-experimental` (personal scope for validation; future enterprise scope will be `@converge-labs`).

---

## 12. Strict Rules — DO NOT

- DO NOT regenerate or modify `theme.css` unless explicitly instructed
- DO NOT modify existing components when working on a new one
- DO NOT use inline `style={}` for static values (exception: glass effect rgba/blur)
- DO NOT hardcode hex colors — always `var(--token-name)`
- DO NOT use slashes in CSS custom property names
- DO NOT default `<button>` to `type="submit"`
- DO NOT use `--primary` as a generic active/highlight color — use `--selection`
- DO NOT create files outside the established structure without asking
- DO NOT nest Cards more than 1 level deep
- DO NOT stack more than 2 Dialog/Drawer layers
- DO NOT run two Vite instances simultaneously

---

## 13. Immediate Next Steps (pending)

- [ ] `npm publish --access public` for `0.1.0-alpha.4` (awaiting explicit approval)
- [ ] Figma Make Kit integration test with published package
- [ ] Vercel playground deployment URL configuration
- [ ] Component documentation in `guidelines/components.md`
- [ ] Consider: Tooltip inside index.ts — verify `TooltipProvider` is re-exported
- [ ] Consider: bundle size optimization (currently 2.5MB ESM, all deps bundled)

---

## 14. Commands Reference

```bash
# Development
npm run dev                          # playground at localhost:5173
npm run dev -- --force               # if blank page (dep cache issue)

# Recovery from blank page
pkill -9 -f "node.*vite"
rm -rf node_modules/.vite
npm run dev -- --force

# Building
npm run build                        # SPA for Vercel
npm run build:lib                    # npm library package
npm run typecheck                    # full TS check (incl. App.tsx)

# Publishing
npm run build:lib
npm pack --dry-run                   # verify before publishing
npm publish --access public          # DO NOT run without explicit approval

# Consumer smoke test
node -e "import('@dejesumensaje/converge-ds-experimental').then(m => console.log(Object.keys(m)))" --input-type=module
```
