# Prism Design System — Rules & Tokens

**Version:** 1.0 by imagine.io
**Figma:** https://www.figma.com/design/kiwttYrNajH3hQwrtGtrle/Prism-Design-System?node-id=1-3

> **TO SYNC:** When the Prism Design System changes in Figma, run this exact prompt from any project:
> "Re-sync ~/.claude/prism-design-system.md with the latest Prism Design System from this Figma file: https://www.figma.com/design/kiwttYrNajH3hQwrtGtrle/Prism-Design-System?node-id=1-3"
> Claude will read the updated Figma variables and rewrite only the Token Reference section below. Core Rules will not be touched.

---

## Core Rules

- **Scope:** This design system is exclusively for **imagine.io** projects. Only apply these rules when the project's `CLAUDE.md` identifies it as an imagine.io project. Never apply Prism tokens, PP Neue Montreal, or imagine.io logos to unrelated projects.
- **Never hardcode** hex colors, font sizes, spacing, or border values. Always use CSS custom properties from the token set below.
- **Font:** PP Neue Montreal — always and only. **Never use Inter, system-ui, or any other fallback font in generated code.**
  - Fonts are installed system-wide (`~/Library/Fonts/`). No `@font-face` needed for local work — `font-family: 'PP Neue Montreal'` works directly in any browser or app.
  - **For all HTML/web projects (local and deployed):** always include a `fonts/` folder in the project with the 6 `.otf` files, and include the `@font-face` block from the Font Face section below using relative `./fonts/` paths. Chrome does not load system fonts via CSS without an explicit `@font-face` declaration.
  - Team members: install fonts to their own `~/Library/Fonts/` — see **Font Setup** section.
- **Logos:** SVG logo files are stored globally at `~/.claude/logos/`. Available variants:
  - `Horizontal.svg` — horizontal lockup, dark version
  - `Horizontal Light.svg` — horizontal lockup, light version
  - `Vertical.svg` — vertical lockup, dark version
  - `Vertical Light.svg` — vertical lockup, light version
  - `Mark.svg` — logo mark only
  When building any project UI, copy the needed SVG(s) into the project's `assets/` or `public/` folder and reference them from there.
- **Icons:** Material Symbols Outlined via Google Fonts CDN (`wght: 300`, `opsz: 24`).
- **Spacing:** Always use `--s-[scale]` tokens. Never use arbitrary px values for spacing.
- **Color — two-tier system:**
  - Tier 1: Brand primitives (e.g. `--papaya-500`) — raw palette values.
  - Tier 2: Alias/semantic tokens (e.g. `--surface-primary-default`) — reference brand primitives and carry meaning.
  - **Always prefer semantic aliases in UI code.** Use primitives only when no alias fits.
- **Border radius:** Use `--br-100` (4px) for small elements, `--br-200` (8px) for cards and containers.
- **CSS naming convention:** Figma variable paths map directly to CSS custom properties — `/` becomes `-`. Example: `surface/primary/default` → `--surface-primary-default`.
- **Responsive typography:** H1–H4 have three modes (Desktop/Tablet/Mobile). Use CSS custom properties with media queries — override `--text-h*-size` and `--text-h*-lh` at each breakpoint.
- **New projects:** Generate a `tokens.css` from the Token Reference below. Commit it. Import it globally. For deployed projects add the `@font-face` block with `./fonts/` relative paths; for local-only projects the system-installed font works without it. Never inline tokens in individual components.

---

## Token Reference

<!-- SYNC_START — Do not remove this comment. The sync prompt rewrites everything between SYNC_START and SYNC_END. -->

### Font Setup

Font files are stored locally on each machine at `~/Library/Fonts/`. Each team member must place the PP Neue Montreal `.otf` files there.

**Steps for new team members:**
1. Copy the 6 `.otf` files to `~/Library/Fonts/` on your machine:
   - `PPNeueMontreal-Light.otf`
   - `PPNeueMontreal-Regular.otf`
   - `PPNeueMontreal-Book.otf`
   - `PPNeueMontreal-Medium.otf`
   - `PPNeueMontreal-SemiBold.otf`
   - `PPNeueMontreal-Bold.otf`
2. Done — fonts are now available for every project via the `@font-face` block below.

