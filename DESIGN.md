---
name: NASA APOD Explorer
description: A field-edition star atlas where each day's picture is a chart plate and everything else is margin notation.
colors:
  ink: "#0a0a0b"
  ink-2: "#131315"
  star: "#f2f0ea"
  copy: "#d9d6ce"
  muted: "#a19f98"
  faint: "#85837d"
  line: "#2a2a2e"
  line-strong: "#66666d"
  red: "#ff5a47"
typography:
  display:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(2.5rem, 1.6rem + 3vw, 5rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(2.25rem, 1.4rem + 2.2vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: 1.25
  reading:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.7
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  notation:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: "1.25rem"
    letterSpacing: "0.14em"
    fontFeature: "'tnum'"
    fontVariation: "'wdth' 112"
rounded:
  none: "0px"
spacing:
  gutter-sm: "16px"
  gutter-md: "24px"
  gutter-lg: "40px"
  column-gap: "40px"
  margin-offset: "32px"
  plate-inset: "12px"
  section: "40px"
  section-lg: "64px"
  touch: "48px"
components:
  control:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.star}"
    typography: "{typography.notation}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "{spacing.touch}"
  control-icon:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.star}"
    rounded: "{rounded.none}"
    padding: "0"
    width: "{spacing.touch}"
    height: "{spacing.touch}"
  control-disabled:
    textColor: "{colors.faint}"
  notation-link:
    textColor: "{colors.muted}"
    typography: "{typography.notation}"
    height: "{spacing.touch}"
  notation-link-hover:
    textColor: "{colors.star}"
  nav-item:
    textColor: "{colors.muted}"
    typography: "{typography.notation}"
    padding: "0 16px"
    height: "{spacing.touch}"
  nav-item-current:
    textColor: "{colors.star}"
  plate:
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.plate-inset}"
  plate-empty:
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "48px 24px"
  ruler-thumb:
    backgroundColor: "{colors.red}"
    rounded: "{rounded.none}"
    width: "3px"
    height: "36px"
  share-popover:
    backgroundColor: "{colors.ink-2}"
    textColor: "{colors.star}"
    typography: "{typography.notation}"
    rounded: "{rounded.none}"
    width: "256px"
  archive-day-cell:
    textColor: "{colors.copy}"
    padding: "12px"
---

# Design System: NASA APOD Explorer

## Overview

**Creative North Star: "Atlas de campo"**

A field-edition star atlas: printed black ground, starlight-white plates, graticule hairlines and a single red-light accent of the kind observers use to read charts at night without losing dark adaptation. Each day is a chart plate. The picture is the plate, whole and uncropped, inside a graduated neat-line; everything else (date, day count, title, credit, actions) is margin notation set beside it.

Density is low and the hierarchy is carried by two voices rather than by boxes: a book serif for NASA's words and the page titles, spaced sans caps with tabular figures for the atlas's own notation. Structure is drawn with 1px lines and tick marks, never with fills, radii or shadows. Motion is optical: a picture arrives as a blurred low-resolution plate and pulls into focus. The world rejects the sci-fi HUD dashboard and the stock dark photo gallery.

