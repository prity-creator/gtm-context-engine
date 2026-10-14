# Cost controls

The offline dashboard and rule engine require zero external API calls. Live enrichment and inference are optional. Subscriptions, enrichment credits, media rendering and hosting are separate costs.

The live pipeline enforces a maximum number of model requests and input characters per account. It reserves the configured estimated cost before making each call, caches outputs by content/model/policy, and does not automatically retry. Failed requests count against the request cap and estimate. Provider usage is retained when returned.

The estimate is not a hard dollar cap. Actual token prices, cached-input prices, model output size, billing rules and subscription charges can differ. Configure provider-side spending limits and reconcile real invoices. The pipeline does not guarantee cache persistence if the process crashes before its final save.

For a hypothetical batch of N eligible accounts, a basic estimate is:

`N × Jev estimate + N × generation share × chosen generation estimate`.

The dashboard cost planner lets you compare a whole-list strong-model assumption with a routed subset assumption. It is illustrative and is not the exact billing simulator for every CLI path. Its savings percentage must never be presented as measured savings.

A strong model can help author strategy and review fixtures once, while smaller models run the resulting instructions repeatedly. This only saves money if quality remains adequate. Compare reviewer correction rate and total accepted-brief cost before switching models; prompt reuse alone does not prove equivalent quality.
