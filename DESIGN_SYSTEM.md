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
- **Background:** parallax fog banks and a full-viewport grain texture, drifting continuously at low opacity (see Environment Art below)
- **Particles:** sparse ember blooms drifting upward, amber fading to cyan

Keep animations calm and purposeful. No excessive game effects. No distracting movement.

## Environment Art

HQ's ambient backdrop shipped as **Direction B — Volumetric Depth & Grain**: parallax fog banks, a full-viewport grain texture, and sparse ember blooms drifting upward (`AmbientBackground.tsx`), plus a `PanelAtmosphere` accent tinting Quest Board (amber+cyan) and Idea Vault (cyan) to their location bias. Pure CSS — no canvas, no new dependency. On by default at a balanced intensity; toggle and intensity dial live in Profile > Options.

Every color in this system reads from `--accent`/`--accent-glow` via `color-mix()`, not literal RGB values — light mode's deliberately dark, desaturated accent colors need substantially more pigment to read at all, so several tokens (`--ambient-fog-mix`, `--ambient-ember-mix-1/2`, `--panel-atmosphere-mix`, `--ambient-ember-blur`, `--ambient-ember-opacity`) carry separate light/dark values. Any new decorative glow or gradient in this app should follow the same rule — a literal `rgba(255,171,74,X)` looks identical in both themes, which is itself the bug (see `FounderStatusBar`'s light-mode fix).

Real photographic/illustrated background art and HUD framing elements beyond the existing `CornerMarks` (grid lines, scanlines) are still future work, not yet started.

## Location Atmosphere Reference

| Location | Feel | Color bias |
|---|---|---|
| AI Mastery HQ | Personal headquarters, welcoming | Warm amber |
| Constitution Hall | Command deck, moral authority | Deep amber |
| Quest Board | Mission control, clarity | Amber + cyan |
| Idea Vault | Protected archive, encrypted | Cool cyan |
| The Observatory | Analysis deck, clear-eyed reflection | Cool cyan |
| Tend the Fire | Life-support / hearth system, emotional support | Deep amber |
