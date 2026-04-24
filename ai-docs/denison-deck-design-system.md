# Denison University — Deck Design System (Red-Dominant)

> A reference extracted from `denison.edu`, the official brand portal (`brand.denison.edu`), and the public `denisonbrand` package. **Tuned for red-background decks** — Big Red is the identity, so most slides run red full-bleed with white (and select accent) text on top. This inverts the typical institutional use of red-as-accent.
>
> **Sources**
> - `brand.denison.edu` — public brand portal (Lingo), sections: Logos, Co-Brand Logos, Brand Elements, Branded Templates, Photography, Style Guide, Athletics
> - `denison.edu/campus/university-communications/logos-and-branding` — official standards page
> - `github.com/apsteinmetz/denisonbrand` — open-source package mirroring the post-refresh palette and font system
> - `denison.edu` homepage and feature pages — live voice, layout, and imagery patterns
>
> **For authoritative downloads (logos, templates, photography)**, always point users to `brand.denison.edu`. Logo files require permission; the brand portal enforces a download-request gate.

---

## 1. Brand character (for voice/layout decisions)

Denison is a **top liberal arts college** in Granville, Ohio. Post-refresh, the brand pairs an **editorial, scholarly** feel (classical serifs, measured white space, full-bleed photography) with **confident, punchy** moments (Big Red, crimson accents, strong stat callouts).

**Tone**: warm, intelligent, action-oriented. Homepage voice samples:
- "Unlock Your Potential"
- "Denison delivers a life-shaping education that propels students into successful lives and careers."
- "A Top-Tier Education" · "Prepared for Life" · "Life on the Hill"
- Reference nicknames: **The Hill**, **Big Red**

**Recurring rhetorical pattern**: short declarative headline → one-sentence promise → 2–3 stat callouts with bold numbers. Example:
> **A Top-Tier Education**
> Small classes. Innovative majors. World-class faculty who know you by name.
> **65+** academic programs · **2,400** undergraduates · **9:1** student-to-faculty ratio

Use this pattern on section openers and stat slides.

---

## 2. Color system

Denison uses a **three-tier palette**: one primary triad, and three parallel secondary rows (bright / dark / neutral) so designers can tune the emotional temperature of a deck without leaving brand.

### 2.1 Primary palette

| Name | Hex | RGB | Pantone | Role |
|---|---|---|---|---|
| **Denison Red** | `#C72030` | 199, 32, 48 | — | Institutional primary. Use sparingly — accents, rules, key stat numbers, title-slide band. |
| **Gradcap Black** | `#000000` | 0, 0, 0 | PMS Black 6 C | Primary text color on light backgrounds. |
| **White** | `#FFFFFF` | 255, 255, 255 | PMS 7436 C | Primary background; text color on dark/photo backgrounds. |

> ⚠️ **Two reds exist.** `#C72030` is the **institutional/academic** brand red from the post-refresh identity. Denison **Athletics ("Big Red")** uses a brighter `#E51636` (PMS 1788 C). For academic/institutional decks use `#C72030`. Only switch to `#E51636` for athletics-specific content.

### 2.2 Secondary — Bright row (energetic, forward)

Use on student-life, admissions, and storytelling slides. Pair any **one** bright accent with the primaries; avoid using two brights at the same weight on a single slide.

| Name | Hex | RGB |
|---|---|---|
| Brick Bright Red | `#C66E4E` | 198, 110, 78 |
| Granville Bright Blue | `#41748D` | 65, 116, 141 |
| Hillside Bright Green | `#89A84F` | 137, 168, 79 |
| Tassel Bright Gold | `#FFC72C` | 255, 199, 44 |
| Stone Bright Grey | `#D2D1D1` | 210, 209, 209 |

### 2.3 Secondary — Dark row (scholarly, formal)

Best for academic content, research, finance, governance decks. Safe as large text or as section-title backgrounds.

