---
name: BusTrack Admin Portal
description: Clean, professional admin interface for school bus fleet management
colors:
  primary: "#1A56A0"
  primary-deep: "#0F3B73"
  secondary: "#3B82F6"
  accent: "#F97316"
  neutral-bg: "#FFFFFF"
  neutral-surface: "#F1F5F9"
  neutral-border: "#E2E8F0"
  neutral-ink: "#0F172A"
  neutral-muted: "#475569"
  success: "#166534"
  warning: "#C2410C"
  error: "#991B1B"
  info: "#2563EB"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2rem)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 2.5vw, 1.625rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 2vw, 1.3125rem)"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
  micro:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.08em"
    textTransform: "uppercase"
rounded:
  field: "0.5rem"
  box: "0.875rem"
  box-sm: "0.5rem"
  box-md: "0.875rem"
  box-lg: "1.125rem"
  box-xl: "1.875rem"
spacing:
  section: "24px"
  card: "16px"
  compact: "12px"
  tight: "8px"
  grid-gap: "12px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.field}"
    padding: "12px 24px"
    fontWeight: 600
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-muted}"
    rounded: "{rounded.field}"
    padding: "8px 16px"
  card-default:
    backgroundColor: "{colors.neutral-bg}"
    rounded: "{rounded.box}"
    padding: "{spacing.card}"
    border: "1px solid {colors.neutral-border}"
  input-default:
    backgroundColor: "{colors.neutral-bg}"
    rounded: "{rounded.field}"
    border: "1px solid {colors.neutral-border}"
    padding: "10px 14px"
  badge-default:
    rounded: "9999px"
    padding: "2px 10px"
    fontSize: "0.75rem"
    fontWeight: 600
---

# Design System: BusTrack Admin Portal

## 1. Overview

**Creative North Star: "The Command Center"**

BusTrack is a professional-grade admin interface for managing school bus operations. It prioritises clarity, predictability, and operational awareness. The system feels like a well-organised control room — every surface has a purpose, every status is readable at a glance, and navigation is effortless.

This system explicitly rejects decorative excess: no glassmorphism, no gradient text, no playful illustrations. Visual interest comes from thoughtful spacing, consistent colour cues, and purposeful micro-interactions. The admin should never wonder what something means or where to click next — the interface guides without calling attention to itself.

**Key Characteristics:**
- Clean, professional, self-guiding
- Status-forward information design
- Consistent, predictable spacing and rhythm
- Reliable colour semantics (green = good, amber = caution, red = error)
- Respects reduced motion preferences

## 2. Colors

A restrained blue-primary palette anchored by a trustworthy navy, with a warm orange accent for highlighting action-oriented elements. Neutrals lean cool (slate-based) for a crisp, professional feel.

