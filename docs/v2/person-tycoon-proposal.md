# Person Tycoon V2 — Proposal

## Summary

**Person Tycoon** is a game-creation platform that lets a person turn their lived experience, decisions, values, and expertise into a playable management game: **`<Person> Tycoon`**.

Instead of reading a biography or watching an interview, a player learns by making the kinds of trade-offs that shaped the person. The subject designs the game, reviews its truthfulness, and publishes it for others to play.

Over time, opt-in player conversations can become a carefully governed knowledge base that helps create a subject-specific AI expert. That expert should explain the subject's public perspective, surface evidence and uncertainty, and never impersonate the person or claim authority it has not been given.

## Product thesis

People are difficult to understand through static content because their story is mostly a sequence of constraints, decisions, failures, and changing priorities.

A simulation makes those decisions tangible. A player who has to choose between shipping quickly, protecting a team, raising money, or preserving a principle gains a more useful understanding than someone who only consumes a highlight reel.

The platform creates value for three groups:

| Group | Value |
| --- | --- |
| Subject / creator | A new, interactive way to communicate their story, teach their operating model, and build a durable audience asset. |
| Player / learner | A memorable way to learn how a real person thinks by testing decisions and seeing grounded consequences. |
| Community / organisation | A repeatable format for preserving tacit knowledge, onboarding people, and teaching judgment rather than only facts. |

## Product definition

### What is a `<Person> Tycoon`?

A `<Person> Tycoon` is a scenario-based game built around a real person's journey or domain expertise.

It can cover a founder, creator, investor, operator, athlete, community leader, technical expert, or historical figure. The game does **not** need to be a literal biography. It is a truthful, creator-approved simulation of meaningful trade-offs.

Examples:

- **Agrim Tycoon** — build products, navigate career choices, run hackathons, and balance technical execution with operator leverage.
- **Chef Mei Tycoon** — grow a restaurant while protecting quality, culture, and supplier relationships.
- **Climate Investor Tycoon** — allocate capital through uncertain climate technologies and policy shifts.
- **Museum Director Tycoon** — balance public access, preservation, funding, and cultural responsibility.

## Visual direction: from playable board to lived-in world

The V2 visual language should pair a clear, decision-first management interface with an aspirational world that makes the subject's journey emotionally legible.

Two supplied references establish the relationship:

| Reference | What it represents | Design takeaway |
| --- | --- | --- |
| Artist impression — `Generated image 1.png` | The destination: a thriving, regenerative Innovation City where food systems, clean energy, robotics, people, and a dense urban core coexist. | The world should feel ambitious but grounded: progress is visible in the landscape, infrastructure, and quality of life—not only in abstract scores. |
| Current game — `Screenshot 2026-08-22 at 2.54.18 PM.png` | The decision surface: a readable operations board with city health, resources, districts, an active task, and a Gemma-assisted mayor's log. | Preserve this strong management-game clarity: players need to understand the stakes, available action, and consequence at a glance. |

### Design intent

The board is the **control room**; the artist impression is the **promise**. A player should feel that every decision changes a real place or journey, while never losing the practical clarity required to make an informed choice.

For Agrim Tycoon, the destination is a regenerative innovation city: agricultural belts and solar fields support an advanced urban core; automation extends human capacity; civic spaces and communities remain visible. The current board already expresses the operational layer through Funds, Residents, Food, Materials, Power, Trust, city health, districts, and actionable operations.

V2 should connect these layers through visible world state:

- A successful harvest operation should make the agricultural belt visibly more productive, while raising meaningful resource or power trade-offs.
- New research, education, or community decisions should change the relevant district and the people who inhabit it, not just a number in the HUD.
- Trust and environmental health should affect the atmosphere of the city—public activity, green space, maintenance, and resilience—without reducing complex human outcomes to decoration.
- The AI guide should remain a bounded decision aid in the control room, not become a character that takes over the game or narrates ungrounded outcomes.

### Applying the visual system to Person Tycoon

Not every `<Person> Tycoon` needs a literal city. The same relationship can be expressed through a subject-specific world:

| Game type | Operational interface | Aspirational world state |
| --- | --- | --- |
| Founder Tycoon | Product, runway, team, customer trust, and focus | A company or ecosystem growing in capability and reach. |
| Career Tycoon | Skills, energy, income, reputation, relationships, and options | A career map showing expanding agency, craft, and long-term ownership. |
| Expert Craft Tycoon | Quality, time, tools, safety, and learner outcomes | A workshop, studio, lab, kitchen, or practice made more capable through good judgment. |
| Cause / Community Tycoon | Resources, legitimacy, participation, policy, and resilience | A neighbourhood or movement whose shared capacity changes over time. |