| Name | Hex | RGB |
|---|---|---|
| Brick Dark Red | `#9E1A1D` | 158, 26, 29 |
| Granville Dark Blue | `#405362` | 64, 83, 98 |
| Hillside Dark Green | `#4A6A1D` | 74, 106, 29 |
| Tassel Dark Gold | `#EAAA00` | 234, 170, 0 |
| Stone Dark Grey | `#4B4F54` | 75, 79, 84 |
| Moroccan Blue | `#0E586E` | 14, 88, 110 |

### 2.4 Secondary — Neutral row (backgrounds, tints)

Use for slide backgrounds, subtle fills, tables, and low-contrast infographic elements. These are **the** correct backgrounds when `#FFFFFF` feels too clinical.

| Name | Hex | RGB |
|---|---|---|
| Brass Metallic | `#B0986E` | 176, 152, 110 |
| Neutral Blue | `#D1DDE6` | 209, 221, 230 |
| Neutral Hillside Green | `#D0D1AB` | 208, 209, 171 |
| Neutral Tassel Gold | `#F5E1A4` | 245, 225, 164 |
| Neutral Cool Gray | `#F0EDEB` | 240, 237, 235 |
| Neutral Warm Stone | `#DFD6C5` | 223, 214, 197 |

### 2.5 Red as the foundation — text and accent colors that work on red

Default slide background is **Denison Red `#C72030`** (or Athletics `#E51636` if you want a punchier, brighter feel — pick one per deck and stay consistent). Everything else is a foreground decision.

**Text colors on red** (ranked by utility):

| Color | Hex | Best use on red |
|---|---|---|
| **White** | `#FFFFFF` | Default for headlines, body copy, stat numbers. Max contrast. |
| **Tassel Bright Gold** | `#FFC72C` | Classic collegiate pop. Use for emphasis words, stat numbers, key callouts. |
| **Neutral Warm Stone** | `#DFD6C5` | Softer than white — editorial cream for long body copy or pull quotes. |
| **Neutral Tassel Gold** | `#F5E1A4` | Muted gold for secondary text, captions, sub-labels. |
| **Neutral Cool Gray** | `#F0EDEB` | Off-white alternative when pure white feels too harsh. |
| **Gradcap Black** | `#000000` | ❌ Avoid as text on red — contrast is too low. |

**Accent / element colors on red** (for rules, underlines, icon fills, chart bars):

- **Tassel Bright Gold `#FFC72C`** — the high-contrast partner to red. Use for stat numbers, section rules, underline accents.
- **White `#FFFFFF`** — for thin rules, iconography, divider lines.
- **Brick Dark Red `#9E1A1D`** — tonal. Use for soft shapes/blocks on red when you want depth without leaving the red family.
- **Neutral Warm Stone `#DFD6C5`** — cream-colored text boxes and content wells that sit on red without fighting it.

**Slide-to-slide pacing**: Not every slide needs to be pure red. Give the eye a break with occasional **Neutral Warm Stone `#DFD6C5`** or **White** slides (roughly every 4–6 slides) so the red retains impact. Think "red is the home base, neutrals are the pause."

**Avoid on red backgrounds**:
- Black text (too low contrast — looks muddy).
- Hillside Green `#89A84F` / `#4A6A1D` as large elements (red-green clash).
- Granville Blue as large fills (blue-on-red vibrates; OK as small icon accents).
- Gradients between red and any other brand color.
- Photos dropped directly on red with no border/frame — add a thin white or gold rule to separate.

---

## 3. Typography

Denison's official families are **proprietary Adobe fonts**. Two deck-ready paths below: (A) "on network" using the real families via Adobe Fonts / Creative Cloud, and (B) "portable" substitutes that keep the feel when Adobe Fonts aren't available (useful for Google Slides, Keynote sharing, and AI-generated slides rendered with web fonts).

### 3.1 Official font system