**Key Characteristics:**
- Ink-black ground (#0a0a0b), one warm off-white for type that matters, four stepped greys for everything else.
- One accent, red, drawn as a 2px line, a 3px thumb or a glyph, never as a fill.
- Square corners everywhere; frames are 1px neat-lines with graduated tick bands.
- Serif titles and captions against Archivo spaced caps with tabular figures.
- Focus pull (blur to sharp) as the signature motion; reduced motion removes it.

## Colors

A near-monochrome ink-and-starlight palette with one red-light accent held back for position and focus.

### Primary
- **Red Light** (red): the observer's red torch. It marks where you are and what has focus: the current day in the archive, the 2px underline under the current nav item and current language, the date ruler's thumb, every focus ring (2px, 3px offset), the skip link, text selection, the center point of the finder-reticle mark, the orrery station being pointed at, and the copied-link tick in the share menu. 6.4:1 on ink.

### Neutral
- **Printed Ink** (ink): page ground, plate field, empty plates, the mobile day bar. Every contrast figure is measured against it.
- **Ink Wash** (ink-2): the one raised surface (share popover) and placeholder squares for archive thumbnails still loading.
- **Starlight** (star): titles, current nav item, control labels, link text. 17.4:1.
- **Caption Paper** (copy): reading text (explanations, about copy) and credits. 13.6:1.
- **Notation Grey** (muted): secondary notation, inactive nav, section labels, secondary links, major ticks. 7.5:1.
- **Faint Notation** (faint): tertiary notation (plate code, day count, ruler numerals, loading and "no picture" states, disabled controls). 5.2:1, the floor for any text.
- **Graticule** (line): hairline dividers, the image outline, archive grid, the inner neat-line of a plate. 1.4:1; structure only.
- **Graticule Strong** (line-strong): control borders, the outer plate neat-line, minor ticks, dashed empty-plate borders, the ruler track. 3.5:1; borders only.

### Named Rules
**The Red Light Rule.** Red marks position and focus only. It never fills an error, an empty state, a surface, or a control at rest; the largest red shapes in the system are a 3px ruler thumb and a 2px underline (the focus-only skip link is the one filled exception).

**The Drawn Error Rule.** Errors and missing days are dashed empty plates (1px dashed line-strong, same footprint as a plate) with a serif title, muted body and outline controls. No red text, red borders or red icons in any error.

**The Hairline Is Not Type Rule.** Graticule and Graticule Strong draw borders and ticks, never text. Faint (5.2:1) is the lowest-contrast colour allowed for type.

## Typography

**Display Font:** Source Serif 4 (with Georgia, serif), variable weight 200-900 with optical sizes 8-60 applied automatically
**Body Font:** Archivo (with system-ui, sans-serif), variable weight 100-900 and width 62-125
**Label/Mono Font:** Archivo notation (width 112, spaced caps, tabular figures)

**Character:** A bookish serif that lets NASA's titles and captions read like a printed atlas, against a slightly expanded grotesque in spaced caps that reads like the scale and legend in a chart margin.

### Hierarchy
- **Display** (400, clamp(2.5rem, 1.6rem + 3vw, 5rem), 1): page titles for the archive month and about.
- **Headline** (400, clamp(2.25rem, 1.4rem + 2.2vw, 4rem), 1.04): the day's picture title in the margin, always `lang="en"`.
- **Title** (400, 1.875-2.25rem, 1.25): empty-plate titles and the orrery section heading; orrery station names at 1.5rem.
- **Reading** (400, 1.125rem rising to 1.1875rem at desktop, 1.7): NASA explanations and about copy, max 66ch, in copy.
- **Body** (Archivo 400, 1rem, 1.5): credits, empty-plate bodies, orrery descriptions; 0.875rem for the footer disclaimer.
- **Notation** (Archivo 500, 0.8125rem / 1.25rem, 0.14em, uppercase, width 112, tabular figures): dates, day counts, plate codes, section labels, nav, controls, links, ruler numerals, status lines.

### Named Rules
**The Two Voices Rule.** Serif speaks words (NASA's titles and captions, page titles, empty-plate titles). Archivo notation speaks the atlas (dates, counts, codes, labels, controls). Headings are never set in notation caps and notation is never set in the serif.

**The Tabular Figures Rule.** Every number in notation uses tabular figures so dates, counts and ruler numerals align like a printed scale.

## Layout

A 12-column grid inside a 90rem container with 16px, 24px and 40px gutters (phone, tablet, desktop) and a 40px column gap. On the day view the plate spans columns 1-8 and the margin notation columns 9-12; the plate column and the label column of reading sections carry a 32px left offset, which is where the plate code runs vertically up the plate's left edge. The date ruler sits full width under the plate between previous and next, and the date field and random control sit under the margin.

The plate's height is set by the viewport, not the media: clamp(26rem, 100svh minus the 56px header minus 10.5rem, 56rem) on desktop so plate and ruler share the first viewport; on phones the plate is square, capped at 70svh. Phones stack in reading order: plate, ruler, notation, explanation, with previous, date field, next and random in a sticky bottom bar. The header becomes two rows on phones (wordmark and language select, then a three-column nav).

Reading sections (explanation, about blocks) are divided by hairline top borders, a notation label in columns 1-3 and serif text in columns 4-10, with 40px vertical rhythm rising to 64px on desktop. The archive is a Monday-first seven-column calendar drawn as a hairline grid at 768px and up, and a list of rows below it. Every interactive target is at least 48px tall.

**The Plate And Margin Rule.** The picture owns the left two-thirds and everything written about it lives in the margin beside it; nothing overlays the picture except the transient loading and scrub states.

## Elevation & Depth

Flat. Depth is drawn with lines: an outer neat-line, a graduated tick band and an inner neat-line on every plate, hairline dividers between regions. The only cast shadow in the system is on the share popover, a soft dark drop that separates it from the ink ground; the ruler thumb's 5px ink ring is a knockout, not elevation. Blur appears only as an optical state of pictures (focus pull and scrub preview), never on surfaces.

### Shadow Vocabulary
- **Popover lift** (`box-shadow: 0 12px 32px rgba(0,0,0,0.6)`): the share menu only.

### Named Rules
**The Neat-Line Rule.** Separate things with a 1px line, never with a fill change, radius or shadow. A new container is a frame, not a card.

## Shapes

Every corner is square (0px): controls, plates, popovers, thumbnails, the ruler thumb. Borders are 1px solid (line or line-strong), or 1px dashed line-strong for an empty plate. The plate's tick band is drawn with background gradients: minor ticks 4px long every 8px in line-strong, major ticks 9px long every 64px in muted, on all four edges. The brand mark is a finder reticle: a 1px circle with four cardinal ticks and a red center point, reused in the favicon (whose tile is the platform's rounded icon square, not a UI radius).

**The Uncropped Plate Rule.** The plate has a fixed size that never depends on the media. The picture is contained, never cropped, and carries a 1px graticule outline on its own rendered box so the line traces the picture's real edge rather than the letterbox. Only archive index thumbnails crop, as square cells.

## Components

### Buttons
Quiet outline controls in the notation voice; the atlas has no filled buttons.
- **Shape:** square (0px), 1px line-strong border, transparent on ink, min 48px tall.
- **Primary:** there is no primary fill. A text control is notation in starlight, 12px horizontal padding rising to 16px; icon controls (previous, next, random on phones) are 48px squares.
- **Hover / Focus:** border shifts to starlight over 200ms; focus is the global 2px red outline at 3px offset.
- **Disabled:** graticule border, faint text, not-allowed cursor.

### Inputs / Fields
- **Style:** the date field and the archive month and year selects are native inputs wrapped in the control frame, starlight notation, transparent background, custom chevron in muted for selects.
- **Focus:** the frame's border turns starlight while the field has focus; caret and native accent are red.

### Navigation
- **Style:** notation links, muted at rest, starlight on hover. The current item is starlight with a 2px red underline inset along the bottom edge of its 48px target. The language switch (ES EN PT) uses the same treatment with `aria-pressed`; phones get a native select showing the short code.
- **Header:** 56px tall, hairline bottom border, finder-reticle mark and wordmark in notation on the left.

### Plate (signature)
The chart plate frames every day picture: outer line-strong neat-line, 12px graduated tick band, inner graticule neat-line around an ink field. Loading shows a faint notation status centred in the field. The focus pull resolves each picture: a blurred, slightly enlarged archive thumbnail at 70% opacity sits under the field while the full image fades in from 10px blur to sharp over 700ms on cubic-bezier(0.16, 1, 0.3, 1). Non-image days show a muted note and an outline control to the official page.

### Empty Plate
Same footprint as the plate, 1px dashed line-strong, centred serif title, muted body at max 28rem, outline controls below (retry, previous day, today, official page). Used for API errors, missing days, invalid months and not-found.

### Date Ruler (signature)
A native range input graduated by day across the shown month: a line-strong track, a muted tick for every day, and taller muted major ticks with faint numerals beneath. The thumb is a 3px by 36px red bar knocked out of the ticks by a 5px ink ring. A starlight notation readout rides above the thumb with the date, plus the day's serif title in muted when the month is cached. Dragging dims the current picture to 30% and lays that day's blurred thumbnail over the plate; releasing travels there.

**The Numbered Tick Rule.** A major tick is drawn only where a numeral sits: every fifth day, plus the first and last day when no fifth day is within two days of them.

### Day Margin
Date in muted notation, day count and (on phones) plate code in faint notation, the headline title, credit with a faint notation label, then actions, and on today a faint "next picture in" line pinned to the bottom.

**The One Box Rule.** In the day margin the only boxed control is Share. Secondary actions (high resolution, official page, see the month) are notation links: muted text, line-strong underline turning red on hover, external ones with a 16px link-out icon.

### Share Menu
Share uses the native share sheet where it exists; otherwise a 256px ink-wash popover with a line-strong border and the popover lift, listing copy link and five share targets as 48px notation rows with 16px muted SVG icons; rows darken to ink on hover.

### Archive Day Cell
Hairline-ruled cell, notation day number (red for the current day), a square thumbnail at 80% opacity rising to full on hover or focus, and a two-line serif title in copy. Video days carry a small ink notation tag with a play icon. Missing days show faint "no picture" notation; loading days show an ink-wash square.

## Do's and Don'ts

### Do:
- **Do** put the picture in a plate and everything about it in the margin as notation.
- **Do** draw every frame with 1px lines: line for dividers and image outlines, line-strong for control borders and the outer neat-line.
- **Do** keep red to position and focus: current day, current nav item or language, the ruler thumb, focus rings.
- **Do** draw errors and missing days as dashed empty plates with outline controls.
- **Do** set every date, count and code in notation with tabular figures, and every NASA title and caption in the serif with `lang="en"`.
- **Do** keep every interactive target at least 48px tall and give it the 2px red focus ring at 3px offset.
- **Do** let pictures arrive with the focus pull, and drop it under `prefers-reduced-motion`.

### Don't:
- **Don't** crop the day picture or let its size change the plate; contain it and outline its own box.
- **Don't** fill anything with red, and never use red for errors, warnings or empty states.
- **Don't** add a second boxed control to the day margin; secondary actions are notation links.
- **Don't** draw a major ruler tick without a numeral under it.
- **Don't** round corners, fill containers into cards, or add backdrop blur or glass to surfaces.
- **Don't** set text in line or line-strong, or any text below faint.
- **Don't** use shadows for depth anywhere except the share popover.
