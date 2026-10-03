# BetForge Cloudflare architecture

## Isolation rule
BetForge and PBN are separate security domains. BetForge mirrors proven patterns but never reads PBN databases, secrets, bindings or application state.

## Pages
- project: `betforge-ai`
- production branch: `main`
- build command: `npm run build`
- output: `dist`
- Pages Functions: `functions/**`

## Planned / provisioned bindings
- `BETFORGE_DB`: dedicated D1 database
- `BETFORGE_ALLOWED_ORIGINS`: exact browser origin allowlist
- `BETFORGE_DURABLE_WRITES`: defaults false
- `ODDS_PROVIDER`: mock until live provider terms/credentials are approved
- provider API keys: server-side secrets only

## Authentication model
The protected API verifier supports either:
- normal Authorization Bearer JWT; or
- Cloudflare Access `Cf-Access-Jwt-Assertion`.

Required configuration:
- `BETFORGE_AUTH_ISSUER`
- `BETFORGE_AUTH_AUDIENCE`
- `BETFORGE_AUTH_JWKS_URL`

Until those exist, protected routes fail closed with 503.

## D1 data model
The initial schema stores:
- immutable odds observations;
- tracked paper bets;
- append-only journal events;
- alert definitions;
- bankroll settings.

No payment, deposit, withdrawal or real-money wagering tables exist.