| Role | Official Font | Adobe-sanctioned Alt | Free/Google Substitute |
|---|---|---|---|
| Display (editorial serif) | **Caslon Graphique** | Lora | **Lora** |
| Display (condensed sans) | **DINOT** | Oswald | **Oswald** |
| Display (traditional serif) | **High Tower** | Georgia | **Crimson Pro** |
| Body (text serif) | **Caslon** | Georgia | **Libre Caslon Text** |
| Body (text sans) | **FreightSans** | Trebuchet | **Open Sans** |

### 3.2 Type roles in a deck

- **Title / cover headline** → Caslon Graphique (or Lora), large, tight tracking. Mix case, not all caps.
- **Section dividers / eyebrow labels** → DINOT (or Oswald), all caps, wide tracking (100–150).
- **Section headers** → High Tower (or Crimson Pro / Georgia), title case.
- **Body copy** → FreightSans (or Open Sans), 18–24pt on slides.
- **Stat numbers** → Caslon Graphique (or Lora), display-sized (72–120pt). Denison's visual signature is a **large serif number paired with a small sans label**.
- **Captions / sources** → FreightSans Italic (or Open Sans Italic), 12–14pt, Stone Dark Grey.

### 3.3 Type pairings (copy into an AI prompt)

```
HEADLINE:   Lora (or Caslon Graphique),    semibold,  48–60pt,  color: #000000
EYEBROW:    Oswald (or DINOT),             regular,   14pt CAPS, color: #C72030
BODY:       Open Sans (or FreightSans),    regular,   20pt,      color: #000000
STAT NUMBER: Lora (or Caslon Graphique),   regular,   96pt,      color: #C72030
STAT LABEL:  Oswald (or DINOT),            medium,    14pt CAPS, color: #4B4F54
CAPTION:    Open Sans Italic,              regular,   12pt,      color: #4B4F54
```

---

## 4. Slide layout patterns (red-dominant)

Assume every slide below has **Denison Red `#C72030`** as its full-bleed background unless noted. Patterns are tuned for AI-generated decks.

### 4.1 Hero / cover

