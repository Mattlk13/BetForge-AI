# BetForge provider layer

BetForge keeps sports data vendors behind provider interfaces so pricing logic, UI, journaling and risk controls do not depend on one commercial feed.

## Current state
- `MockOddsProvider` is deterministic and safe for local/demo builds.
- Production providers must be server-side so API keys never enter the browser bundle.

## Researched provider candidates
1. **odds-api/odds-api** — Apache-2.0 SDK/tooling, TypeScript SDK, mock mode, best-odds, arbitrage, +EV and line-movement helpers.
2. **SportsGameOdds TypeScript SDK** — Apache-2.0 client, broad market coverage, REST and WebSocket patterns.
3. **SharpAPI TypeScript SDK** — candidate for precomputed +EV/arbitrage/middles; license/API terms must be verified before integration.
4. **PropLine** — candidate for player-prop feeds; commercial API terms apply.

No provider is hardwired as the sole source of truth. The production design should support at least two feeds for reconciliation and failover.
