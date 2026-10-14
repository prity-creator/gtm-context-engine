# Setup and first useful run

## Offline demo

Install Node.js 22+ from the official Node.js distribution. Clone/download this repository, open a terminal in it, and run `npm start`. Visit http://127.0.0.1:4174. If local serving is unavailable, open `index.html` directly. No package installation, API subscription or credentials are required.

```sh
npm test
npm run build
node src/cli.mjs analyze data/demo.json
```

The fixture uses a fixed snapshot timestamp for reproducibility; it is not a live account feed. Import a dataset JSON in the dashboard to review your own snapshot. Data stays in that browser session; refresh clears it. Downloads may contain contact information—keep them private.

## Configure optional connectors

```sh
cp .env.example .env
node --env-file=.env src/cli.mjs check
```

Edit `.env` locally. Never paste API credentials into the hosted demo, commit them, or include them in screenshots. `check` reports whether variables exist; it does not authenticate them.

| Variables | Where to configure |
|---|---|
| `HUBSPOT_ACCESS_TOKEN` | HubSpot private app or OAuth token with contacts read scope; verify the account allows the CRM contacts endpoint |
| `SMARTLEAD_API_KEY` | Smartlead account API settings; obtain the campaign and lead IDs for the specific history to read |
| `APOLLO_API_KEY` | Apollo API settings; confirm plan access and credit consumption before enrichment |
| `GOOGLE_ACCESS_TOKEN` | Google OAuth access token scoped to the APIs below; short-lived, manually refreshed in this prototype |
| `TYPESAFE_API_KEY`, `JEV_MODEL` | Jev/Typesafe account; default alias is `jev-latest`, override if your account uses a different model |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | Google AI Studio; select a currently available model for your key |
| `ANTHROPIC_API_KEY`, `CLAUDE_MODEL` | Anthropic Console; select a currently available model for your key |

For Google: create/select a Google Cloud project, enable the Google Sheets API and Google Calendar API, configure OAuth consent and a client for your environment, and obtain an access token using Google's OAuth flow. Requested read scopes are `https://www.googleapis.com/auth/spreadsheets.readonly` and `https://www.googleapis.com/auth/calendar.events.readonly`. The token's user must have access to the requested sheet/calendar. This project does not implement token refresh or a hosted OAuth callback. Follow [Google's OAuth guide](https://developers.google.com/identity/protocols/oauth2) for your deployment type.

## Pull only the records you need

Replace uppercase placeholders with real IDs. These commands make external requests and save responses under git-ignored `private/`.

```sh
node --env-file=.env src/cli.mjs pull hubspot --allow-external
node --env-file=.env src/cli.mjs pull smartlead CAMPAIGN_ID LEAD_ID --allow-external
node --env-file=.env src/cli.mjs pull sheets SHEET_ID 'Sheet1!A1:H100' --allow-external
node --env-file=.env src/cli.mjs pull calendar primary '2026-10-01T00:00:00Z' '2026-11-01T00:00:00Z' --allow-external
node --env-file=.env src/cli.mjs enrich person@example.com --allow-paid
```

Use the enrichment command only with an appropriate business email, not the example. Source readers are bounded: HubSpot defaults to three 100-contact pages; Calendar reads at most one 250-event page and flags further pages. Smartlead history is scoped to one campaign/lead. A successful request does not mean account context is complete.

## Normalise and review source data

Start with the structure in `data/demo.json` and the contract in `schemas/dataset.schema.json`. Build account/contact IDs deliberately; do not merge by display name. Accounts and role confirmations need operator review. A CRM stage or job title does not prove buying authority.

For a generic message export, adapt `workflows/export-mapping.json` to the actual response fields, then run:

```sh
node src/cli.mjs map private/export.json workflows/export-mapping.json private/dataset.json
```

The output contains `events` and `rejected` rows. Merge accepted events into your dataset after checking timestamps and source IDs. The mapper does not transform CRM contacts or calendar bookings automatically. Review those records into the dataset structure. Mark coverage complete only after verifying the relevant scope and pagination. Explicitly record each channel, even when there is verified zero activity. Save the final dataset under `private/` and run:

```sh
node src/cli.mjs analyze private/dataset.json playbooks/default.json
```

SalesRobot inbox exports/MCP snapshots and Clay exports use this same explicit mapping process. There is no live SalesRobot or Clay account connector in this release.

## Optional paid model run

Review `playbooks/default.json`: request cap, input-size cap, estimated per-call costs, confidence threshold and run estimate. Put your own current cost assumptions in a private copy. The default amounts are illustrative, not price quotes or billing caps.

```sh
node --env-file=.env src/cli.mjs live private/dataset.json --allow-external --policy playbooks/default.json
# Alternatively select Claude for brief generation / low-confidence escalation:
node --env-file=.env src/cli.mjs live private/dataset.json --allow-external --claude --policy playbooks/default.json
```

Default live mode uses Jev, then Gemini for eligible decisions. `--claude` uses Jev, then Claude, including low-confidence escalations. This is an explicit provider choice, not automatic training of a smaller model. Blocked accounts remain code-only. Results and model cache are saved in `private/`. Contact email/profile fields are removed from model context, but names and message text remain; review what you send to each provider.

The cache is trusted local data, not a signed audit store. Remove the private cache file when you intentionally need fresh inference. Source snapshot changes normally invalidate the content-based key. Configure provider-side spending controls separately. No send command exists.

## Troubleshooting

- Missing configuration: set the named variable in `.env` and use Node's `--env-file=.env` flag.
- HTTP 401/403: privately check token expiry, account permissions and API plan access.
- HTTP 429: wait per the provider's instructions; this project deliberately does not retry paid requests automatically.
- `verify_coverage`: review completeness and timestamps for all four source channels.
- `review_identity`: resolve duplicate canonical email/profile identities in source data; do not silently merge.
- `review_commitment`: provide explicit timing and matching evidence, including fulfillment evidence where applicable.