The visual theme must follow the person and their learning goal, not force every creator into a futuristic-city aesthetic. The reusable system is the pattern: **a legible decision surface linked to a world that visibly carries the consequences.**

### V2 visual MVP

- Keep the current dashboard structure: global state at the top, a central world/board, an active decision panel, and a concise log of context and outcomes.
- Add one visible world-state layer per template (for example, district condition, career map, workshop, or ecosystem), rather than building high-fidelity 3D worlds immediately.
- Use a consistent semantic system for resources, trade-offs, and confidence; colour and animation must support comprehension rather than obscure it.
- Make source-backed explanations and the creator's perspective available beside consequential choices, so the visual experience remains a learning product rather than a generic city builder.
- Treat the artist impression as north-star art direction, not as a promise of V2 production fidelity.

## Experience principles

1. **Learn through decisions, not trivia.** Each scene should give the player an incomplete, consequential choice.
2. **The person remains the source of truth.** The creator can approve, revise, unpublish, or correct every public game element.
3. **Show trade-offs, not hero worship.** Good games include uncertainty, mistakes, constraints, and reasonable disagreement.
4. **AI informs; people retain control.** AI assists creation and reflection, but does not silently decide canon or impersonate a person.
5. **Make provenance visible.** Players should be able to tell what comes from the creator, cited sources, game design, or a community synthesis.
6. **Earn expertise through consent and review.** Conversation-derived knowledge is opt-in, attributable by class of source, and reviewable before it becomes part of an expert.

## Core product flows

### 1. Creator: make a game

1. The creator starts with a template, such as Founder Journey, Career Decisions, Expert Craft, or Historical Leadership.
2. They add source material: written answers, interviews, timeline events, lessons, artefacts, and approved public links.
3. The builder proposes a game map: chapters, objectives, scenarios, key metrics, decision branches, and learning goals.
4. The creator edits the content and marks what is public, private-to-draft, or excluded.
5. The creator previews the game, approves the final version, and publishes `<Person> Tycoon`.

### 2. Player: learn by playing

1. The player enters a short, high-context scenario.
2. They choose an action, ask for clarification, or request a perspective check.
3. The game reveals a consequence, the creator's actual or preferred approach where available, and the reasoning behind it.
4. The player continues through branching scenarios, building a practical mental model of the person or domain.
5. At the end, they receive a reflection: patterns in their choices, lessons missed, and primary sources to explore next.

### 3. Player: discuss and deepen understanding

1. After a scenario, the player can discuss the decision with an AI guide.
2. The guide distinguishes between creator-approved material, cited source material, and its own synthesis.
3. With explicit opt-in, the player may contribute a question, insight, or corrected interpretation to the community knowledge pool.
4. The creator or designated reviewers can inspect promising contributions and approve them for use in future game versions or the expert.

## The game builder

The builder should make a compelling first game possible without requiring the subject to be a game designer.

### Builder inputs

| Input | Purpose |
| --- | --- |
| Identity and intent | Who is this game about, who should learn from it, and what should they understand afterwards? |
| Timeline | Defining chapters, turning points, successes, failures, and changes of mind. |
| Decision cards | Situation, options considered, chosen action, constraints, outcome, and lesson. |
| Operating principles | Repeated beliefs, heuristics, red lines, and preferred ways of working. |
| Evidence | Links, documents, media, and source notes that support public claims. |
| Game design controls | Tone, audience level, game template, difficulty, metrics, and publishing permissions. |

### Builder outputs

- a playable chapter map;
- scenario cards with explicit decision branches;
- score or state variables that represent real trade-offs;
- explanations, source links, and confidence labels;
- a review queue for AI-proposed content;
- a publishable web game and a versioned content record.

### Initial templates

| Template | Best for | Core tension |
| --- | --- | --- |
| Founder Tycoon | Founders and operators | Growth, cash, team, customer trust, and focus. |
| Career Tycoon | Professionals and creators | Skill building, reputation, income, risk, and life constraints. |
| Expert Craft Tycoon | Specialists and educators | Quality, speed, ethics, constraints, and judgment. |
| Cause / Community Tycoon | Advocates and civic leaders | Impact, legitimacy, resources, coalition, and resilience. |

## The expert: from discussion to a trusted learning companion

