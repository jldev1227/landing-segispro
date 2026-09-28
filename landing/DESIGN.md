---
name: SEGISPRO Ingeniería — Landing
description: Navy-on-white technical restraint for a Colombian occupational health and safety consultancy that sells with verified numbers.
colors:
  marca-50: "#f3f6fa"
  marca-100: "#e3eaf2"
  marca-200: "#c5d4e4"
  marca-300: "#9cb3ce"
  marca-400: "#6d8aaf"
  marca-500: "#4a6c95"
  marca-600: "#35547a"
  marca-700: "#2a4566"
  marca-800: "#223a54"
  marca-900: "#1b2e43"
  marca-950: "#111d2b"
  acento-400: "#16d17a"
  acento-500: "#00bf62"
  acento-700: "#008544"
  realce-400: "#ffad2b"
  realce-700: "#b44e07"
  neutral-0: "#ffffff"
  neutral-50: "oklch(98.5% 0.002 247.839)"
  neutral-100: "oklch(96.7% 0.003 264.542)"
  neutral-200: "oklch(92.8% 0.006 264.531)"
  neutral-300: "oklch(87.2% 0.01 258.338)"
  neutral-400: "oklch(70.7% 0.022 261.325)"
  neutral-500: "oklch(55.1% 0.027 264.364)"
  neutral-600: "oklch(44.6% 0.03 256.802)"
  neutral-800: "oklch(27.8% 0.033 256.848)"
  neutral-900: "oklch(21% 0.034 264.665)"
  danger-50: "oklch(97.1% 0.013 17.38)"
  danger-200: "oklch(88.5% 0.062 18.334)"
  danger-700: "oklch(50.5% 0.213 27.518)"
typography:
  display:
    fontFamily: "'Geist Variable', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "normal"
  headline:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  title:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  body-small:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.333
    letterSpacing: "0.025em"
  figure:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.025em"
    fontVariant: "tabular-nums"
rounded:
  lg: "0.5rem"
  xl: "0.75rem"
  2xl: "1rem"
  3xl: "1.5rem"
  full: "9999px"
spacing:
  1.5: "0.375rem"
  2: "0.5rem"
  3: "0.75rem"
  4: "1rem"
  5: "1.25rem"
  6: "1.5rem"
  8: "2rem"
  10: "2.5rem"
  14: "3.5rem"
  16: "4rem"
  20: "5rem"
components:
  button-primary:
    backgroundColor: "{colors.marca-600}"
    textColor: "{colors.neutral-0}"
    typography: "{typography.body-small}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.marca-700}"
    textColor: "{colors.neutral-0}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.marca-600}"
    typography: "{typography.body-small}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-outline-hover:
    backgroundColor: "{colors.marca-50}"
    textColor: "{colors.marca-600}"
  button-submit:
    backgroundColor: "{colors.marca-600}"
    textColor: "{colors.neutral-0}"
    typography: "{typography.body-small}"
    rounded: "{rounded.xl}"
    padding: "16px 24px"
  card:
    backgroundColor: "{colors.neutral-0}"
    textColor: "{colors.neutral-600}"
    rounded: "{rounded.2xl}"
    padding: "24px"
  chip:
    backgroundColor: "{colors.marca-50}"
    textColor: "{colors.marca-700}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  input:
    backgroundColor: "{colors.neutral-0}"
    textColor: "{colors.neutral-900}"
    typography: "{typography.body-small}"
    rounded: "{rounded.xl}"
    padding: "12px 16px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-700}"
    typography: "{typography.body-small}"
    padding: "0px"
  nav-link-hover:
    textColor: "{colors.marca-600}"
  data-strip-cell:
    backgroundColor: "{colors.neutral-0}"
    textColor: "{colors.marca-800}"
    typography: "{typography.figure}"
    padding: "32px 24px"
---

# Design System: SEGISPRO Ingeniería — Landing

## Overview

**Creative North Star: "The Field Dossier"**

This is the visual language of a technical report handed across a desk in Yopal: navy ink on white
paper, real figures set in tabular numerals, no ornament competing with the data. The buyer arrives
with a compliance obligation and minutes to spend, so every surface is built to be scanned — bordered
white cards on a near-white field, one navy accent doing all the work of emphasis, and a type ramp
that only has as many steps as the content needs. The system's confidence comes from the specificity
of what it shows (1.174 servicios, 315 empresas, 41 ciudades), not from styling applied on top.