### Font Face
**Always include this block in every project** — copy the 6 `.otf` files into the project's `fonts/` directory and add this to `tokens.css` or inline `<style>`:
```css
@font-face { font-family: 'PP Neue Montreal'; src: url('./fonts/PPNeueMontreal-Light.otf') format('opentype'); font-weight: 300; font-style: normal; }
@font-face { font-family: 'PP Neue Montreal'; src: url('./fonts/PPNeueMontreal-Regular.otf') format('opentype'); font-weight: 400; font-style: normal; }
@font-face { font-family: 'PP Neue Montreal'; src: url('./fonts/PPNeueMontreal-Book.otf') format('opentype'); font-weight: 450; font-style: normal; }
@font-face { font-family: 'PP Neue Montreal'; src: url('./fonts/PPNeueMontreal-Medium.otf') format('opentype'); font-weight: 500; font-style: normal; }
@font-face { font-family: 'PP Neue Montreal'; src: url('./fonts/PPNeueMontreal-SemiBold.otf') format('opentype'); font-weight: 600; font-style: normal; }
@font-face { font-family: 'PP Neue Montreal'; src: url('./fonts/PPNeueMontreal-Bold.otf') format('opentype'); font-weight: 700; font-style: normal; }
```

### CSS Custom Properties
```css
:root {

  /* ─────────────────────────────────────────────────────────
     TIER 1 — BRAND PRIMITIVES
     Raw palette values. Never use directly in UI components.
     ───────────────────────────────────────────────────────── */

  /* Papaya (Primary Brand) */
  --papaya-100: #fbdcce;
  --papaya-200: #f7b89d;
  --papaya-300: #f4956d;
  --papaya-400: #f0713c;
  --papaya-500: #ec4e0b;
  --papaya-600: #bd3e09;
  --papaya-700: #8e2f07;
  --papaya-800: #5e1f04;
  --papaya-900: #2f1002;

  /* Green (Success) */
  --green-100: #ccf0db;
  --green-200: #99e2b7;
  --green-300: #66d394;
  --green-400: #33c570;
  --green-500: #00b64c;
  --green-600: #00923d;
  --green-700: #006d2e;
  --green-800: #00491e;
  --green-900: #00240f;

  /* Red (Error) */
  --red-100: #fbced7;
  --red-200: #f79daf;
  --red-300: #f46d88;
  --red-400: #f03c60;
  --red-500: #ec0b38;
  --red-600: #bd092d;
  --red-700: #8e0722;
  --red-800: #5e0416;
  --red-900: #2f020b;

  /* Blue (Information) */
  --blue-100: #ceeefb;
  --blue-200: #9ddcf7;
  --blue-300: #6dcbf4;
  --blue-400: #3cb9f0;
  --blue-500: #0ba8ec;
  --blue-600: #0986bd;
  --blue-700: #07658e;
  --blue-800: #04435e;
  --blue-900: #02222f;

  /* Yellow (Warning) */
  --yellow-100: #fbf2ce;
  --yellow-200: #f7e59d;
  --yellow-300: #f4d96d;
  --yellow-400: #f0cc3c;
  --yellow-500: #ecbf0b;
  --yellow-600: #bd9909;
  --yellow-700: #8e7307;
  --yellow-800: #5e4c04;
  --yellow-900: #2f2602;

  /* Grey (Neutral) */
  --grey-50:  #f6f6f6;
  --grey-100: #e5e5e5;
  --grey-200: #cccccc;
  --grey-300: #b2b2b2;
  --grey-400: #999999;
  --grey-500: #7f7f7f;
  --grey-600: #666666;
  --grey-700: #4d4d4d;
  --grey-800: #333333;
  --grey-900: #1a1a1a;

  /* Foundations */
  --white: #ffffff;
  --dark:  #141414;


  /* ─────────────────────────────────────────────────────────
     TIER 2 — ALIAS / SEMANTIC TOKENS
     Reference brand primitives. Use these in all UI code.
     Naming: --[layer]-[role]-[state]
     ───────────────────────────────────────────────────────── */

  /* ── Text ──────────────────────────────────────────────── */
  --text-default-heading:              #1a1a1a;  /* → grey-900 */
  --text-default-body:                 #4d4d4d;  /* → grey-700 */
  --text-default-caption:              #4d4d4d;  /* → grey-700 */
  --text-default-placeholder:          #7f7f7f;  /* → grey-500 */
  --text-on-color-heading:             #ffffff;  /* → white */
  --text-on-color-body:                #ffffff;  /* → white */
  --text-on-color-caption:             #f6f6f6;  /* → grey-50 */
  --text-on-color-placeholder:         #f6f6f6;  /* → grey-50 */
  /* Primary */
  --text-primary-default:              #ec4e0b;  /* → papaya-500 */
  --text-primary-default-hover:        #bd3e09;  /* → papaya-600 */
  --text-primary-on-color:             #ffffff;
  --text-primary-on-color-hover:       #ffffff;
  /* Error */
  --text-error-default:                #ec0b38;  /* → red-500 */
  --text-error-default-hover:          #bd092d;  /* → red-600 */
  --text-error-on-color:               #ffffff;
  --text-error-on-color-hover:         #ffffff;
  /* Information */
  --text-information-default:          #0ba8ec;  /* → blue-500 */
  --text-information-default-hover:    #0986bd;  /* → blue-600 */
  --text-information-on-color:         #ffffff;
  --text-information-on-color-hover:   #ffffff;
  /* Warning */
  --text-warning-default:              #ecbf0b;  /* → yellow-500 */
  --text-warning-default-hover:        #bd9909;  /* → yellow-600 */
  --text-warning-on-color:             #ffffff;
  --text-warning-on-color-hover:       #ffffff;
  /* Success */
  --text-success-default:              #00b64c;  /* → green-500 */
  --text-success-default-hover:        #00923d;  /* → green-600 */
  --text-success-on-color:             #ffffff;
  --text-success-on-color-hover:       #ffffff;
  /* Disabled */
  --text-disabled-default:             #999999;  /* → grey-400 */
  --text-disabled-on-color:            #7f7f7f;  /* → grey-500 */

  /* ── Surface ────────────────────────────────────────────── */
  --surface-default:                          #ffffff;  /* → white */
  --surface-page:                             #ffffff;  /* → white */
  --surface-page-secondary:                   #f6f6f6;  /* → grey-50 */
  --surface-default-secondary:                #f6f6f6;  /* → grey-50 */
  /* Primary */
  --surface-primary-default:                  #ec4e0b;  /* → papaya-500 */
  --surface-primary-default-hover:            #bd3e09;  /* → papaya-600 */
  --surface-primary-default-subtle:           #fbdcce;  /* → papaya-100 */
  --surface-primary-default-subtle-hover:     #f7b89d;  /* → papaya-200 */
  /* Error */
  --surface-error-default:                    #ec0b38;  /* → red-500 */
  --surface-error-default-hover:              #bd092d;  /* → red-600 */
  --surface-error-default-subtle:             #fbced7;  /* → red-100 */
  --surface-error-default-subtle-hover:       #f79daf;  /* → red-200 */
  /* Information */
  --surface-information-default:              #0ba8ec;  /* → blue-500 */
  --surface-information-default-hover:        #0986bd;  /* → blue-600 */
  --surface-information-default-subtle:       #ceeefb;  /* → blue-100 */
  --surface-information-default-subtle-hover: #9ddcf7;  /* → blue-200 */
  /* Warning */
  --surface-warning-default:                  #ecbf0b;  /* → yellow-500 */
  --surface-warning-default-hover:            #bd9909;  /* → yellow-600 */
  --surface-warning-default-subtle:           #fbf2ce;  /* → yellow-100 */
  --surface-warning-default-subtle-hover:     #f7e59d;  /* → yellow-200 */
  /* Success */
  --surface-success-default:                  #00b64c;  /* → green-500 */
  --surface-success-default-hover:            #00923d;  /* → green-600 */
  --surface-success-default-subtle:           #ccf0db;  /* → green-100 */
  --surface-success-default-subtle-hover:     #99e2b7;  /* → green-200 */
  /* Disabled */
  --surface-disabled-disabled:                #cccccc;  /* → grey-200 */

  /* ── Border ─────────────────────────────────────────────── */
  --border-default:                           #f6f6f6;  /* → grey-50 */
  --border-default-secondary:                 #e5e5e5;  /* → grey-100 */
  /* Primary */
  --border-primary-default:                   #ec4e0b;  /* → papaya-500 */
  --border-primary-default-hover:             #bd3e09;  /* → papaya-600 */
  --border-primary-default-subtle:            #fbdcce;  /* → papaya-100 */
  --border-primary-default-subtle-hover:      #f7b89d;  /* → papaya-200 */
  --border-primary-focus:                     #ec4e0b;  /* → papaya-500 */
  /* Error */
  --border-error-default:                     #ec0b38;  /* → red-500 */
  --border-error-default-hover:               #bd092d;  /* → red-600 */
  --border-error-default-subtle:              #fbced7;  /* → red-100 */
  --border-error-default-subtle-hover:        #f79daf;  /* → red-200 */
  --border-error-focus:                       #ec0b38;  /* → red-500 */
  /* Information */
  --border-information-default:               #0ba8ec;  /* → blue-500 */
  --border-information-default-hover:         #0986bd;  /* → blue-600 */
  --border-information-default-subtle:        #ceeefb;  /* → blue-100 */
  --border-information-default-subtle-hover:  #9ddcf7;  /* → blue-200 */
  --border-information-focus:                 #0ba8ec;  /* → blue-500 */
  /* Warning */
  --border-warning-default:                   #ecbf0b;  /* → yellow-500 */
  --border-warning-default-hover:             #bd9909;  /* → yellow-600 */
  --border-warning-default-subtle:            #fbf2ce;  /* → yellow-100 */
  --border-warning-default-subtle-hover:      #f7e59d;  /* → yellow-200 */
  --border-warning-focus:                     #ecbf0b;  /* → yellow-500 */
  /* Success */
  --border-success-default:                   #00b64c;  /* → green-500 */
  --border-success-default-hover:             #00923d;  /* → green-600 */
  --border-success-default-subtle:            #ccf0db;  /* → green-100 */
  --border-success-default-subtle-hover:      #99e2b7;  /* → green-200 */
  --border-success-focus:                     #00b64c;  /* → green-500 */
  /* Disabled */
  --border-disabled-disabled:                 #cccccc;  /* → grey-200 */

  /* ── Icons ──────────────────────────────────────────────── */
  /* Primary */
  --icons-primary-default:                    #ec4e0b;  /* → papaya-500 */
  --icons-primary-default-hover:              #bd3e09;  /* → papaya-600 */
  --icons-primary-on-color:                   #ffffff;
  --icons-primary-on-color-hover:             #ffffff;
  /* Error */
  --icons-error-default:                      #ec0b38;  /* → red-500 */
  --icons-error-default-hover:                #bd092d;  /* → red-600 */
  --icons-error-on-color:                     #ffffff;
  --icons-error-on-color-hover:               #ffffff;
  /* Information */
  --icons-information-default:                #0ba8ec;  /* → blue-500 */
  --icons-information-default-hover:          #0986bd;  /* → blue-600 */
  --icons-information-on-color:               #ffffff;
  --icons-information-on-color-hover:         #ffffff;
  /* Warning */
  --icons-warning-default:                    #ecbf0b;  /* → yellow-500 */
  --icons-warning-default-hover:              #bd9909;  /* → yellow-600 */
  --icons-warning-on-color:                   #ffffff;
  --icons-warning-on-color-hover:             #ffffff;
  /* Success */
  --icons-success-default:                    #00b64c;  /* → green-500 */
  --icons-success-default-hover:              #00923d;  /* → green-600 */
  --icons-success-on-color:                   #ffffff;
  --icons-success-on-color-hover:             #ffffff;
  /* Disabled */
  --icons-disabled-default:                   #999999;  /* → grey-400 */
  --icons-disabled-on-color:                  #7f7f7f;  /* → grey-500 */


  /* ─────────────────────────────────────────────────────────
     TYPOGRAPHY
     Desktop values (default). Override with media queries below.
     ───────────────────────────────────────────────────────── */

  --font: 'PP Neue Montreal';

  /* Heading scale — Desktop */
  --text-h1-size: 60px;  --text-h1-lh: 72px;  --text-h1-ls: -2px;
  --text-h2-size: 48px;  --text-h2-lh: 56px;  --text-h2-ls: -2px;
  --text-h3-size: 40px;  --text-h3-lh: 48px;  --text-h3-ls: -1px;
  --text-h4-size: 32px;  --text-h4-lh: 40px;  --text-h4-ls: -1px;
  --text-h5-size: 24px;  --text-h5-lh: 28px;  --text-h5-ls: -0.12px;
  --text-h6-size: 20px;  --text-h6-lh: 24px;

  /* Copy scale — same across all breakpoints */
  --text-body-lg-size: 20px;  --text-body-lg-lh: 24px;
  --text-body-size:    16px;  --text-body-lh:    20px;
  --text-small-size:   14px;  --text-small-lh:   16px;  --text-small-ls:   1px;
  --text-caption-size: 12px;  --text-caption-lh: 16px;  --text-caption-ls: 2px;


  /* ─────────────────────────────────────────────────────────
     SPACING SCALE
     Scale/100 → --s-100, Scale/200 → --s-200, etc.
     ───────────────────────────────────────────────────────── */

  --s-100:  4px;
  --s-200:  8px;
  --s-300:  12px;
  --s-400:  16px;
  --s-500:  20px;
  --s-600:  24px;
  --s-700:  28px;
  --s-800:  32px;
  --s-900:  36px;
  --s-1000: 40px;
  --s-1100: 48px;
  --s-1200: 56px;
  --s-1300: 64px;
  --s-1400: 72px;


  /* ─────────────────────────────────────────────────────────
     BORDER
     ───────────────────────────────────────────────────────── */

  --bw-25:  1px;   /* Border Width/25  — default border */
  --bw-100: 4px;   /* Border Width/100 */
  --br-100: 4px;   /* Border Radius/100 — inputs, badges, small elements */
  --br-200: 8px;   /* Border Radius/200 — cards, panels, containers */

  /* Aliases */
  --bw:   var(--bw-25);
  --br-s: var(--br-100);
  --br-m: var(--br-200);
}

/* ─────────────────────────────────────────────────────────
   RESPONSIVE TYPOGRAPHY
   H1–H4 scale down on mobile. H5/H6 and copy are unchanged.
   Desktop = Tablet (1024px+). Mobile overrides below.
   ───────────────────────────────────────────────────────── */

@media (max-width: 440px) {
  :root {
    --text-h1-size: 48px;  --text-h1-lh: 56px;
    --text-h2-size: 40px;  --text-h2-lh: 48px;
    --text-h3-size: 32px;  --text-h3-lh: 40px;
    --text-h4-size: 28px;  --text-h4-lh: 32px;
  }
}
```

