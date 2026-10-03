# BetForge data-source research

Updated: 2026-10-03

## Live odds / market data
Production odds should be accessed through licensed or explicitly permitted provider APIs and kept behind BetForge provider adapters.

### Primary candidates
- **SportsGameOdds TypeScript SDK** — Apache-2.0 SDK; REST and streaming patterns; strong fit for TypeScript/Cloudflare server-side adapters.
- **odds-api/odds-api** — Apache-2.0 toolkit; useful OpenAPI contract, mock mode, best-odds, +EV, arbitrage and line-movement helpers.
- **odds-api-io/odds-api-node** — TypeScript-oriented candidate with broad bookmaker coverage; commercial data terms still need review.
- **PropLine** — candidate for player-prop data; commercial/API terms apply.

## Historical / model-feature data

### NFL
- **nflverse / nflfastR** — MIT software ecosystem with rich play-by-play and modeling data. The separate nflverse-data datasets use CC BY 4.0 and require attribution. Useful for feature engineering and historical validation, not as an odds source.

### Multi-sport
- **sportsdataverse-js / sportsdataverse-py** — MIT sports-data tooling spanning major leagues and college sports. Useful for schedule/stats adapters where upstream data terms permit.

### NHL
- **coreyjs/nhl-api-py** — Apache-2.0 wrapper around NHL endpoints. Good research reference for NHL structure; upstream NHL API terms/availability must still be respected.

## News, injury and weather evidence
These should remain source-attributed and timestamped. BetForge's AI layer should store the evidence timestamp/source separately from model output so old injury/news context is never silently represented as current.

## Selection rule
A provider can be promoted to production only after:
1. license/API terms and commercial display/redistribution rights are reviewed;
2. rate limits and caching rules are known;
3. source timestamps and identifiers can be preserved;
4. server-side credential handling is supported;
5. the provider can be reconciled against at least one alternate source for data-quality monitoring.

## No-scraping default
BetForge should prefer documented APIs and permissively licensed datasets. Scraping sportsbook consumer pages is not the default architecture because terms, anti-bot controls, data rights, and reliability make it a poor production dependency.
