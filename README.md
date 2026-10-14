# GTM Context Engine

**Turn scattered sales conversations into an evidence-backed account review queue.**

A salesperson promises an implementation outline on LinkedIn. A finance contact asks for cost assumptions by email. The CRM says “proposal,” but no technical reviewer is confirmed. This project brings those facts together, surfaces the overdue promise, and recommends the next asset to review- with source references.

Built by Prity Kar as an open-source GTM engineering project. This is a working local prototype with fictional demo data, not a claim of production deployment or measured revenue uplift.

[Open the interactive demo](https://prity-creator.github.io/gtm-context-engine/) · [Setup](docs/SETUP.md) · [Architecture](docs/ARCHITECTURE.md) · [API contracts](docs/CONNECTORS.md)

## Try it in three commands

Requires Node.js 22 or newer. There are no npm dependencies and no API keys needed for the demo.

```sh
git clone https://github.com/prity-creator/gtm-context-engine.git
cd gtm-context-engine
npm start
```

Open http://127.0.0.1:4174. You can also open `index.html` directly. Run `npm test` to check the decision engine and mocked provider contracts. Run `npm run build` after editing source files.

## What it helps teams do

- Review LinkedIn, email, CRM and calendar evidence together instead of reconstructing context in separate tabs.
- Find overdue, explicitly confirmed commitments and respect agreed future follow-up dates.
- Quarantine conflicting identities, preserve cross-channel opt-outs, and block drafting when source coverage is stale or incomplete.
- Prioritise accounts with editable ICP and engagement weights; see exactly why each score was assigned.
- Find missing buying roles and recurring message topics to inform account and content strategy.
- Export context packs, policy JSON, sample data and a CLI workflow manifest for another workflow to consume.
- Optionally ask Jev to classify eligible cases and Gemini or Claude to prepare a sourced brief within configurable request limits.

The intended time saving is reducing repeated context assembly and unnecessary model calls. It is **not yet measured**. See the pilot measurement plan in [VALIDATION.md](docs/VALIDATION.md).

## Explore the demo

1. Open **Northstar Analytics**: a LinkedIn promise is overdue, while a separate finance contact asks about cost assumptions.
2. Inspect the timeline and missing technical reviewer. Export the evidence-backed context pack.
3. Click **Simulate fulfilled promise**: the demo adds email fulfillment evidence and recomputes the decision.
4. Compare **Maple Cloud** (incomplete email coverage), **Harbor Systems** (suppressed contact), and **Summit Labs** (duplicate identity).
5. Open **Strategy signals** to adjust weights, then **Cost planner** to compare illustrative routing assumptions.

## Integration status

| Component | Implemented here | Verification |
|---|---|---|
| HubSpot | Paginated contacts reader, completeness flag | Mocked HTTP tests; no live credentials tested |
| Smartlead | Per-lead message-history reader | Implemented; response mapping and account access need verification |
| Apollo | Explicit, opt-in business-email enrichment | Mocked HTTP tests; may consume credits |
| Google Sheets | Read a specified values range | Mocked HTTP tests; OAuth access token required |
| Google Calendar | Read events within an explicit window | Implemented; pagination incompleteness is exposed |
| Jev / Typesafe | Structured next-action classification | Mocked HTTP tests; configurable model alias |
| Gemini and Claude | JSON brief generation with quote validation | Mocked HTTP tests; models selected in environment |
| SalesRobot and Clay | Reviewed exports through explicit field mappings | No invented universal REST connector |
| HeyGen / ElevenLabs / meme creation / outbound sending | Context-pack handoff only | Not implemented in this repository |

Raw API responses are saved privately and must be mapped and reconciled. This is not a one-click CRM sync. The browser demo never requests API credentials or sends imported data to a server.

## Repository map

- `src/engine.mjs`: deterministic reconciliation and evidence validation.
- `src/pipeline.mjs`: optional model routing, request budget, cache and cost ledger.
- `src/connectors.mjs`: source readers and model API clients.
- `src/ingest.mjs`: explicit event mapping with identity rejection.
- `src/ui.html` → `index.html`: source and generated self-contained dashboard.
- `data/`, `schemas/`, `playbooks/`, `workflows/`: reusable JSON artifacts.
- `skills/`: two reusable `SKILL.md` workflows for reconciliation and account strategy.
- `docs/`: setup, source contracts, architecture, costs and validation.

Download the full repository using **Code → Download ZIP**. The workflow JSON describes this CLI; it is explicitly **not an n8n import**. Skill files are instructions, not model training or fine-tuning.

## Boundaries

No messages are sent, no CRM fields are changed, and no media assets are generated. All recommendations require review. Exact quote checks do not prove a model's interpretation. Topic matching is a simple keyword heuristic and can match negation. Completeness is an explicit operator assertion, not something the engine can infer from silence. Deployment with live enterprise data would need access control, retention, durable sync, audit history and organisation-specific review.

This project advances the earlier [Prity GTM Lab](https://github.com/prity-creator/prity-gtm-lab) prototypes into a concrete account-context workflow. Repository history reflects the actual creation dates.

MIT licensed. Contributions should include a fictional fixture demonstrating the business decision being improved.
