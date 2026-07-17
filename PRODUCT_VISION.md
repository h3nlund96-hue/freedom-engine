# Product Vision — Freedom Engine

## What is Freedom Engine?

Freedom Engine is a personal AI operating system for The Founder.

It is not:
- a productivity app
- a SaaS dashboard
- a Notion clone
- a todo app
- a generic AI chatbot

It is:
- a living world
- a personal headquarters
- a long-term operating system for building freedom
- a place for learning, building, AI, entrepreneurship, and personal growth
- a system that serves The Founder

## Core Principle

> The system exists to serve The Founder.
> The Founder does not exist to serve the system.

## Current State

Freedom Engine is no longer a concept — it's a real, working system. The Founder signs in, and everything below is live, persisted state (not seed data or a mockup): Questlines, Quests, Builds, Side Quests and Ideas are created, activated, completed and deleted through the app itself, with the "single active thing" rules (one active Quest globally, one active Build per Quest, a Quest and a Side Quest can't both hold the Active Path) enforced underneath, not just described here.

The first module is **AI Mastery HQ** — the starting headquarters where The Founder begins building the first real version of Freedom Engine. What's actually active right now — the Main Quest, the active Questline, the active Quest, and the current Build — is always visible live on the Quest Board; this document describes the system, not a snapshot of any one moment inside it.

## What's Built

| Location | What it does |
|---|---|
| **AI Mastery HQ** (`/`) | The headquarters. Greets The Founder, shows the active Quest at a glance, and is where a session starts. |
| **Quest Board** (`/quest-board`) | The full picture: Main Quest, active Questline, active Quest and its Builds, a Side Quests tab, and a Completed tab. Where Questlines, Quests, Builds and Side Quests get created, edited, activated, completed and deleted. |
| **Idea Vault** (`/idea-vault`) | Capture first, organize later. Ideas are sealed with a title, a description and a status, then later converted into a Quest or a Side Quest — or left alone. |
| **Constitution Hall** (`/constitution`) | The Founder Constitution, on display — the moral compass, not a settings page. |
| **Hall of Embers** (`/hall-of-embers`) | Ember's own room. A real conversation — typed or spoken — not a form. |
| **Tend the Fire** | Embedded in HQ, not its own location — the daily reminder that one ember is enough. |

Ember also has a floating presence on HQ, Quest Board and Idea Vault — an orb that opens her full console without leaving the page, and speaks up on its own in short, specific moments (never a nag): praise when a Quest or Build is completed or an Idea is captured, and a greeting the first time The Founder lands on HQ each session.

## Product Philosophy

- Build only what solves a real problem.
- Prototype first. Ship early.
- Keep the system simple.
- Capture first, organize later.
- Show reality, not potential.
- No guilt. No overwhelm.
- The Founder should want to return.
- Freedom Engine should feel like coming home to the adventure.
- Every Quest is completed through Builds.
- AI is the engine, but freedom is the identity.

## The Founder Constitution

The moral compass that guides every major decision:

1. **Freedom First** — All major decisions are evaluated by whether they bring more freedom.
2. **Build** — Learning happens through action. Create before consuming.
3. **Curiosity** — Let curiosity open doors, but let the compass choose which ones to walk through.
4. **Tend the Fire** — Small actions keep the adventure alive. One ember is enough.

## Companions

Companions are focused AI allies inside Freedom Engine. They are not chatbots.

Freedom Engine ships with one Companion for now — more will wake up in future Questlines as they earn a real, working role rather than sitting as an empty placeholder card.

| Companion | Role | Status |
|---|---|---|
| Ember | Direction, decisions, prioritization, protection of the vision — a single confident ally across all of Freedom Engine | Awake |

Ember talks two ways — typed, or live and out loud in Presence mode (a real spoken back-and-forth, not text-to-speech bolted onto chat) — and either way it's the same ongoing conversation and the same ally. She can see the real state of the Quest System and propose eleven kinds of action: creating a Quest, capturing an Idea, creating a Side Quest, creating a Questline, converting an existing Idea into a Quest or Side Quest, activating a Quest, completing a Build, creating a Build (one at a time or several at once, to break a Quest into its first steps), changing an item's status, or deleting one. Calling one of those only ever proposes it — nothing is written until The Founder approves the card on screen. Ember never acts on her own, in either channel.

### Companion Design Rules

- Companions serve The Founder. They do not command The Founder.
- **The Founder Constitution guides Companion responses internally.** It is not surfaced as a visible section by default.
- Constitutional Review (which principle is being served) should only appear when it is explicitly useful or directly requested — not as a default part of every response.
- Companions respond with one direct, flowing answer — not a structured framework broken into labeled parts (no separate "Answer" / "Recommended Direction" / "Smallest Step" sections). If a next step matters, it's woven into the same answer.
- Ember has personality — a little dry, occasionally light, closer to a trusted right-hand than a neutral advisor — but it's seasoning, not the point. Short, concrete, and factual is the default; going straight to the answer is respectful of The Founder's time, not a tone failure.
- Responses should feel like calm counsel from an ally with a personality — not like ChatGPT output, not like a framework explanation, not like an audit. Brevity and directness are part of that personality, not the absence of it.
- The Founder should feel guided, not analyzed.
- A Companion may act only by proposing — never by writing to the Quest System directly. The Founder approves every action, in text chat and in Presence mode alike.

## Locations (Current)

| Location | Route | Status |
|---|---|---|
| AI Mastery HQ | `/` | Live |
| Constitution Hall | `/constitution` | Live |
| Quest Board | `/quest-board` | Live |
| Idea Vault | `/idea-vault` | Live |
| Hall of Embers | `/hall-of-embers` | Live |
| Tend the Fire | — | Embedded in HQ (not a separate location) |