### Primary
- **Signal Blue** (#1A56A0): Primary actions, active navigation, key data points. Used for buttons, active nav indicators, KPI values, and primary brand elements.
- **Signal Blue Deep** (#0F3B73): Hover states, pressed states, deeper emphasis within the primary role.

### Secondary
- **Action Blue** (#3B82F6): Secondary interactive elements, links, informational highlights. More vibrant than primary, used sparingly.

### Accent
- **Warm Ember** (#F97316): Call-to-action emphasis, warnings, attention-seeking badges. The only warm hue in the palette — its rarity is the point.

### Neutral
- **Pure White** (#FFFFFF): Surface backgrounds, card fills, input backgrounds.
- **Cool Slate** (#F1F5F9): Secondary surfaces, table row alternates, section backgrounds. A barely-there cool grey.
- **Silver Lining** (#E2E8F0): Borders, dividers, disabled states.
- **Mid Ink** (#475569): Secondary text, placeholder text, muted labels.
- **Deep Ink** (#0F172A): Primary body text, headings, high-emphasis content.

### Semantic
- **Leaf Green** (#166534): Success states, active indicators, completed status.
- **Amber Alert** (#C2410C): Warnings, maintenance due, caution states.
- **Stop Red** (#991B1B): Errors, critical alerts, dangerous status.
- **Info Blue** (#2563EB): Informational banners, notification indicators.

### Named Rules
**The One-Accent Rule.** Orange appears on no more than 5% of any screen. Its scarcity guarantees its attention-getting power.

**The Semantic-First Rule.** Never use a colour decoratively when a semantic colour exists. Success is always green, errors always red, regardless of brand aesthetics.

## 3. Typography

**Display Font:** Inter (with ui-sans-serif, system-ui, sans-serif fallback)
**Body Font:** Inter (same stack)

A single geometric sans-serif family used across all roles. The system relies on weight and size contrast (not font switching) to establish hierarchy. Consistent tracking and tight leading keep the interface crisp and readable.

### Hierarchy
- **Display** (800, clamp 1.75–2rem, 1.2, -0.02em): Page titles and dashboard headings. Use sparingly — one per view.
- **Headline** (700, clamp 1.375–1.625rem, 1.25, -0.02em): Section headings, card titles.
- **Title** (700, clamp 1.125–1.3125rem, 1.3, -0.02em): Subsection headings, sidebar branding.
- **Body** (400, 0.9375rem, 1.5): Primary reading text, descriptions, table cells.
- **Label** (500, 0.875rem, 1.4): Form labels, button text, navigation items.
- **Micro** (600, 0.6875rem, 1.3, 0.08em uppercase): Metadata, timestamps, status labels, table headers.

### Named Rules
**The Single-Voice Rule.** One typeface across all roles. Hierarchy is expressed through weight and size, not font switching — no serif display, no mono accents.

## 4. Elevation

A shadow-based elevation system with four distinct levels. Surfaces are flat at rest; elevation signals interactivity or hierarchy. Shadows are subtle — the goal is depth perception, not drama.

### Shadow Vocabulary
- **Card** (`0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)`): Default resting state for cards and containers.
- **Float** (`0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)`): Hovered cards, dropdowns, tooltips.
- **Sheet** (`0 8px 24px -4px rgb(0 0 0 / 0.1), 0 4px 8px -4px rgb(0 0 0 / 0.06)`): Modals, side panels, drawers.
- **Lift** (`0 12px 32px -8px rgb(0 0 0 / 0.12)`): High-emphasis overlays, focus states.

### Named Rules
**The Flat-by-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to interaction state (hover, active, elevated).

## 5. Components

### Buttons
- **Shape:** Moderately rounded (8px radius / `rounded-field`).
- **Primary:** Signal Blue fill, white text, 12px 24px padding, 600 weight. Hover deepens to Signal Blue Deep. Active presses further. Transitions are 200ms cubic-bezier.
- **Ghost:** Transparent background, Mid Ink text, 8px 16px padding. Hover gains a Cool Slate background tint.
- **Loading state:** Replaces text with a spinner; width does not collapse.

### Cards / Containers
- **Corner Style:** Rounded-box (14px radius).
- **Background:** Pure White.
- **Border:** 1px solid Silver Lining.
- **Internal Padding:** 16px (card spacing) or 12px (compact variant).
- **Shadow Strategy:** Card shadow at rest; Float shadow on hover for interactive cards (`card-hover` utility).

### Inputs / Fields
- **Style:** 1px solid Silver Lining, Pure White fill, 8px radius, 10px 14px padding.
- **Focus:** 2px Signal Blue ring (via DaisyUI focus treatment).
- **Error:** Stop Red border, error message below in label style.
- **Disabled:** Silver Lining background, Mid Ink text at 50% opacity.

### Navigation (Sidebar)
- **Width:** 256px (w-64).
- **Style:** Full height, 1px right border, sheet shadow.
- **Items:** Label weight, 12px 16px padding, rounded-lg (8px).
- **Active:** Signal Blue left inset border (3px), 8% Signal Blue background tint.
- **Hover:** Cool Slate background, full opacity text.

### Status Badges
- **Shape:** Fully pill (9999px), 2px 10px padding, 12px / 600 weight.
- **Variant — filled:** Color badge fill with white text + dot. Used for active states that need visual weight. Map: success→green, info→blue, warning→orange, error→red, ghost→muted.
- **Variant — ghost:** Transparent with muted dot. Used for low-emphasis states (waiting, off-duty, scheduled, inactive).
- **Pulse dot:** Added to `on-the-way`, `emergency`, `in-progress` — the universal "live" signal.
- **Color mapping (filled):** Active / On-the-way / On-board / Completed / On-duty → `badge-success`. In-transit / In-progress → `badge-info`. Arriving-soon / Delayed / On-leave / Pending → `badge-warning`. Emergency / Cancelled → `badge-error`. Waiting / Off-duty / Scheduled / Inactive → `badge-ghost` with muted text.
- **Compact variant:** Reduced padding, 10px font, no icon.

### Alerts / Banners
- **Shape:** Rounded-box (14px), 12px padding (compact) or 16px padding.
- **Semantic mapping:** Warning → Amber Alert left accent. Info → Info Blue left accent. Success → Leaf Green left accent. Error → Stop Red left accent.
- **Icon:** Left-aligned semantic icon with matching background fill.

## 6. Motion

Motion exists to communicate movement and state — never to decorate. Subtle, purposeful, mobility-grade. Eased settling for UI; linear for position interpolation.

### Motion Tokens
- **`--motion-ease-out`:** `cubic-bezier(0.16, 1, 0.3, 1)` — premium settle curve for cards, sheets, screen transitions.
- **`--motion-ease-in-out`:** `cubic-bezier(0.65, 0, 0.35, 1)` — fade transitions.
- **`--motion-duration-fast`:** 150ms — micro-interactions, hover states.
- **`--motion-duration-settle`:** 280ms — default for cards, sheets, panels settling into place.
- **`--motion-duration-notification`:** 420ms — toast entry animation; auto-dismiss after 3.4s.
- **`--motion-duration-pulse`:** 2s — marker ring + status dot pulse interval.

### Animation Utilities
| Utility | Purpose | Keyframes |
|---------|---------|-----------|
| `animate-settle` | Cards, panels entering view | fade + translateY(8px) at 280ms ease-out |
| `animate-notification` | Toast notifications | slide + fade from top at 420ms ease-out |
| `animate-fade-in` | Simple content reveals | opacity at 280ms ease-out |
| `dot-pulse` | Live status indicator | opacity + scale at 2s ease-in-out |
| `marker-glow` | Live bus map marker | box-shadow ring pulse at 2s ease-out |

### Named Rules
**The Motion-Purpose Rule.** Every animation serves state communication — never decoration. No orchestrated page-load sequences, no bounce, no elastic.
**Reduced Motion:** All animated elements respect `prefers-reduced-motion: reduce` with a global override that collapses all durations to 0.01ms.

## 7. Utilities

### Tabular Numerals
Use `tabular-nums` class on any element displaying dynamic numeric data (ETAs, speeds, distances, counts) to prevent digit jitter as values update. Applied via the `@utility tabular-nums` CSS class.

## 8. Component Library Structure

### Architecture
```
Primitives                        Composites
───────────                       ──────────
PrimaryButton · StatusBadge       BusCard · NotificationCard
Avatar · Icon                     TripTimeline · AlertBanner
                                  MapBottomSheet · DashboardMap
```

- **LiveMap** — shared verbatim by Dashboard and detail views; only overlays differ.
- **StatusBadge** — maps one trip-state enum to a tone; guarantees consistent language across all pages.
- **State ownership:** Data is owned by React Query (server state). Components are presentational and prop-driven.
- **Theme-driven:** All components use DaisyUI semantic tokens via CSS; theming the whole app = swapping token values.

## 9. Do's and Don'ts

### Do:
- **Do** use Signal Blue for all primary actions. One primary action per view.
- **Do** use the status colour mapping consistently: green for active/complete, amber for warnings, red for errors.
- **Do** keep body text at Deep Ink (not Mid Ink) to maintain ≥4.5:1 contrast.
- **Do** use `t-display` for page titles and `t-h1` through `t-h3` for section hierarchy.
- **Do** prefer the four-level shadow vocabulary over ad-hoc shadow values.
- **Do** keep cards flat with a single border — avoid `border-left` accent stripes.
- **Do** nest card elements directly (no nested cards) — use `gap` or internal sections instead.

### Don't:
- **Don't** use orange/accent decoratively — its role is attention-getting, never decorative.
- **Don't** use gradient text, glassmorphism, or hand-drawn SVG illustrations.
- **Don't** add shadows to cards that already have a border — pick one.
- **Don't** use border-radius larger than 16px on cards or sections (pill shapes are for badges only).
- **Don't** use numbered section markers (01, 02, 03) or all-caps eyebrow labels above every section.
- **Don't** animate layout properties (width, height, top, left) — use transform and opacity only.
- **Don't** skip reduced-motion: every animation needs a `@media (prefers-reduced-motion: reduce)` fallback.
- **Don't** use side-stripe borders (border-left greater than 1px) as decorative accents on cards or alerts.
