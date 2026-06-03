# Converge Design System

> Project-level instructions for Claude Code. Read this fully before any task.

---

## 1. Project Context

This is the **Converge Design System** — a React component library for Deloitte's Converge platform suite (B2B SaaS for retail, CPG, and restaurant franchise clients).

The library is consumed in two ways:
1. **Figma Make** (primary, near-term): PMs vibe code prototypes using these components via a Make Kit that imports this package from Figma's private npm registry.
2. **Production Converge code** (future): The same components used in real product code.

Implication: components must be production-quality from day one. Treat every component as if it ships to real users.

---

## 2. Stack

- React 18
- TypeScript (strict mode)
- Vite (library mode for the published build, dev mode for the playground)
- Tailwind CSS v4 (uses `@theme inline` directive)
- `class-variance-authority` (CVA) for variant management
- `clsx` + `tailwind-merge` composed via a `cn()` helper
- `lucide-react` for icons
- Radix UI primitives for accessible behaviors (Select, Dialog, Tabs, etc.)

---

## 3. Architectural Decisions (immutable unless user agrees)

### 3.1 Design tokens

- **`src/styles/theme.css` is the single source of truth for tokens.**
- DO NOT regenerate, rewrite, or restructure `theme.css`. If you need a token that doesn't exist, list what you need and ASK before modifying.
- The token API surface follows shadcn naming convention (`--primary`, `--accent`, `--destructive`, `--muted`, `--border`, `--ring`, etc.) with Converge brand values mapped in.
- Extended Converge tokens (chart colors, heatmap, semantic backgrounds, semantic colors like `--success` / `--warning` / `--informative`) coexist with the shadcn surface.
- All spacing tokens include `px` units (`--spacing-s: 8px`, not `8`).
- All border-radius tokens include `px` units.

### 3.1.1 Token usage rules

- COLORS: always a token, never raw hex. Prefer the Tailwind utility mapped via `@theme` (`bg-primary`, `text-muted-foreground`) when it exists; use arbitrary `[var(--token)]` ONLY for tokens not exposed as utilities.
- SPACING (padding, margin, gap): always a spacing token (`var(--spacing-*)` or the mapped utility). Never raw px for spacing.
- COMPONENT DIMENSIONS (fixed heights/widths, e.g. a 40px button height, a 16px switch track): raw px is acceptable as a documented component-specific value. These are not part of the spacing scale.
- BORDER-RADIUS: only radius tokens (see note below). Never raw px radius.
- TYPOGRAPHY: only the `.titles-*` / `.body-*` / `.button-*` / `.caption-caption` / `.tooltip-tooltip` / `.notification-notification` classes. Never raw font-size/line-height/letter-spacing.
- Before referencing a token, confirm it exists in `theme.css`. A misspelled `var(--token)` fails silently. If unsure, read theme.css first.

#### Radius token note (theme.css cleanup pending user approval)
theme.css currently has redundancy/conflict:
- `--radius-full`, `--radius-button`, `--radius-badge` are ALL 100px (three names, one value).
- `--radius-xl` is 24px in `:root` but 20px in `@theme inline` — a conflict.

Until the user approves a theme.css cleanup, canonical usage is:
- Pills (buttons, badges, chips): `--radius-full` (100px). Do NOT use `--radius-button` or `--radius-badge` in new code.
- Cards/surfaces: `--radius-l` (16px).
- Inputs/small surfaces: `--radius-m` (8px).
- Avoid `--radius-xl` until the conflict is resolved.

### 3.2 Component patterns

- All components use `React.forwardRef` for ref passthrough.
- Variants managed via CVA, NOT inline `style={}` objects. Inline `style` is only acceptable for dynamic values that can't be expressed as classes (e.g., the glass effect's specific rgba values).
- Use the `cn()` helper from `src/lib/utils.ts` for class composition.
- Named exports only; no default exports.
- TypeScript discriminated unions to enforce required props (e.g., `aria-label` required when component is icon-only).
- Buttons default to `type="button"` unless explicitly overridden.
- `displayName` set on all forwardRef components.