The palette is unusually disciplined for a marketing site because it has to be: green and amber are
the brand's own colors but fail contrast as text on white (2,43:1 and 1,86:1), so they are restricted
to fill and graphic roles. That single constraint produced the house look — a monochrome navy system
with two colors held in reserve. Depth is carried almost entirely by hairline borders and a barely-there
shadow; the site reads flat and printed rather than layered and glassy.

The system is **mid-refactor**. Its quality bar lives in `/cobertura`, `/cobertura/[region]` and
`/trabaja-con-nosotros`: restrained navy-on-white, real data, no decoration. The home page and
`/servicios/[slug]` still carry an earlier, heavier vocabulary (gradient-filled cards, blurred color
orbs, glassmorphic panels, hover-scale on everything). Where this document names a standard, it names
the interior-page treatment; the home page's variants are recorded as what shipped, not as what to copy.

**Key Characteristics:**

- Navy-on-white monochrome; green and amber are fill-only, never body text on light surfaces
- Hairline `1px` neutral borders instead of shadow as the primary separator
- Fully-round pill buttons on content pages, `12px` radius on forms
- One typeface (Geist Variable), weights 400 / 500 / 600 / 700 only
- Figures in tabular numerals with tight tracking; the number is the biggest thing on the page
- Lucide line icons at a single stroke weight, `aria-hidden` unless labelled — no emoji anywhere in `src/`

## Colors

A single navy carries the entire interface; green and amber exist but are rationed to fill, graphic
and state roles because their brand-true steps do not pass contrast as text.

### The aliasing rule — read this before reading any markup

`src/app.css` redefines roughly seventy Tailwind palette steps to point at the brand ramps inside
`@theme`. **`blue-*` and `indigo-*` paint navy. `green-*`, `emerald-*`, `cyan-*` and `teal-*` paint
brand green. `orange-*` and `amber-*` paint brand amber. `sky-*` paints navy.** Verified live:
`bg-blue-600` computes to `rgb(53, 84, 122)` (`#35547a`, `marca-600`), and `text-blue-700` computes
to `rgb(42, 69, 102)` (`#2a4566`, `marca-700`). The markup lies; the stylesheet tells the truth. This
was a deliberate recolor of ~477 existing utility classes without touching the templates.

`gray-*` and `red-*` are **not** aliased — those remain Tailwind's own OKLCH neutrals and reds, which
is why the neutral scale in the frontmatter is recorded in OKLCH and the brand ramps in hex. Two
sources, two formats, both canonical to their own ramp.

### Primary

- **Marca Navy** (`marca-800`, `#223a54`): the brand navy, 11,66:1 on white. Reserved for the loudest
  true statements — the figures in the trajectory data strip, dark surface fills.
- **Working Navy** (`marca-600`, `#35547a`): 7,78:1 on white. The interactive navy: solid button fills,
  link hover, outline-button stroke and label, the bullet dot in list runs. This is the color the user
  actually touches.
- **Deep Navy Text** (`marca-700`, `#2a4566`): chip label text on `marca-50`, and the darker hover of
  a navy link.
- **Navy Tint** (`marca-50`, `#f3f6fa`): the chip and soft-CTA background, and the far stop of the
  page gradient wash.

### Secondary

- **Acento Green** (`acento-500`, `#00bf62`): brand green. **Fill and graphic only** on light surfaces.
- **Acento Green Text** (`acento-700`, `#008544`): 4,73:1 on white — the *only* green that may set text
  on a white surface.
- **Realce Amber** (`realce-400`, `#ffad2b`): brand amber. Fill and graphic only.
- **Realce Amber Text** (`realce-700`, `#b44e07`): 5,21:1 on white — the only amber that may set text.

### Neutral

- **Paper** (`#ffffff`): every card, panel, input and content surface.
- **Field** (`neutral-50` / `neutral-100`): the page wash under cards; appears as the mid stop of the
  light page gradient and as the sidebar-panel fill.
- **Hairline** (`neutral-200`): the default `1px` card and divider border. This is the workhorse of the
  whole depth model.
- **Field Stroke** (`neutral-300`): input borders and tertiary outline buttons.
- **Muted Text** (`neutral-500`): breadcrumb trail, city lists, timestamp-grade metadata.
- **Body Text** (`neutral-600`): all running prose. Not black.
- **Ink** (`neutral-900`): headings, `<dt>` terms, and the dark surface fill used by heroes and the footer.

