# Design System — Freedom Engine

## Design Philosophy

Freedom Engine should feel like **entering a world**, not managing a dashboard.

The Founder moves through locations. He does not manage menus.

## Visual Inspiration

- Immersive RPG worlds (atmosphere and feeling only — no copied assets)
- Nordic darkness and stone halls
- Cinematic fantasy-tech
- Warm firelight and hidden archives
- Strategic war rooms
- Quiet mystery and personal headquarters

> Do not copy any copyrighted game assets, UI, names, or visuals.
> Capture the feeling, not the intellectual property.

## Visual Identity

**Use:**
- Dark, near-black backgrounds
- Warm amber and ember accent tones
- Cinematic depth and shadow
- Subtle atmospheric gradients
- Premium, minimal spacing
- Soft warm glow on hover and focus
- Calm, purposeful motion

**Avoid:**
- Corporate dashboard styling
- Generic SaaS UI patterns
- Bright productivity colors
- Cartoonish fantasy elements
- Visual clutter and noise
- Guilt-based task management UI
- Excessive future placeholders

## Color Tokens

| Token | Value | Use |
|---|---|---|
| `--background` | `#0a0908` | Page background |
| `--foreground` | `#e8e0d5` | Primary text |
| `--muted` | `#9a8f82` | Secondary text |
| `--accent` | `#d4a574` | Gold accent |
| `--accent-glow` | `#e8842a` | Ember/active accent |
| `--surface` | `#141210` | Card surface |
| `--surface-raised` | `#1c1815` | Elevated surface |

## Typography

| Role | Font | Notes |
|---|---|---|
| Display / titles | Cinzel | Headings, location names, labels |
| Body / UI | Geist Sans | Descriptions, body text |
| Mono | Geist Mono | Code, technical content |

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

## Panels and Cards

Standard panel structure:
- Dark gradient background (`from-[rgba(22,17,11,...)] to-[rgba(10,8,6,...)]`)
- Top inset highlight (`inset 0 1px 0 rgba(212,165,116,0.07)`)
- Corner marks for framing (optional, use on strategic panels)
- Warm radial glow at top-left on focus/hover
- No harsh solid borders — prefer shadow and inset highlights

## Animation

- **Entrance:** `fade-up` with staggered `animationDelay` per section
- **Hover:** lift (`-translate-y-1`), scale (`scale-[1.01]`), warm glow
- **Active indicators:** `animate-glow-pulse` on ember dots
- **Background:** `animate-ember-drift` for atmospheric orbs
- **Particles:** `animate-particle-float` for floating dust motes

Keep animations calm and purposeful. No excessive game effects. No distracting movement.

## Environment Art

Real background graphics, architectural elements (pillars, halls, arches), and world art should be added later as a dedicated **Environment Art Pass**.

Do not force complex CSS-only fake architecture prematurely. Atmosphere through gradients and lighting is sufficient until real art assets are ready.

## Location Atmosphere Reference

| Location | Feel | Color bias |
|---|---|---|
| AI Mastery HQ | Personal headquarters, welcoming | Warm gold |
| Constitution Hall | Sacred hall, moral authority | Deep gold |
| Quest Board | Strategic war room, clarity | Amber |
| Idea Vault | Hidden archive, protective | Cool-warm |
| Tend the Fire | Hearth room, emotional support | Deep ember |
