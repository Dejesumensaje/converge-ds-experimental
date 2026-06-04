# Converge DS — Component Readiness Checklist

The bar a component must clear to be **ready to use**. Two uses:

- **Build-guide** — build new components to this from the start, so they don't accumulate latent debt.
- **Audit criteria** — run every existing component through it before packaging.

**How to run the audit:** for each component, mark every item ✅ / ❌ / N/A. A component is ready when no ❌ remains. Track results in the grid at the end.

> Radix-based components inherit most a11y items for free — **verify, don't assume**. The risk lives in the hand-rolled parts.

---

## 1. Accessibility

- [ ] **Semantic HTML** — right element for the job (interactive = `<button>`, headings are headings). Heading **level** reflects hierarchy, not size — style with `titles-*`, never pick the tag by font size.
- [ ] **Accessible name** — icon-only controls have `aria-label`; inputs tied to a `<label>` (`htmlFor`/`id`); dialogs have `aria-labelledby` → their title.
- [ ] **Keyboard** — every interactive element reachable and operable (Tab + Enter/Space; arrows for ToggleGroup / Tabs / Select / menus). No unintended traps.
- [ ] **Focus visible** — `--ring` indicator on every focusable element.
- [ ] **Focus management (overlays)** — focus trapped while open, returns to the trigger on close, Esc closes.
- [ ] **Roles & states** — correct roles (`dialog` / `alertdialog` / `tablist` / `switch` …) and live state (`aria-expanded` / `-selected` / `-checked` / `-disabled` / `-invalid`).
- [ ] **Status announced** — alerts / loading use `role="status"` / `"alert"` or `aria-live`.
- [ ] **Contrast** — text ≥ 4.5:1 (3:1 for large text / UI). State is **never** conveyed by color alone — status pills carry text, not just color.
- [ ] **Motion** — animations respect `prefers-reduced-motion` (ToggleGroup pill, SearchInput expand, overlay transitions).

## 2. Visual & CSS robustness

- [ ] **Tokens for design values** — colors and spacing always tokens, never hardcoded. (Raw px is allowed only for component pixel dimensions.)
- [ ] **Brand-color scarcity** — `--primary` only for Button primary / focus ring / CTA. Everything else: neutrals + `--selection` + semantic tokens.
- [ ] **Cascade-safe** — styles win on any element (incl. headings & form elements) without relying on unlayered overrides. Layer order respected; `titles-*` robust against a consumer's reset.
- [ ] **Self-contained** — owns its `box-sizing: border-box` + form-element resets; does not depend on a global reset.
- [ ] **Variant consistency** — same role = same treatment. Sibling / variant components share size, weight and spacing (the overlay-title lesson).
- [ ] **Resilient layout** — handles long text (truncate / wrap), narrow widths, overflow.
- [ ] **Surface variants** — `--surface-*` cascade works where dark / tinted is supported.

## 3. API & TypeScript

- [ ] **Prop vocabulary consistent** — `size` / `variant` / `disabled` etc. named and typed the same across components.
- [ ] **Controlled / uncontrolled** — clear and consistent; each instance independent, no shared state across instances (the Switch / SearchInput lesson).
- [ ] **Types exported**, no `any`; good IntelliSense.
- [ ] **Sensible defaults** — works with minimal props; required props kept minimal.
- [ ] **Composition** — compound parts expose the right slots ("cells and cards are canvases, not closed containers").
- [ ] **Passthrough** — `className` / `style` merge via `cn()`; `ref` forwarded to the DOM node.

## 4. Behavior & state

- [ ] **State correct + isolated** — no leakage between instances; no stale state.
- [ ] **All states handled + distinct** — default, hover, focus, active, disabled, loading, error, empty.
- [ ] **Edge cases** — empty data, very long content, many items.
- [ ] **Cleanup** — effects remove listeners / timers; no leaks.

## 5. Adoption layer (docs)

- [ ] Name + one-line description.
- [ ] When to use / when not.
- [ ] Variants and key props shown live.
- [ ] Copyable code snippet.
- [ ] Do's & don'ts where it matters.

---

## System-level (once, not per component)

- [ ] Layer order declared (`@layer theme, base, components, utilities;`); preflight imported into `base`.
- [ ] Every public component exported from `index.ts`.
- [ ] Tokens single source (`theme.css`); radius / accent redundancy resolved.
- [ ] Naming + file structure consistent.

---

## Audit tracking grid

| Component | a11y | CSS | API/TS | Behavior | Docs | Notes |
|---|---|---|---|---|---|---|
| Button | | | | | | |
| Input | | | | | | |
| Select | | | | | | |
| Switch | | | | | | |
| ToggleGroup | | | | | | |
| SearchInput | | | | | | |
| Table | | | | | | |
| Card | | | | | | |
| MetricCard | | | | | | |
| InformativeCard | | | | | | |
| Badge | | | | | | |
| CountBadge | | | | | | |
| Dot | | | | | | |
| Chip | | | | | | |
| Avatar | | | | | | |
| Tooltip | | | | | | |
| Modal | | | | | | |
| AlertModal | | | | | | |
| FullScreenAlert | | | | | | |
| Drawer | | | | | | |
| Tabs | | | | | | |
| Header | | | | | | |
| Sidebar | | | | | | |
| Footer | | | | | | |
