# Validation and pilot measurement

## Automated checks

Run `npm test`. The Node test suite covers distinct demo decisions, cross-channel opt-outs, exact replay deduplication, replay conflicts, incomplete source coverage, unsupported commitment completion, future-event rejection, fabricated evidence/quotes, default no-network execution, request budgets, cache reuse, ambiguous mapping identities, provider request formats, pagination boundaries and redacted errors. Provider calls are mocked; no paid accounts were exercised.

`npm run build` regenerates the self-contained browser demo from the same engine used by the CLI. The CI workflow runs tests and checks that the generated file matches source.

## Acceptance scenarios

- Northstar: overdue promise points at the correct LinkedIn evidence and recipient. Simulated fulfillment removes the overdue count.
- Cedar: a future booking leads to meeting preparation.
- Harbor: opt-out blocks a follow-up recommendation.
- Orbit: agreed future timing leads to waiting.
- Maple: incomplete email history blocks a confident next action.
- Summit: shared contact identity requires manual resolution.
- Atlas: topic keywords intentionally demonstrate that negation still requires human interpretation.

## Measure usefulness before claiming ROI

Use a small approved pilot with representative, redacted account snapshots. Have reviewers complete the same account-review task manually and with the engine, counterbalancing task order. Record time to accepted next action, missed commitments, incorrect identity merges, duplicate follow-up recommendations, reviewer corrections, API spend and accepted-brief count.

Report median minutes saved per account, error counts and cost per accepted brief with sample size and exclusions. Do not infer pipeline revenue from reply rates alone. Current repository numbers are fictional demo outcomes and configurable estimates, not customer results.
