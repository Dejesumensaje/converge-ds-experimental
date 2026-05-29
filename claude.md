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
    globals.css         ← imports theme + Tailwind layers
  App.tsx               ← playground/showcase for dev
  main.tsx              ← Vite entry
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

## 5. Component Build Priority

Build in this exact order. Validate each in `App.tsx` before moving to the next:

1. **Button** (4 variants × 3 sizes × glass × full state matrix) — see Section 7 for spec
2. **Input + Label** (paired)
3. **Card**
4. **Badge**
5. **Select**
6. **Tabs**
7. **Dialog / Drawer**
8. **Table**

Do not start a component until the previous one is rendering correctly in the playground.

---

## 6. Strict Rules — DO NOT

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
- Do NOT use border-radius values outside the defined tokens (`--radius-m`, `--radius-l`, `--radius-xl`, `--radius-full`).
- Do NOT stack more than 2 Dialog/Drawer layers at once.

---

## 7. Button Specification

### 7.1 Variants
- **`primary`**: background `var(--primary)`, text `var(--primary-foreground)`
- **`secondary`**: outline `var(--border)`, text `var(--foreground)`, transparent background
- **`tertiary`**: no background, no outline, text `var(--foreground)`
- **`text-link`**: no background, no outline, no padding, text `var(--foreground)`, uses `body-body1-regular` typography, underline on hover

### 7.2 Sizes
- `sm`: height 32px, padding `var(--spacing-s)` vertical / `var(--spacing-l)` horizontal, typography `.button-small`, icon 16px
- `md` (default): height 40px, padding `var(--spacing-m)` / `var(--spacing-xl)`, typography `.button-medium`, icon 20px
- `lg`: height 48px, padding `var(--spacing-l)` / `var(--spacing-xxl)`, typography `.button-large`, icon 24px

### 7.3 Icon-only buttons
Square aspect: 32x32, 40x40, 48x48. Uniform padding. `aria-label` required (TypeScript-enforced).

### 7.4 Border radius
All variants except `text-link`: `var(--radius-badge)` (100px pill shape). `text-link`: no radius.

### 7.5 Props
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

### 7.6 States
- **Hover (primary)**: background to `var(--success)` (#207F19, darker green)
- **Hover (secondary no-glass / tertiary)**: background to `var(--muted)`
- **Hover (text-link)**: underline
- **Focus (`:focus-visible` only)**: 2px ring `color-mix(in srgb, var(--ring) 40%, transparent)`, 2px offset
- **Pressed** (toggle): apply primary treatment regardless of variant (except text-link). Set `aria-pressed`.
- **Disabled**: `opacity: 0.4` on entire button, `cursor: not-allowed`, `pointer-events: none`, `aria-disabled="true"`. KEEP the variant's color identity — do NOT turn gray.
- **Error**: primary → bg `var(--destructive)`. Secondary → outline + text `var(--destructive)`. Tertiary/text-link → text only.
- **Error + hover**: `filter: brightness(0.9)` on top of the error state.
- **Loading**: replace iconLeft (or insert if none) with `Loader2` from lucide-react with `animate-spin`. `pointer-events: none`, `aria-busy="true"`. No color change.

### 7.7 Glass effect (Apple Liquid Glass-inspired)
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

## 8. When to Ask vs. Execute

**ASK before:**
- Adding new tokens to `theme.css`
- Changing the variant API of an existing component
- Adding new dependencies (`npm install ...`)
- Creating files outside the established structure
- Anything in the DO NOT list (Section 6)

**EXECUTE without asking:**
- Writing component implementations following the established patterns above
- Running `npm run dev`, `npm run build`, etc.
- Editing files within the agreed scope of the current task
- Fixing bugs inside the file you're actively working on
- Reading other files to understand context

---

## 9. Validation Checklist (per component)

Before marking a component "done":
- [ ] Renders correctly in `App.tsx` playground for all variants/sizes/states
- [ ] TypeScript compiles with no errors
- [ ] All token references resolve (no `var(--undefined-token)`)
- [ ] All accessibility requirements met (Section 3.4)
- [ ] No inline `style={}` for static values
- [ ] No hardcoded hex colors
- [ ] Component documented in `guidelines/components.md` with: signature, variants, when to use, do/don't
- [ ] Exports from `src/components/ui/index.ts`