The long-term opportunity is not an unbounded chatbot trained to imitate a person. It is a **subject-specific expert** that helps learners explore a verified body of knowledge.

### What the expert can do

- explain the person's documented principles and decisions;
- compare a player's reasoning with known approaches;
- point to sources and distinguish fact from interpretation;
- identify unanswered or disputed questions;
- propose new scenario ideas for creator review;
- summarise recurring learner questions for the creator.

### Knowledge pipeline

```text
Creator-approved sources ───────────┐
                                     ├─> evidence-tagged knowledge base ─> reviewed expert
Opt-in player discussions ─> review ┘                                  │
                                                                          └─> game updates and new scenarios
```

Every knowledge item needs metadata: source, author or contributor class, consent status, date, confidence, and review status. The expert should retrieve from this evidence-tagged store instead of treating every conversation as fact.

### Trust and consent rules

- No private conversation is used for training, public retrieval, or product improvement without explicit, granular opt-in.
- The creator controls whether player contributions can influence the game, the expert, both, or neither.
- Unreviewed community contributions remain suggestions; they cannot become creator truth by default.
- The expert uses clear language such as “based on the creator-approved material” and cites its source where practical.
- The product must never claim the AI *is* the person, speaks for them, or offers their current advice.
- Creators can export, correct, delete, or unpublish their material and their public expert.

## V2 MVP

The first version should prove the creation-to-learning loop with one creator and one high-quality published game.

### In scope

- one reusable game template, beginning with **Career / Founder Tycoon**;
- a creator workspace for defining a timeline, 8–12 decision cards, principles, and source notes;
- AI-assisted drafting that always requires creator approval before publishing;
- a player-facing branching game with visible consequences and lesson/source panels;
- an in-game discussion guide grounded only in approved material;
- a basic, explicit opt-in mechanism for player discussion contributions;
- creator review of submitted questions and scenario suggestions;
- version history and an unpublish control.

### Out of scope for V2 MVP

- autonomous model fine-tuning on player conversations;
- automatically publishing AI-generated biographical claims;
- social feeds, marketplace mechanics, or many game genres;
- convincing digital impersonation, voice cloning, or real-time advice in the creator's name;
- treating player engagement as proof of truth or expertise.

## Success measures

| Goal | Early measure |
| --- | --- |
| Creators can ship | Time from blank template to an approved playable first chapter. |
| Players actually learn | Completion rate and a short pre/post reflection on the creator's operating principles. |
| The game creates curiosity | Primary-source clicks, replay rate, and questions submitted after play. |
| Community knowledge improves quality | Percentage of opted-in contributions approved or converted into better scenarios. |
| Trust holds | Clear consent rate, low correction rate for published claims, and creator confidence in controls. |

## Key risks and product responses

| Risk | Response |
| --- | --- |
| The game becomes a flattering personal brand exercise | Design for hard choices, evidence, and creator-approved ambiguity—not a highlight reel. |
| AI invents details or overstates a viewpoint | Ground responses in approved sources; attach provenance and show uncertainty. |
| Player discussions produce noise or harmful material | Keep contributions separate from canon, moderate them, and require review before reuse. |
| “Expert” implies personal authority | Describe it as a source-grounded learning companion; do not imply current advice or identity. |
| Building a general game platform expands scope too early | Begin with a single template and a single flagship creator game. |

## Recommended launch sequence

1. **Dogfood with Agrim Tycoon.** Use the existing project as the first creator-driven template, focused on career, hackathons, and operator decisions.
2. **Validate learning.** Recruit 10–20 players and test whether they can explain the creator's operating principles after a 10-minute session.
3. **Build the narrow creator flow.** Enable one trusted second creator to make a game using the same template.
4. **Add governed discussion.** Capture opt-in questions and insights; expose them only as a review queue, not as automatic expert knowledge.
5. **Prove repeatability.** Measure how much creator effort is needed to publish a credible game, then decide whether to expand templates or distribution.

## Open decisions

- Is the initial customer an individual creator, a coach/educator, or an organisation preserving expert knowledge?
- Should published games be free marketing assets, paid learning products, or both?
- What minimum source standard is required before a game can claim to represent a living person?
- Who can review community contributions: only the creator, trusted collaborators, or platform moderators?
- When should an “expert” be enabled: after a source threshold, creator approval, or both?

## One-line pitch

**Person Tycoon turns a person's hard-won decisions into a playable learning experience—and, with consent and review, into a source-grounded expert that helps others keep learning.**
