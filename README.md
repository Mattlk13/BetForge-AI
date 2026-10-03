# BetForge AI

**Forge smarter decisions from the market.**

BetForge AI is a sports intelligence and betting-analysis application. The MVP provides sportsbook-style market research, odds comparison, AI-assisted matchup analysis, deterministic EV/parlay calculations, bet tracking, paper betting, bankroll analytics, and alert configuration.

## Important
BetForge AI does **not** accept or custody real-money wagers. Demo odds in this repository are mock data until licensed data providers are connected.

## MVP modules
- Dashboard
- Games & matchup detail
- Multi-book odds comparison
- AI Analyst
- +EV scanner
- Arbitrage scanner
- Parlay calculator
- Bet Tracker
- Paper Bets
- Bankroll analytics
- Alerts
- Responsible Play / legal disclaimers

## Stack
React + TypeScript + Vite. The data/provider layer is intentionally separated so mock providers can later be replaced by licensed odds, scores, news, and AI services.

## Local development
```bash
npm install
npm run dev
```

## Production roadmap
1. Licensed sports/odds provider integration
2. Authentication + database
3. Persistent tracked bets and paper bankrolls
4. AI analysis service with source-grounded outputs
5. Notification/alert workers
6. Compliance/legal review before monetized sportsbook integrations
