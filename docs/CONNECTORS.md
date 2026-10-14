# Source and model contracts

These implementations follow the linked official interfaces. Mocked tests verify request construction and parsing; they do not prove access to a user's account, current plan entitlements or all possible response variants.

| Provider | Implemented request | Official documentation |
|---|---|---|
| HubSpot | `GET /crm/v3/objects/contacts`; bearer token; limit/after pagination | [Contacts](https://developers.hubspot.com/docs/api-reference/crm-contacts-v3/guide) |
| Smartlead | `GET /api/v1/campaigns/{campaign_id}/leads/{lead_id}/message-history`; API key query parameter | [Full API](https://helpcenter.smartlead.ai/en/articles/125-full-api-documentation) |
| Apollo | `POST /api/v1/people/match`; `x-api-key`; email input, personal-email and phone reveal disabled | [People enrichment](https://docs.apollo.io/reference/people-enrichment) |
| Sheets | `GET /v4/spreadsheets/{id}/values/{range}`; bearer token | [Values get](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/get) |
| Calendar | `GET /calendar/v3/calendars/{id}/events`; bounded time range; bearer token | [Events list](https://developers.google.com/workspace/calendar/api/v3/reference/events/list) |
| Jev / Typesafe | `POST https://api.typesafe.ai/v1/systemone`; bearer token; state and choice questions | [Quickstart](https://docs.typesafe.ai/introduction/quickstart) |
| Gemini | `POST /v1beta/models/{model}:generateContent`; `x-goog-api-key`; JSON response MIME type | [Generate content](https://ai.google.dev/api/generate-content) |
| Claude | `POST /v1/messages`; `x-api-key`; `anthropic-version: 2023-06-01` | [API overview](https://platform.claude.com/docs/en/api/overview) |

SalesRobot's [API overview](https://salesrobot.crisp.help/en/article/using-salesrobot-apis-twsjff/) does not justify inventing a generic full-inbox REST reader. Use a reviewed export or authorised MCP snapshot, then map its actual fields. Check pagination, archived conversations and sync windows. Clay exports follow the same explicit process; HTTP integration features should not be presented as a universal Clay account API.

All HTTP calls use a timeout, reject redirects and avoid automatic retries. Errors omit URLs and bodies to avoid exposing Smartlead query-string keys or message content. Private outputs still contain data and are not encrypted by this prototype.

Jev responses must contain a permitted choice and confidence between zero and one. Generation responses must parse as JSON. Brief claims require known evidence keys and exact quoted substrings. Summary text and the meaning of claims still need human review; exact quotation is not entailment validation.

HubSpot version note: this prototype explicitly targets the legacy v3 contacts interface. HubSpot has introduced date-based APIs; its [versioning guide](https://developers.hubspot.com/docs/developer-tooling/platform/versioning) currently lists legacy endpoints as supported. Review migration guidance before production deployment.