### 3.3 Naming convention — strict 1:1 with Figma

Typography class names mirror Figma paths exactly, with dashes replacing slashes:
- Figma `Titles/H5` → CSS `.titles-h5`
- Figma `Body/Body1/Regular` → CSS `.body-body1-regular`
- Figma `Caption/Caption` → CSS `.caption-caption` (keep the double stutter when Figma path has identical segments — do NOT simplify to `.caption`)

Custom property names use kebab-case, no slashes, no escaped characters:
- `--primary`, not `--main-color`
- `--text-primary`, not `--text\/primary`

This convention removes the translation step between Figma references and code. Do not invent new naming rules.

### 3.4 Accessibility (non-negotiable)

- WCAG 2.1 AA minimum, AAA for body text contrast.
- `:focus-visible` only for focus rings, never `:focus` (avoids ring on mouse click).
- Effective touch target 44x44px minimum (use padding around small visual buttons).
- Icon-only buttons require `aria-label` — enforce via TypeScript discriminated union.
- `aria-pressed` on toggle-state buttons, `aria-busy` on loading states, `aria-disabled` on disabled.

### 3.5 Color Discipline — Brand color is scarce

The Converge brand color (`--primary` = #26890D, Deloitte green) is RESERVED exclusively for:
- Button variant="primary"
- Focus rings (`--ring`)
- CTAs and the single most important action on any given screen

ALL other components must use the neutral + semantic palette:
- Default surfaces: `--background`, `--foreground`, `--muted`, `--border`
- Selected/active states (chips, tabs, toggles, list items): `--selection` + `--selection-foreground`
- Status meaning: `--success`, `--destructive`, `--warning`, `--informative` + their `*-bg-light` variants for backgrounds

This includes Badge, Chip, Dot, CountBadge, Tabs, navigation, breadcrumbs, table row highlights, anything else needing "active" or "highlighted" treatment.

DO NOT use `--primary` as a generic "active/highlighted" color outside of buttons. If you find yourself wanting to use `--primary` outside of Button/CTA context, stop and use `--selection` or a semantic token instead.

Rationale: brand scarcity enables clean theming (rebrand without touching components), preserves visual hierarchy (brand color stays attention-grabbing because rare), and reduces cognitive load.

### 3.6 Component self-containment (non-negotiable)

Components MUST NOT depend on any global CSS reset (Tailwind preflight, normalize, etc.). The published package ships no global reset; a component that relies on one breaks in a consumer.

Every component owns its reset, scoped to its own root and elements:
- `box-sizing: border-box` on the component root and any sized children (so `h-[40px]` + padding measures correctly).
- Native form elements (`button`, `input`, `select`, `textarea`) MUST explicitly set: `appearance: none`, the designed `border` (or `none`), the designed `background`, `font: inherit` (or the designed typography class), and `margin: 0`. Otherwise native browser chrome (default borders/backgrounds) leaks through.

Mental test: "if this rendered in a bare HTML page with no reset, would it still look correct?" If not, it is not self-contained.

---

## 4. File Structure

```
src/
  components/
    ui/
      Button/
        Button.tsx
        button.css
        index.ts
      Card/
        Card.tsx
        index.ts
      ...
  lib/
    utils.ts            ← cn() helper, exported named
  styles/
    theme.css           ← tokens (DO NOT modify without instruction)
    globals.css         ← imported by the library; Tailwind layers + scoped utilities
    playground.css      ← PLAYGROUND ONLY; preflight + demo globals (never imported by index.ts)
  index.ts              ← LIBRARY entry; everything here ships to npm
  App.tsx               ← playground/showcase for dev
  main.tsx              ← Vite entry (playground)
  vite-env.d.ts         ← Vite env type declarations
guidelines/             ← for Figma Make consumption
  Guidelines.md
  tokens.md
  components.md
  styles.md
package.json
vite.config.ts
tsconfig.json
```

---

## 5. Library vs Playground — Two Build Targets

This repo produces two outputs from one codebase. Mixing them breaks consumers.

### Entry points
- `src/index.ts` — LIBRARY entry. Everything it exports (and the CSS it imports) ships to npm.
- `src/main.tsx` — PLAYGROUND entry. The Vite dev/demo app. Never published.

### CSS separation (non-negotiable)
- `src/styles/theme.css` — tokens + scoped typography classes (`.titles-*`, `.body-*`). Published. Zero bare element selectors.
- `src/styles/globals.css` — imported by the LIBRARY. May import Tailwind `theme.css` + `utilities.css`, token layers, scoped component utilities. MUST NOT contain bare element selectors (`h1`, `body`, `p`, `*`) or Tailwind preflight.
- `src/styles/playground.css` — imported ONLY by `main.tsx`. May contain Tailwind preflight, bare `h1`/`body` styling, demo globals. NEVER imported by `src/index.ts`.

### The golden rule
The published package styles ONLY tokens (CSS variables) and scoped classes. It NEVER styles bare HTML elements. A consumer's `<h1>`, `<body>`, `<button>` must remain untouched after importing our CSS.

### Current working mode
We are COMPLETING the design system, not packaging it. Develop in playground/dev mode (`npm run dev`). Do NOT run the library build, do NOT publish, do NOT touch `vite.config.ts`, `tsconfig.lib.json`, or `package.json` exports/scripts. The library config stays dormant until the dedicated packaging phase.

---

## 6. Component Inventory

Built and rendering in the playground:
- Layout: Header, Sidebar, Footer
- Core: Button, Input, Select, Switch, Tabs, ToggleGroup, Tooltip, Avatar
- Display: Table (compound), Card, MetricCard, InformativeCard, Badge, CountBadge, Dot, Chip
- Overlay/feedback: Modal, AlertModal, FullScreenAlert, Drawer

Pending (DS completion phase):
- Foundations showcases: Color, Typography, Spacing (+ restructured sidebar IA with a real Foundations section)
- Missing components: Skeleton, MetricCard bar/group; TBD pending user decision: Checkbox, Radio, Popover
- Per-component docs: subtitle, description, use cases, code snippet (the `guidelines/` folder is currently empty)

Build new components self-contained (Section 3.6) and validate in the playground before moving on.

---

## 7. Strict Rules — DO NOT

- Do NOT regenerate or modify `theme.css` unless the user explicitly asks.
- Do NOT modify other existing components when working on a new one. If you spot a bug elsewhere, mention it and ask.
- Do NOT use inline `style={}` for things that belong in CVA variants or Tailwind classes. Exception: dynamic rgba/blur values for glass effect.
- Do NOT hardcode hex colors. Always reference tokens via `var(--token-name)` or Tailwind classes that map to tokens.
- Do NOT use slashes in custom property names.
- Do NOT default `<button>` to `type="submit"`. Always `type="button"` unless inside an intentional form submit context.
- Do NOT inject CSS via `document.createElement('style')` at runtime. Use real CSS files imported into components.
- Do NOT create new top-level files or directories without checking with the user.
- Do NOT use emoji as icons. Use `lucide-react`.
- Do NOT center-align long-form text.
- Do NOT nest Cards more than 1 level deep.
- Do NOT use border-radius values outside the radius token set. Follow the canonical usage in 3.1.1: pills → `--radius-full`, cards/surfaces → `--radius-l`, inputs → `--radius-m`. Avoid `--radius-xl`, `--radius-button`, `--radius-badge`.
- Do NOT stack more than 2 Dialog/Drawer layers at once.

---

## 8. Button Specification

### 8.1 Variants
- **`primary`**: background `var(--primary)`, text `var(--primary-foreground)`
- **`secondary`**: outline `var(--border)`, text `var(--foreground)`, transparent background
- **`tertiary`**: no background, no outline, text `var(--foreground)`
- **`text-link`**: no background, no outline, no padding, text `var(--foreground)`, uses `body-body1-regular` typography, underline on hover

### 8.2 Sizes
- `sm`: height 32px, padding `var(--spacing-s)` vertical / `var(--spacing-l)` horizontal, typography `.button-small`, icon 16px
- `md` (default): height 40px, padding `var(--spacing-m)` / `var(--spacing-xl)`, typography `.button-medium`, icon 20px
- `lg`: height 48px, padding `var(--spacing-l)` / `var(--spacing-xxl)`, typography `.button-large`, icon 24px

### 8.3 Icon-only buttons
Square aspect: 32x32, 40x40, 48x48. Uniform padding. `aria-label` required (TypeScript-enforced).

### 8.4 Border radius
All variants except `text-link`: `var(--radius-full)` (100px pill shape). `text-link`: no radius.

### 8.5 Props
```ts
type BaseButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>
  & VariantProps<typeof buttonVariants>
  & {
    iconLeft?: LucideIcon
    iconRight?: LucideIcon
    glass?: boolean      // only meaningful for variant="secondary"
    pressed?: boolean    // toggle state
    loading?: boolean
    error?: boolean
  }

export type ButtonProps =
  | (BaseButtonProps & { children: React.ReactNode; 'aria-label'?: string })
  | (BaseButtonProps & { children?: undefined; 'aria-label': string })
```

### 8.6 States
- **Hover (primary)**: background to `var(--success)` (#207F19, darker green)
- **Hover (secondary no-glass / tertiary)**: background to `var(--muted)`
- **Hover (text-link)**: underline
- **Focus (`:focus-visible` only)**: 2px ring `color-mix(in srgb, var(--ring) 40%, transparent)`, 2px offset
- **Pressed** (toggle): apply primary treatment regardless of variant (except text-link). Set `aria-pressed`.
- **Disabled**: `opacity: 0.4` on entire button, `cursor: not-allowed`, `pointer-events: none`, `aria-disabled="true"`. KEEP the variant's color identity — do NOT turn gray.
- **Error**: primary → bg `var(--destructive)`. Secondary → outline + text `var(--destructive)`. Tertiary/text-link → text only.
- **Error + hover**: `filter: brightness(0.9)` on top of the error state.
- **Loading**: replace iconLeft (or insert if none) with `Loader2` from lucide-react with `animate-spin`. `pointer-events: none`, `aria-busy="true"`. No color change.

### 8.7 Glass effect (Apple Liquid Glass-inspired)
Only applies when `variant="secondary"` AND `glass={true}`:
```css
background: rgba(255, 255, 255, 0.18);
backdrop-filter: blur(24px) saturate(180%);
-webkit-backdrop-filter: blur(24px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.25);
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.4),
  inset 0 -1px 0 rgba(0, 0, 0, 0.05),
  0 8px 32px rgba(0, 0, 0, 0.1);
```
On hover: increase top highlight to `rgba(255, 255, 255, 0.55)` and blur to 28px. Implement in `button.css`, not inline.

---

## 9. When to Ask vs. Execute

**ASK before:**
- Adding new tokens to `theme.css`
- Changing the variant API of an existing component
- Adding new dependencies (`npm install ...`)
- Creating files outside the established structure
- Anything in the DO NOT list (Section 7)

**EXECUTE without asking:**
- Writing component implementations following the established patterns above
- Running `npm run dev`, `npm run build`, etc.
- Editing files within the agreed scope of the current task
- Fixing bugs inside the file you're actively working on
- Reading other files to understand context

---

## 10. Validation Checklist (per component)

Before marking a component "done":
- [ ] Renders correctly in `App.tsx` playground for all variants/sizes/states
- [ ] TypeScript compiles with no errors
- [ ] All token references resolve (no `var(--undefined-token)`)
- [ ] All accessibility requirements met (Section 3.4)
- [ ] No inline `style={}` for static values
- [ ] No hardcoded hex colors
- [ ] Component documented in `guidelines/components.md` with: signature, variants, when to use, do/don't
- [ ] Exports from `src/components/ui/index.ts`
- [ ] No bare element selectors in any CSS reaching `src/index.ts` (grep package CSS for `h1`, `h2`, `body`, `p`, `*` → 0 matches)
- [ ] Self-contained: renders correctly with no global reset (own box-sizing + form resets per 3.6)
- [ ] No raw px used for spacing (spacing uses tokens)
- [ ] Radius values come only from the radius token set
