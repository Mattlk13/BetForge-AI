# BetForge AI open-source and architecture research

Updated: 2026-10-03

## Executive direction
BetForge should not become a generic sportsbook clone. The strongest architecture is a provider-neutral **decision-intelligence system** centered on price quality, fair probability, uncertainty, process tracking, CLV and bankroll risk.

## Highest-value external projects

### Sharpline — MIT
Production-shaped play-money sports-odds platform. Particularly strong:
- canonical odds value types and conversion;
- multiple devig methods;
- EV and fractional Kelly;
- strict CLV semantics;
- time-series line history;
- quote validation and line-mismatch handling.

**Integrate:** math principles, like-for-like CLV validation, immutable price-history model.
**Do not clone:** Kafka/Postgres/Redis operational complexity for the current MVP.

### odds-api/odds-api — Apache-2.0
Agent-friendly odds toolkit with:
- OpenAPI contract;
- TypeScript SDK;
- mock mode;
- best-odds comparison;
- arbitrage;
- positive-EV helpers;
- line movement.

**Integrate:** provider adapter target and development mock philosophy.
**Gate:** API/data terms must be reviewed before public redistribution.

### SportsGameOdds TypeScript SDK — Apache-2.0
Strong candidate for a live provider:
- server-side TypeScript client;
- broad sports/market coverage;
- WebSocket path for higher tiers;
- reference line-movement/arbitrage examples.

**Integrate:** optional provider adapter after API credentials/terms are approved.

### quant-edge-tracker — MIT
Useful architecture reference for:
- bet journal;
- bankroll ledger;
- CLV tracking;
- line shopping;
- separating business logic from UI.

**Integrate:** append-oriented journal model and process analytics concepts.

### AlexBET Lite — MIT
Useful product reference for:
- line movement;
- market movers;
- injury/news intelligence;
- Kelly/bankroll tools;
- alert-oriented UX.

**Integrate:** alert taxonomy and market-mover surfaces.

### kelly-criterion — MIT
Small TypeScript reference implementation.

**Integrate:** cross-check BetForge's Kelly math; BetForge keeps its own validated implementation.

## User-owned repositories reviewed

### PBN
Reusable *patterns*, not dependencies:
- JWT/JWKS validation;
- Cloudflare Access assertion support;
- exact origin allowlists;
- payload-size limits;
- correlation IDs;
- strict security headers;
- readiness probes;
- D1-backed actor/role provisioning;
- least-privilege GitHub Actions.

PBN remains isolated and unchanged. BetForge receives its own configuration and credentials.

### FieldProof-JobMargin
Reusable patterns:
- production deployment approval gates;
- npm audit/typecheck/test/build sequence;
- secret separation;
- explicit security/release-gate documentation.

### PackForge
Reusable patterns:
- independent Cloudflare environment;
- project-specific D1/R2 provisioning;
- deployment evidence artifacts;
- narrow GitHub Actions permissions and concurrency control.

### AfterFormation
Current repository is too small to provide reusable implementation modules.

## BetForge target architecture

### Phase 1 — now
- Cloudflare Pages frontend
- Pages Functions security middleware
- deterministic mock provider
- typed provider interfaces
- pure odds math library
- ForgeScore v1
- tests and CI

### Phase 2 — live data
- server-only provider adapter
- normalized event/market/selection schema
- immutable odds observations
- scheduled polling or provider streaming
- best-price and movement engine
- provider-health reconciliation

### Phase 3 — persistence
Suggested Cloudflare-native components:
- D1: users, tracked bets, alerts, normalized metadata
- R2: larger research artifacts/export snapshots if needed
- Queues: ingestion/alert fan-out
- Durable Objects only if real-time coordination requires them

### Phase 4 — intelligence
- source-grounded AI analyst
- fair-probability engine
- multiple devig methods
- uncertainty bands
- ForgeScore v2 calibrated against historical process metrics
- injury/weather/news evidence with timestamps

## Important engineering rules
1. Real-money wagering and fund custody stay out of scope.
2. Every quote records provider, bookmaker and observation time.
3. Raw odds and derived fair probabilities are separate.
4. CLV is only scored like-for-like; line changes are flagged, not silently ranked.
5. Kelly is a risk-sizing diagnostic, never a guarantee.
6. Provider keys remain server-side.
7. No external repo is copied wholesale; only reviewed, compatible components or patterns are integrated.