### Typography Reference

| Style | Size (Desktop) | Size (Mobile) | Weight | Line Height | Letter Spacing |
|-------|---------------|---------------|--------|-------------|----------------|
| H1 | 60px | 48px | Regular (400) | 72px / 56px | -2px |
| H2 | 48px | 40px | Regular (400) | 56px / 48px | -2px |
| H3 | 40px | 32px | SemiBold (600) | 48px / 40px | -1px |
| H4 | 32px | 28px | Regular (400) | 40px / 32px | -1px |
| H5 | 24px | 24px | Regular (400) | 28px | -0.12px |
| H6 | 20px | 20px | Medium (500) | 24px | — |
| body-lg | 20px | 20px | Regular (400) | 24px | — |
| body | 16px | 16px | Regular (400) | 20px | — |
| small | 14px | 14px | Medium (500) | 16px | 1px |
| caption | 12px | 12px | Regular (400) | 16px | 2px |

> Each heading style is available in Regular, Medium, SemiBold, and Bold weights. Use composite token pattern: `H3/SemiBold`, `body/Medium`, `caption/Regular`, etc.

### Spacing Reference

| Token | Value | Use |
|-------|-------|-----|
| `--s-100` | 4px | Micro gaps, icon padding |
| `--s-200` | 8px | Tight spacing |
| `--s-300` | 12px | Small gaps |
| `--s-400` | 16px | Default element spacing |
| `--s-500` | 20px | Medium gaps |
| `--s-600` | 24px | Section padding (small) |
| `--s-800` | 32px | Section padding (default) |
| `--s-1100` | 48px | Large section gaps |
| `--s-1400` | 72px | Page-level padding |

### Semantic Token Pattern

```
--[layer]-[role]-[state]

layer  → text | surface | border | icons
role   → default | primary | error | information | warning | success | disabled | on-color
state  → default | default-hover | on-color | on-color-hover
         default-subtle | default-subtle-hover | focus | disabled
```

<!-- SYNC_END — Do not remove this comment. -->