### Tertiary

- **Danger** (`danger-700` on `danger-50` with a `danger-200` border): form error panels only. Per the
  brand commitment, red exists in this system **exclusively** as an error state — the old isotipo red
  is retired.

### Named Rules

**The Aliased Palette Rule.** Never read a color off the markup. `blue-600` in a template is navy
`#35547a`. New templates must use `marca-*`, `acento-*` and `realce-*` directly; the legacy names are a
migration shim, not a palette.

**The Fill-Only Rule.** Brand green and brand amber never set text on a white surface. If green or
amber must carry a word, it is `acento-700` or `realce-700` — no exceptions, including on hover.

**The One Navy Rule.** A screen gets one accent hue. Navy is it. Green and amber appear as at most one
graphic element per section, and never two accents in the same component.

## Typography

**Display Font:** Geist Variable (self-hosted via `@fontsource-variable/geist`, fallback
`ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`)
**Body Font:** Geist Variable — the same face, no second family anywhere
**Label/Mono Font:** none; numeric work is done by Geist's `tabular-nums` figures

**Character:** An engineering grotesque with even color and a neutral, slightly technical skeleton.
It was chosen for its tabular figures, because the page argues with counts. Self-hosting is
load-bearing: before it, the landing ran on the system UI font and changed face between macOS and
Windows, and a build-time subset means a Spanish reader downloads only the Latin range.

### Hierarchy

Verified against the running page at 1440px.

- **Display** (700, `3rem` / 48px, line-height 1): the page `h1`. The standard ramp is
  `1.875rem → 2.25rem (sm) → 3rem (lg)`.
- **Headline** (700, `1.875rem` / 30px, line-height 1.2): section `h2` on light surfaces; steps down to
  `1.5rem` at mobile.
- **Title** (700, `1.25rem` / 20px, line-height 1.4): card and article headings.
- **Body** (400, `1rem` / 26px at `leading-relaxed`): running prose, `neutral-600`. Lead paragraphs step
  up to `1.125rem` / 29,25px and are capped at `max-w-3xl` (~48rem).
- **Body Small** (400, `0.875rem`): the dominant text size in cards, lists, form fields and the footer.
  This system does most of its talking at 14px.
- **Label** (600, `0.75rem`, `0.025em` tracking, uppercase): `<dt>` terms in data strips and footer
  column headings only. Never as a standalone line above a heading.
- **Figure** (700, `3rem`, line-height 1, `-0.025em` tracking, `tabular-nums`, `marca-800`): the count
  in the trajectory data strip. Steps to `3.75rem` at `md`.

### Named Rules

**The Tabular Figure Rule.** Any number presented as evidence is set in `tabular-nums` with
`tracking-tight`, in `marca-800`, and marked up as the `<dd>` of a `<dl>` whose `<dt>` names it. Numbers
are data, not decoration.

**The Bare Lockup Rule.** A heading stands alone. No eyebrow or kicker line above it, no two-tone
split across an `h1`, no decorative rule beneath it. The heading and its supporting paragraph are the
entire lockup.

**The One Face Rule.** Geist Variable sets everything. There is no display/body pairing to honor and no
second family to introduce; hierarchy comes from size and weight alone.

## Layout

A centered single column: `container mx-auto` capped at `max-w-6xl` (72rem) for index pages and
`max-w-5xl` (64rem) for reading-and-form pages, with `px-4` rising to `px-6` at `sm`. Breakpoints are
Tailwind's defaults — `sm` 40rem, `md` 48rem, `lg` 64rem, `xl` 80rem.

Vertical rhythm runs on a 4px base in a small set of steps the build actually reuses: `py-14` (56px)
and `py-16` (64px) for section bands, `mt-16` (64px) between sibling sections inside a page, `p-6`
(24px) inside cards and `p-5` (20px) inside compact panels, `gap-6` (24px) between grid cards and
`gap-3` (12px) between list chips. Interior pages that begin under the fixed header open with
`pt-28` (112px) — the header is `fixed` and 68–76px tall, and this is the clearance it needs.

Card grids go `1 → md:2 → lg:3`; the footer goes `1 → md:4`; form fields go `1 → sm:2`. Long-form and
form pages use a `lg:grid-cols-3` split with the content at `lg:col-span-2` and a sticky-feeling
`aside` beside it.

