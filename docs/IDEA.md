# Agrim Tycoon

## One-line pitch

**Diner Dash, but instead of serving food, Agrim must serve an AI community, coding students, and Elon—at the same time.**

Agrim Tycoon is a short, comedic management game about surviving seven chaotic days across three jobs with help from AI.

## Player fantasy

The player becomes Agrim and must balance three roles:

1. **65labs community manager** — remove scams, spam, and irrelevant posts without destroying the community.
2. **Code with AI instructor** — help students solve problems and ship working apps.
3. **SpaceXAI engineer** — build something impressive before Elon loses patience.

The challenge is not completing every task personally. It is deciding what deserves attention, what can wait, and what should be delegated to AI.

## Game type

A **real-time comedy management game** with decision and investigation mechanics:

- **Diner Dash:** the main loop of juggling requests across three stations.
- **Reigns:** quick choices with visible and hidden consequences.
- **Papers, Please:** occasional tasks that require inspection before making a decision.

## Core gameplay

Agrim works from one room containing three stations:

```text
[65labs Discord]      [Code with AI]      [SpaceXAI]
      💬💬💬                  🧑‍🎓🧑‍🎓                  🚀
```

Requests continuously appear at each station. Every request has a patience timer. The player moves Agrim between stations and decides how to handle each problem.

Example simultaneous incidents:

- Someone posts a suspicious token-maxxing opportunity in 65labs.
- A student accidentally exposes an API key.
- Elon sends one message: `Demo?`

The player can only handle one request at a time. Other requests must wait or be delegated to Gemma.

## Core loop

1. A request appears at one of the three stations.
2. The player moves Agrim to the station before its timer expires.
3. Agrim investigates the request when necessary.
4. The player chooses an action or delegates it to Gemma.
5. The decision changes the game stats and may create a later consequence.
6. More requests appear while time continues moving.
7. At the end of seven days, the player receives three role endings and one overall ending.

## Player stats

- **Community Trust** — health and quality of 65labs.
- **Student Success** — how well Code with AI students are learning and shipping.
- **Elon Approval** — confidence in Agrim's SpaceXAI work.
- **Energy** — Agrim's ability to keep working without burning out.
- **Time** — the limited resource shared by all three jobs.

If the player ignores a role, its problems become more serious. If energy reaches zero, Agrim burns out.

## AI integration

### Gemma: Agrim's assistant

Gemma handles delegated tasks, especially community moderation. It classifies messages as:

- scam,
- irrelevant spam,
- low-effort promotion,
- legitimate opportunity,
- genuine beginner question,
- ambiguous.

Gemma is intentionally imperfect. The player reviews its decisions and teaches it through feedback. Delegation saves time, but trusting it blindly can hurt the community or students.

### Gemini: the game director

Gemini powers the wider game world. It can:

- generate incidents based on the current game state,
- play community members, students, and Elon,
- react to the player's decisions,
- connect consequences across different roles,
- evaluate a SpaceXAI diagram or prototype,
- generate the final performance review.

The AI is part of the gameplay rather than only generating decorative dialogue.

## Example scenario

> A member posts: "Who wants to token maxx and make $10K tonight?"

Possible actions:

- Ban the member immediately.
- Warn them and request evidence.
- Ask them to share a real project.
- Delegate the investigation to Gemma.
- Ignore the post and work on the SpaceXAI demo.

The decision may change community trust, consume time, influence Gemma's future behaviour, or create a later crisis.

## Endings

The player receives a separate ending for each role.

| Role | Good | Average | Bad |
| --- | --- | --- | --- |
| Code with AI | **Great Sage** — students become confident builders | **Helpful Tutor** — most students survive | **Vibe Coding Fraud** — everyone ships exposed API keys |
| 65labs | **Community Legend** — the community becomes useful and welcoming | **Busy Moderator** — the chaos is barely controlled | **Discord Tyrant** — everyone gets banned |
| SpaceXAI | **Honored by Elon** — Agrim ships something impressive | **Still Employed** — the demo works after refreshing twice | **Fired by Elon** — Agrim is replaced by an intern and a cron job |

Special combined endings:

- **The Ultimate Agrim** — achieve all three good endings.
- **Burnout% Speedrun** — run out of energy while trying to do everything.
- **Task Failed Successfully** — fail two jobs but accidentally create a successful startup.
- **LinkedIn Thought Leader** — ship nothing but write a viral post about the journey.

Example result:

> **Great Sage · Community Legend · Fired by Elon**
> You built people and protected the community—but forgot to build the product.

## Hackathon MVP

The first version should contain:

- one room with three interactive workstations,
- one seven-day run lasting approximately 5–10 minutes,
- 12–15 handcrafted anchor scenarios,
- quick choices for most requests,
- deeper investigation for a few special requests,
- Gemma-powered moderation and delegation,
- Gemini-powered reactions and consequences,
- one SpaceXAI multimodal prototype challenge,
- multiple ending combinations,
- a shareable final result card.

## Scope guardrails

- Do not build a large explorable world.
- Do not create complex buildings, currencies, or traditional tycoon upgrades for the MVP.
- Keep most tasks fast so the real-time pressure remains fun.
- Use handcrafted scenarios for reliable storytelling; use AI to vary details and consequences.
- Make every AI feature visible and important to the player's decisions.

## Tone

The game should be affectionate, fast, absurd, and slightly stressful. It should celebrate Agrim's work while exaggerating the chaos of handling three roles.

Because the game uses a real person's identity and career, obtain Agrim's consent before publishing or presenting it prominently.

## Reference assets

- [Agrim LinkedIn experience](./agrim-singh-linkedin-experience.png)
- [Agrim headshot](./agrim-singh-headshot.png)
- [Steve Jobs visual reference](./steve-jobs-reference.png)
