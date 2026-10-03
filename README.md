# BetForge AI

**Forge smarter decisions from the market.**

BetForge AI is a sports **decision-intelligence** platform. It focuses on price shopping, explainable probability/EV analysis, line movement, closing-line value, disciplined bankroll diagnostics, paper betting, and alerts.

BetForge does **not** accept or custody real-money wagers.

## Current architecture
- React + TypeScript + Vite frontend
- Cloudflare Pages deployment
- Cloudflare Pages Functions middleware/API
- provider-neutral sports-data interfaces
- deterministic mock provider for development
- tested odds-math core
- ForgeScore decision-quality model
- GitHub Actions verification gates

## Implemented analytics core
- American ↔ decimal conversions
- implied probability
- expected value
- parlay pricing
- market overround
- multiplicative/additive/power devig
- Kelly and fractional-Kelly diagnostics
- arbitrage detection/stake allocation
- probability and percentage CLV
- ForgeScore v1

## Provider strategy
Production data is deliberately isolated behind `OddsProvider`, `ScoresProvider`, `NewsProvider`, and `AnalysisProvider` contracts.

Current research favors testing at least two server-side provider paths before selecting a primary feed. See:
- `src/providers/README.md`
- `docs/OPEN_SOURCE_RESEARCH.md`
- `THIRD_PARTY_NOTICES.md`

Provider credentials must remain server-side.

## Cloudflare
Production project: `betforge-ai`

Expected Pages configuration:
- branch: `main`
- root: repository root
- build: `npm run build`
- output: `dist`

`/api/health` reports runtime mode and configured provider names without disclosing credentials.

## Local development
```bash
npm install
npm run typecheck
npm test
npm run dev
```

## Security boundary
PBN is a separate project. BetForge mirrors proven security/deployment patterns but does not share PBN code, databases, bindings, or production runtime state. See `SECURITY.md`.

## Next production milestones
1. green Cloudflare deployment with Pages Functions
2. dedicated BetForge Cloudflare credentials / environment isolation
3. first licensed live-odds provider
4. D1 journal and immutable odds-observation schema
5. alert pipeline and line-history persistence
6. authenticated user profiles and paper bankrolls
7. source-grounded AI Analyst
8. provider/data-rights and jurisdictional review before monetization