### Named Rules

**The Header Clearance Rule.** The header is fixed. Any page whose first band is light must open with
`pt-28`; a page whose first band is a dark full-bleed hero uses `pt-20` on `main` and lets the hero
absorb the offset.

**The Measure Rule.** Prose is capped at `max-w-3xl`. A paragraph that runs the full 72rem container is
a bug.

## Elevation & Depth

This system is **near-flat and border-first**. Depth is communicated by a `1px` `neutral-200` hairline
and a change of surface tone, not by stacking shadows. The interior-page standard uses exactly one
shadow — Tailwind's `shadow-sm` on a resting card — which at 10% black over 1–3px reads as a printed
edge rather than a lift. Dark bands (heroes, footer) create depth by tonal inversion: `neutral-900`
ground with white headings and `neutral-300` body.

### Shadow Vocabulary

- **Card rest** (`box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`): the only
  resting shadow in the standard. Pairs with a `neutral-200` border, never replaces it.
- **Card hover** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`):
  applied together with `hover:-translate-y-1` and a border shift to `marca-300` over `300ms`.
- **Header** (`box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`): the fixed
  header's separation from scrolling content. This is the one structural shadow.

The home page additionally ships `shadow-xl` and `shadow-2xl` resting cards, `blur-3xl` color orbs and
`backdrop-blur` glass panels. Those are the pre-refactor vocabulary; they are recorded here as present
but are not the standard.

### Named Rules

**The Hairline-First Rule.** A surface is separated from its background by a `1px neutral-200` border
first. Shadow is additive and never stronger than `shadow-sm` at rest.

**The Motion-On-Response Rule.** Nothing animates at rest. Elevation and translation are responses to
hover or focus, they run at `duration-300` with the default ease, and they move at most `4px`.

## Shapes

Corners are generous and consistent: cards and panels at `1rem` (`rounded-2xl`), form controls and
small interactive blocks at `0.75rem` (`rounded-xl`), and anything that behaves like a tag, a pill
button or an avatar at `9999px` (`rounded-full`). `1.5rem` (`rounded-3xl`) appears only on full-bleed
media frames. There are no square corners in the content layer and no sharp-cornered buttons.

The recurring silhouette is a white rounded rectangle with a hairline border on a near-white field —
region cards, FAQ panels, service links, form cards and aside panels are all that same object at
different densities. Chips are the same silhouette collapsed to a pill.

Gradients are a surface device, not a component device: `bg-linear-to-br` filling an entire band
(a dark hero or a light page wash). The standard does not put a gradient inside a card or a button.

### Named Rules

**The Pill-or-Twelve Rule.** Navigational and CTA buttons are fully round (`rounded-full`); form submit
buttons and inputs are `rounded-xl` (12px) so they align with the fields above them. A button never
takes a card's `rounded-2xl`.

**The Band Gradient Rule.** A gradient may fill a full-width section band. It may not fill a card, a
button, an icon tile or a chip.

## Components

### Buttons

- **Shape:** fully round pill (`9999px`) in content contexts; `12px` for form submits.
- **Primary:** navy fill (`marca-600`) with white label, `0.875rem`/600, padding `12px 24px`
  (`8px 16px` for the compact header variant). No shadow at rest on the standard pages.
- **Hover / Focus:** background darkens to `marca-700` over `duration-300`; the standard does not scale
  the button.
- **Outline:** `2px` `marca-600` border, `marca-600` label, transparent fill, same padding; hover fills
  with `marca-50`.
- **Tertiary:** `2px` `neutral-300` border with `neutral-700` label, hover to `neutral-400` — used for
  the third choice in an error-page button row.
- **Disabled:** `opacity-60` plus `cursor-not-allowed`; color is unchanged.

### Chips

- **Style:** `marca-50` fill, `marca-700` label at `0.75rem`/500, fully round, padding `4px 10px`.
- **State:** presentational only. These tag sectors and regions; there is no selected/unselected state
  in the shipped build.

### Cards / Containers

- **Corner Style:** `1rem` (`rounded-2xl`); compact list links use `0.75rem`.
- **Background:** white on a `neutral-50`-to-`marca-50` gradient wash, or `neutral-50` for aside panels.
- **Shadow Strategy:** `shadow-sm` at rest, `shadow-lg` + `-4px` translate on hover (see Elevation).
- **Border:** `1px neutral-200`, shifting to `marca-300` on hover for interactive cards.
- **Internal Padding:** `24px` standard, `20px` compact, `32px` for a full-width CTA panel.

### Inputs / Fields

- **Style:** white fill, `1px neutral-300` border, `12px` radius, padding `12px 16px`, text at
  `0.875rem` `neutral-900`. Labels sit above at `0.875rem`/500 `neutral-900` with `6px` of space.
- **Focus:** border and ring both shift to `marca-500` (via `focus:border-blue-500 focus:ring-blue-500`,
  which the alias maps to navy). `@tailwindcss/forms` supplies the ring.
- **Error:** a panel above the form — `danger-50` fill, `1px danger-200` border, `danger-700` text,
  `0.75rem` radius — rather than per-field red styling.
- **File input:** the button slot is a `marca-600` fill with white `0.875rem`/600 label at `8px` radius.
- **Checkbox:** `1rem` square, `neutral-300` border, `marca-600` when checked.

### Navigation

- **Header:** `fixed`, full-bleed white, `shadow-md`, `z-50`. Logo at 128–144px wide left, links right.
- **Links:** `0.875rem`/500 `neutral-700`, color-only hover to `marca-600` over `duration-300`. Secondary
  links hide below `sm`; "Validar certificado" and the primary pill always stay.
- **Breadcrumb:** `0.875rem` `neutral-500` on light and `neutral-400` on dark, slash-separated, current
  page in `neutral-900` / white, wrapped in `<nav aria-label="Ruta de navegación">`.
- **Footer:** `neutral-900` ground, `neutral-300` body, four columns of `0.875rem` links with uppercase
  `0.75rem`/600 tracked column headings in white, closing on a `neutral-800` top rule and a `0.75rem`
  `neutral-400` copyright line. `neutral-400` and not `neutral-500` is deliberate: `neutral-500` on
  `neutral-900` gives 3,66:1 and fails AA at 12px.

### Icon System (`Icono.svelte`)

The signature primitive. Icons are addressed by **site concept**, not by drawing: `auditoria`,
`interventoria`, `seguridad-vial`, `normativa`. Each key resolves to a Lucide component imported deeply
(`lucide-svelte/icons/<name>`) to keep the 3MB barrel out of the bundle. One stroke weight, size and
color inherited from a passed `class`, `focusable="false"`, and `aria-hidden="true"` unless an
`etiqueta` is supplied — in which case it becomes `role="img"` with an `aria-label`. An unknown key
renders nothing rather than throwing. This component replaced a set of emoji stored in the data layer,
two of which had corrupted to U+FFFD; **there are zero emoji in `src/` and the system has no path back
to them.**

### Data Strip (trajectory figures)

A `<dl>` on a `gap-px` grid over a `neutral-200` ground so the cell gaps read as hairline rules, clipped
by `rounded-2xl`, `2 → lg:4` columns. Each cell is a white `32px 24px` block with a visually-hidden
`<dt>` naming the figure and a `<dd>` carrying the count at `3rem`/700 `marca-800` `tabular-nums`
`tracking-tight`, above a `0.875rem` `neutral-600` caption. It replaced four separately-gradiented stat
cards whose colors encoded nothing. This is the canonical way this system presents evidence.

## Do's and Don'ts

### Do:

- **Do** write new templates against `marca-*`, `acento-*` and `realce-*`. The `blue-*`/`green-*`/
  `orange-*` aliases exist to keep legacy markup on-brand, not to be extended.
- **Do** use `marca-600` for anything interactive and `marca-800` for figures and dark fills.
- **Do** separate surfaces with a `1px neutral-200` hairline before reaching for a shadow.
- **Do** set every evidence number in `tabular-nums` + `tracking-tight` inside a `<dl>`/`<dt>`/`<dd>`.
- **Do** cap prose at `max-w-3xl` and set body copy in `neutral-600` at 14–16px with `leading-relaxed`.
- **Do** open light interior pages with `pt-28` to clear the fixed header.
- **Do** route every icon through `Icono.svelte` with a concept key, and give it an `etiqueta` only when
  no adjacent text already names it.
- **Do** render `<PageHeader />` and `<PageFooter />` on every route. They are the shell; the shared
  footer also carries the internal link graph the site depends on.
- **Do** keep the h1 ramp at `text-3xl sm:text-4xl lg:text-5xl`.

### Don't:

- **Don't** set body or label text in `acento-500` or `realce-400` on a white surface. They fail AA
  (2,43:1 and 1,86:1). Use `acento-700` / `realce-700` when the word must be colored.
- **Don't** introduce red outside the error state. The old isotipo red is retired.
- **Don't** put a gradient inside a card, button, chip or icon tile. Gradients fill full-width bands.
- **Don't** stack `shadow-xl`/`shadow-2xl` on a resting surface, and don't add blurred color orbs
  (`blur-3xl` circles) or `backdrop-blur` glass panels to new work.
- **Don't** animate anything at rest — no `animate-pulse` on a CTA, no `hover:scale` on a button.
- **Don't** put a kicker, eyebrow, two-tone `<span>` or decorative rule in a heading lockup.
- **Don't** type a literal `→`, `·` or any pictographic character where the icon system should draw it.
- **Don't** add a second typeface or a weight outside 400 / 500 / 600 / 700.
- **Don't** hand-roll a page-level `<footer>`; import `PageFooter`.
- **Don't** invent testimonials, review stars, price tables or trust badges — there is no evidence
  behind them and the system has no component for them.

---

## Shipped inconsistencies (recorded, not resolved)

This section documents divergence between coexisting treatments. It is descriptive. Where a standard is
named, it is the interior-page treatment, because that is the bar the refactor is converging on.

| Divergence | Shipped reality | Standard, and why |
| --- | --- | --- |
| Page shell | `/cobertura`, `/cobertura/[region]`, `/trabaja-con-nosotros` and `+error` import `PageHeader` + `PageFooter`. The home page inlines its own header and a 200-line decorative `<footer>`. `/servicios/[slug]`, `/validar-certificado`, `/politicas-de-privacidad` and `/ingreso` render **neither**. | `PageHeader` + `PageFooter`. The shared footer carries the internal link graph to services and coverage; a route without it is a dead end for both users and crawlers. |
| `h1` ramp | Three ramps coexist: `3xl→4xl→5xl` (coverage, region, careers), `4xl→5xl→6xl` (service detail, certificate validation, privacy), `2xl→3xl→4xl→5xl` (home). | `text-3xl sm:text-4xl lg:text-5xl`. It is the ramp used by the quality-bar pages and it lands at 48px on desktop, matching the data-strip figure so the page has one top size. |
| Dark surface color | The dark heroes and both footers fill with `gray-900 → gray-800 → black`, i.e. Tailwind's neutral `oklch(21% 0.034 264.665)` — **not** brand navy. `marca-800` is only used on the data-strip figures. | Unresolved drift, not a rule. A dark band that is meant to read as brand should fill with `marca-800`/`marca-900`; the current near-black is a leftover the aliasing did not reach, since `gray-*` was deliberately left unaliased. |
| Brand token adoption | Direct uses of `marca-*`/`acento-*`/`realce-*` in `src/`: four. Everything else paints through the legacy aliases. | New templates use brand names directly. The alias layer is a migration shim with a finite life. |
| Card vocabulary | Interior pages: white, `shadow-sm`, hairline border. Home and `/servicios/[slug]`: gradient-filled icon tiles, `shadow-xl`/`2xl`, `hover:-translate-y-3`, `hover:scale-105`, `animate-pulse`, `backdrop-blur` panels, `blur-3xl` orbs. | The interior-page card. The heavy vocabulary predates the refactor. |

**Not canonized.** Five defects the build carries are deliberately excluded from the rules above and
must not be inherited: (1) the `/cobertura` `h1` still splits into a two-tone `<span class="text-blue-600">`,
which the Bare Lockup Rule forbids; (2) literal `→` and `·` glyphs are typed into link and list text on
`/cobertura` and `/cobertura/[region]` where `Icono.svelte` exists to draw them; (3) the home page's
`animate-pulse` CTA and `blur-3xl` decorative orbs are resting animation and pure ornament; (4) the
dark heroes' neutral `gray-900` fill is recorded as drift rather than promoted to a "dark surface"
token, because legitimizing it would write a near-black into a navy brand system; (5) three routes ship
without the header/footer shell. None of these earned a place in the system by being present — a value
earns its place by being reused deliberately and by being legible, and these are neither.