- Full-bleed red background.
- Large serif headline in **white**, centered or left-aligned.
- One word of the headline in **Tassel Bright Gold `#FFC72C`** for emphasis (Denison's signature move — see homepage "**Unlock Your Potential**" treatment).
- Small Oswald/DINOT eyebrow label in white, all caps, above the headline: section, date, or "Denison University".
- Logo (white version) top-left or bottom-right.
- Optional: thin gold rule (2–4pt) near the bottom as a horizontal anchor.

### 4.2 Section divider

Two options:

**(a) Deeper red** — full-bleed **Brick Dark Red `#9E1A1D`**, huge serif section number in white or gold, one-line description in white sans. Used to signal "new chapter."

**(b) Cream pause** — full-bleed **Neutral Warm Stone `#DFD6C5`**, large serif section title in **Denison Red `#C72030`**, thin red rule beneath. Breaks the red streak and gives the eye air.

### 4.3 Stat slide

- Red background.
- 2–3 statistics in a row, evenly spaced.
- Each stat = **giant serif number in Tassel Bright Gold `#FFC72C`** (96–120pt) + tiny all-caps sans label beneath in **white** (14pt, wide tracking).
- Optional single supporting sentence in white body type at the bottom.
- This is the highest-impact slide in the Denison system — use it for the "wow" moments.

### 4.4 Content slide (text + image)

- Red background.
- Photo placed in a **cream-colored frame** (Neutral Warm Stone `#DFD6C5`) or a white card with ~16–24px padding — do not drop photos directly on red.
- Text right (or left) in white. Max 5 lines of body copy.
- Pull quotes: **Neutral Warm Stone `#DFD6C5`** italic serif, indented, with a thin gold vertical rule to the left.

### 4.5 Data / chart slide

- Red background.
- Chart container is a **cream or white card** (Neutral Warm Stone or White) with inner padding — charts don't render well directly on red.
- Inside the card: Gradcap Black axis labels, standard chart colors using the Dark row palette.
- Title above the card, outside it, in **white Caslon Graphique/Lora**.
- One data point highlighted in **Denison Red `#C72030`** inside the card, tying the chart back to the deck theme.
- Source line at bottom of the slide in **Neutral Warm Stone** italic.

### 4.6 Quote / testimonial slide

- Red background.
- Huge serif quote in **white** (or **Neutral Warm Stone** for a softer feel), centered, with oversized opening and closing quotation marks in **Tassel Bright Gold**.
- Attribution in small Oswald/DINOT caps, white, beneath.

### 4.7 Closing slide

- Red background (mirror the cover).
- CTA headline in white Caslon Graphique ("Let's talk.", "Questions?", "Ready to join us?").
- Contact info in white FreightSans/Open Sans.
- Logo + `denison.edu` in white, bottom of slide.
- Optional gold rule to echo the cover.

---

## 5. Imagery direction

From the homepage gallery, Denison's photography leans:

- **Editorial, documentary-style campus life** — students in labs, on the quad, at the library, in studios.
- **Environmental portraits** of professors with students (faculty named, in context).
- **Action in progress** — a student adjusting a camera, mid-experiment, mid-performance, mid-lift — almost never static posed shots.
- **Warm, natural light**. Autumn tones (Chapel Walk through fall leaves) are iconic.
- **Seasonal cues**: fall foliage, spring quad, sunrise over campus.

**Do**
- Use full-bleed. Avoid small framed photos with heavy margins.
- Favor medium-close and wide environmental shots over extreme close-ups.
- Keep people looking engaged with *something* (an instrument, a peer, a screen) — not at the camera.

**Avoid**
- Stock photography. Denison's brand depends on recognizable campus/people imagery.
- Heavy filters, duotones (unless the Branded Templates kit explicitly provides one), or desaturation to grey.
- Photos of buildings alone with no human presence, unless it's a landmark (Swasey Chapel, Doane Hall).

---

## 6. Logo usage (presentation decks)

- Use the **primary institutional logo** (Denison wordmark) from `brand.denison.edu`. Don't redraw, recolor, or rebuild it.
- Minimum clear space: roughly the height of the "D" on all sides.
- Don't place the logo on a busy part of a photograph — use a neutral area or add a subtle white/dark band.
- The **Block D** and **Presidential Seal** are restricted — use only when explicitly approved.
- **Co-branded logos** (department/unit lockups) require permission and live in the Co-Brand Logos kit.

---

## 7. Official presentation templates

The **Branded Templates** kit on `brand.denison.edu` contains official presentation and letterhead files. For any formal Denison-audience deck, start from those templates rather than generating from scratch. Use this design-system doc as a supplement and as the source of truth when you're generating slides programmatically (Figma, HTML/React, python-pptx, etc.).

---

## 8. Ready-to-use AI prompt block

Paste this at the top of any AI deck-generation prompt to constrain output to red-dominant Denison decks:

```
You are designing slides for Denison University. Big Red is the identity:
RED IS THE BACKGROUND, not an accent. Follow this design system strictly.

FOUNDATION:
- Default slide background: Denison Red #C72030  (or Athletics Red #E51636 —
  pick ONE per deck and stay consistent).
- Default text color: White #FFFFFF.
- Signature accent: Tassel Bright Gold #FFC72C — use for emphasis words,
  stat numbers, thin rules, oversized quotation marks.

TEXT ON RED (in order of preference):
- White #FFFFFF       — default for headlines, body, stats.
- Tassel Gold #FFC72C — emphasis words, hero numbers, callouts.
- Warm Stone #DFD6C5  — softer cream for long body or pull quotes.
- Neutral Gold #F5E1A4 — captions, sub-labels.
- NEVER use black text on red. Contrast is too low.

PACING:
- Every 4–6 slides, insert a "cream pause" slide: Neutral Warm Stone
  #DFD6C5 background with Denison Red #C72030 serif headline. This
  keeps the red from losing impact.
- Section dividers can also use a deeper red (Brick Dark Red #9E1A1D)
  as full-bleed background for a tonal shift.

PHOTOS AND CHARTS:
- Never place photos or charts directly on red. Wrap them in a
  cream (#DFD6C5) or white (#FFFFFF) card with internal padding.
- Inside a chart card, one data point is highlighted in Denison Red.

TYPOGRAPHY (Google font fallbacks shown; Adobe originals in parens):
- Headlines / stat numbers: Lora (Caslon Graphique), serif, semibold, large.
- Eyebrow labels, axis labels: Oswald (DINOT), all caps, wide tracking.
- Section headers: Crimson Pro (High Tower), title case.
- Body, captions: Open Sans (FreightSans).

LAYOUT RULES:
- Cover: red background, huge white serif headline, ONE word in gold.
- Stat slides: red background, giant gold serif numbers, tiny white caps labels.
- Quote slides: red background, large white (or cream) serif quote, gold
  oversized quotation marks.
- Closing: mirror cover. White headline + contact info on red.
- One accent color per slide. Never bright-on-bright. Never green on red.

TONE:
- Warm, scholarly, confident. Short declarative headlines.
- Pattern: headline → one-sentence promise → 2–3 stat callouts.
- Use Denison vocabulary where natural: "The Hill", "Big Red",
  "life-shaping education".

LOGO:
- Always use the white version of the institutional wordmark on red.
- Never recolor, redraw, or distort.
- Block D and Presidential Seal are restricted — skip unless explicitly approved.
```

---

## 9. Quick reference — CSS variables

For HTML/React-based deck generators:

```css
:root {
  /* Primary */
  --denison-red:        #C72030;
  --denison-black:      #000000;
  --denison-white:      #FFFFFF;

  /* Athletics (use only for athletics-themed decks) */
  --denison-athletics-red: #E51636;

  /* Dark */
  --brick-dark:         #9E1A1D;
  --granville-dark:     #405362;
  --hillside-dark:      #4A6A1D;
  --tassel-dark:        #EAAA00;
  --stone-dark:         #4B4F54;
  --moroccan-blue:      #0E586E;

  /* Bright */
  --brick-bright:       #C66E4E;
  --granville-bright:   #41748D;
  --hillside-bright:    #89A84F;
  --tassel-bright:      #FFC72C;
  --stone-bright:       #D2D1D1;

  /* Neutral */
  --brass:              #B0986E;
  --neutral-blue:       #D1DDE6;
  --neutral-hillside:   #D0D1AB;
  --neutral-tassel:     #F5E1A4;
  --neutral-cool:       #F0EDEB;
  --neutral-warm-stone: #DFD6C5;

  /* Fonts (Google fallbacks) */
  --font-display:  'Lora', 'Caslon Graphique', Georgia, serif;
  --font-section:  'Crimson Pro', 'High Tower', Georgia, serif;
  --font-eyebrow:  'Oswald', 'DINOT', 'Arial Narrow', sans-serif;
  --font-body:     'Open Sans', 'FreightSans', 'Trebuchet MS', sans-serif;
}
```

---

## 10. Caveats

- This doc is tuned for **red-dominant decks** — a deliberate choice that leans into "Big Red" as identity. Denison's institutional templates typically use red as an accent over white/neutral backgrounds, so decks built from this guide will look bolder and more branded than the official templates. For formal audiences (board, donors), consider alternating your red-dominant slides with the institutional cream-on-white style, or start from the official Branded Templates on `brand.denison.edu`.
- Denison's official PDF brand guidelines and the Branded Templates live behind the brand portal; only staff/affiliates with credentials can download source files (logos especially). This document captures the **visible, public** layer — sufficient to produce on-brand slides, but for formal institutional use you should still route final decks through University Communications & Marketing (`ucomm@denison.edu`).
- Pick **one red per deck** and stay with it. Institutional `#C72030` reads more scholarly; Athletics `#E51636` reads brighter and more energetic. Don't mix.
- Font substitutes (Lora / Oswald / Crimson Pro / Open Sans) mirror the official families in weight, proportion, and feel, but are not visually identical. Use the Adobe originals when a deck will be shown to alumni/donors or other brand-sensitive audiences.
