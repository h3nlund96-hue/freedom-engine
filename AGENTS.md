<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Freedom Engine — AI Agent Rules

## What is this project?

Freedom Engine is a personal AI operating system for The Founder. It is a living, RPG-inspired world — not a generic app.

It is **not**:
- a productivity dashboard
- a SaaS product
- a Notion clone
- a todo app
- a chatbot interface

It **is**:
- a living world with locations, Questlines, and Builds
- a personal headquarters for The Founder
- a system that serves The Founder — not the other way around

> The system exists to serve The Founder. The Founder does not exist to serve the system.

---

## Source-of-Truth Documents

Before making any product, design, terminology, or architecture decision, read these files:

| File | Purpose |
|---|---|
| `PRODUCT_VISION.md` | What Freedom Engine is, its philosophy, current quest state |
| `DESIGN_SYSTEM.md` | Visual identity, color tokens, typography, UI language, animation rules |
| `LEXICON.md` | All Freedom Engine terms and their definitions |

These are the authoritative source of truth. Do not invent new product concepts, visual directions, or terminology that contradicts them.

---

## Language Rules

Freedom Engine has its own vocabulary. When a Freedom Engine term exists, use it.

| Use | Avoid |
|---|---|
| Build | Task, ticket, action item |
| Quest | Goal, objective, sprint |
| Location | Page, screen, view |
| Companion | Bot, assistant, agent |
| The Founder | User, you, member |
| Headquarters / HQ | Dashboard, home, hub |

Full language rules are in `LEXICON.md`.

---

## Visual Rules

- The UI should feel like entering a world, not managing a menu.
- Use dark backgrounds, warm amber/ember accents, cinematic depth, and subtle atmospheric motion.
- Do not introduce corporate dashboard styling, bright productivity colors, or cluttered layouts.
- Do not force complex CSS architecture before the Environment Art Pass.

Full visual rules are in `DESIGN_SYSTEM.md`.

---

## Before Making Changes — Workflow

1. Read `PRODUCT_VISION.md`
2. Read `DESIGN_SYSTEM.md`
3. Read `LEXICON.md`
4. Identify which Build the change belongs to
5. Make the smallest useful change
6. Do not overbuild

---

## Principles

- Build only what solves a real problem.
- Show reality, not potential.
- No guilt. No overwhelm.
- The Founder should want to return.
- Every Quest is completed through Builds.
