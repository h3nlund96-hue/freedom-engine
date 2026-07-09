# Design System — Freedom Engine

## Design Philosophy

Freedom Engine should feel like **entering a world**, not managing a dashboard.

The Founder moves through locations. He does not manage menus.

The RPG mechanics — Quests, Builds, Locations, Companions — stay exactly as they are. Only the visual world around them changes: from dark fantasy stone-and-firelight to a dark sci-fi HUD.

## Visual Inspiration

- Immersive HUD/cockpit interfaces (atmosphere and feeling only — no copied assets)
- Deep-space instrumentation — Starfield's retro-futurist cockpit panels
- Iron Man's arc-reactor HUD — clean telemetry, quiet until something needs attention
- Strategic war rooms, mission control
- Quiet mystery and personal headquarters — still true, now told through onboard systems instead of stone halls

> Do not copy any copyrighted game assets, UI, names, or visuals.
> Capture the feeling, not the intellectual property.

## Visual Identity

**Use:**
- Dark, near-black navy backgrounds
- Amber instrument accent as primary, cool cyan as secondary
- Thin 1px lines and hairline corner brackets instead of solid borders
- Faint grid / scanline texture for depth (in place of atmospheric fog)
- Premium, minimal spacing
- Soft accent glow on hover, focus, and active indicators
- Calm, purposeful motion — telemetry ticks, not fire

**Avoid:**
- Corporate dashboard styling
- Generic SaaS UI patterns
- Bright productivity colors
- Cartoonish sci-fi elements
- Visual clutter and noise
- Guilt-based task management UI
- Excessive future placeholders

## Color Tokens

| Token | Value | Use |
|---|---|---|
| `--background` | `#070a10` | Page background |
| `--foreground` | `#e4e8ee` | Primary text |
| `--muted` | `#74829f` | Secondary text |
| `--accent` | `#ffab4a` | Amber instrument accent |
| `--accent-glow` | `#4dd8ff` | Cyan/secondary accent, active state |
| `--surface` | `#0e131c` | Card surface |
| `--surface-raised` | `#161d29` | Elevated surface |
| `--critical` | `#ff5c5c` | Warnings / destructive actions only |

## Typography

| Role | Font | Notes |
|---|---|---|
| Display / titles / labels | Geist Mono | Uppercase, wide tracking — headings, location names, badges read like onboard telemetry |
| Body / UI | Geist Sans | Descriptions, body text |
| Data / stats | Geist Mono | Tabular numerals for anything counted (Builds live, quest %) |

Cinzel is retired. No new webfont is introduced — the HUD register comes from typesetting the existing Geist Mono uppercase, tracked, and small, not from a new typeface.

## UI Language

| Freedom Engine term | Avoid |
|---|---|
| Location | Page |
| Gateway / Enter | Button |
| Room / Chamber | Section |
| Build | Task |
| Questline | Project |
| Companion | Bot |
| Seal in the Vault | Save |

## Shape and Form

The HUD re-theme (color) is done. This pass moves the *shape* language to match: instrument panels are rectangular and hairline-edged, not soft rounded cards.

| Element | Radius | Notes |
|---|---|---|
| Cards / panels / modals | `rounded-md` (6px) | Down from `rounded-2xl`/`rounded-xl` |
| Buttons / badges / inputs | `rounded-sm` (2px) | Down from `rounded-lg`/`rounded-xl` — reads as a switch, not a pill |
| Icon frames (location icon, avatar) | `rounded-md`, square | Down from `rounded-full` — framed like an instrument readout, with corner brackets, not a circular emblem |
| Status / active / pulse indicators | `rounded-full` | Stays circular — these are the one place a dot reads correctly, like an LED |

Every panel gets an explicit 1px hairline border (`border border-white/[0.08]` or an accent-tinted equivalent) in addition to — not instead of — the existing gradient and inset highlight. Corner brackets (`CornerMarks`) become the default framing on primary panels, not just an optional accent.

## Panels and Cards

Standard panel structure:
- Dark gradient background (`from-[rgba(22,29,41,...)] to-[rgba(14,19,28,...)]`)
- 1px hairline border (`border-white/[0.08]`)
- Top inset highlight (`inset 0 1px 0 rgba(255,171,74,0.07)`)
- Corner brackets for framing (default on primary panels — see Shape and Form)
- Faint grid texture at low opacity, masked to fade toward panel edges
- Amber glow at top-left on focus/hover; cyan glow for active/live state
- No soft, heavily-rounded borders — prefer small radii, 1px hairlines, shadow, and inset highlights

## Animation

- **Entrance:** `fade-up` with staggered `animationDelay` per section
- **Hover:** lift (`-translate-y-1`), scale (`scale-[1.01]`), amber or cyan glow depending on state
- **Active indicators:** `animate-glow-pulse` on status dots
- **Background:** faint drifting grid / starfield in place of ember orbs
- **Particles:** slow-moving points of light in place of dust motes

Keep animations calm and purposeful. No excessive game effects. No distracting movement.

## Environment Art

Real background graphics, HUD framing elements (grid lines, corner brackets, scanlines), and world art should be added later as a dedicated **Environment Art Pass**.

Do not force complex CSS-only fake architecture prematurely. Atmosphere through gradients and lighting is sufficient until real art assets are ready.

## Location Atmosphere Reference

| Location | Feel | Color bias |
|---|---|---|
| AI Mastery HQ | Personal headquarters, welcoming | Warm amber |
| Constitution Hall | Command deck, moral authority | Deep amber |
| Quest Board | Mission control, clarity | Amber + cyan |
| Idea Vault | Protected archive, encrypted | Cool cyan |
| Tend the Fire | Life-support / hearth system, emotional support | Deep amber |
