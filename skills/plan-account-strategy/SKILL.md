---
name: plan-account-strategy
description: Build an evidence-backed account strategy from a GTM Context Engine context pack, including buying-role gaps, next-step hypotheses and an asset brief. Use after source reconciliation when preparing account reviews or comparing GTM priorities.
---

# Plan Account Strategy

Read `docs/ARCHITECTURE.md` and the supplied context pack. Preserve its execution restrictions. Use the reconciliation skill first if source completeness, identity or commitment evidence is unresolved.

1. State the business problem evidenced by the account's messages. Quote exact source text and its evidence key. If the problem is unknown, say so.
2. Explain the current priority using configured factors. Do not describe the score as purchase probability or invent account intent.
3. Separate confirmed champion, economic buyer and technical reviewer from unverified role hypotheses. Job title alone does not confirm buying authority.
4. Choose one next-step hypothesis consistent with the deterministic action and agreed timing. Suppressed recipients stay excluded. Escalate contradictions to a reviewer.
5. Recommend a useful asset only when supported: implementation outline, cost-assumptions sheet, approved case study or concise contextual reply. Do not invent case-study numbers, ROI, personal interests, memes or video claims.
6. Return JSON with `summary`, `claims` (each with `statement`, `evidenceId`, exact `quote`) and `nextSteps`. Label uncertainty in prose. Run `validateModelBrief` where supported and report its limitations: shape/quotes are checked, semantic truth is not.
7. Give a human reviewer a short list of missing facts needed to accept the strategy. No sending or CRM update is authorised by this output.

For cost-aware operation, author and test instructions with a strong model, then evaluate cheaper configured models against the same cases. Version policy changes and compare correction rate and cost per accepted brief. Skills do not train or distil model weights.
