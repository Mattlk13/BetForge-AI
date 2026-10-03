# Third-party research and notices

BetForge AI uses original TypeScript implementation plus open-source research.

## Integrated concepts
- **Sharpline** — MIT, Andrew Pleeter (2026). BetForge's odds-math architecture was informed by Sharpline's emphasis on canonical odds conversion, devigging, EV, Kelly sizing, and like-for-like CLV validation. BetForge implementation is TypeScript and is not a verbatim copy.
- **kelly-criterion** — MIT, Kirk Lin. Used as an independent reference for Kelly sizing behavior.
- **odds-api/odds-api** — Apache-2.0. Candidate provider integration; its OpenAPI/SDK architecture, mock-mode idea and best-odds/+EV/line-movement workflows informed BetForge's provider abstraction.
- **SportsGameOdds sports-odds-api-typescript** — Apache-2.0. Candidate live-data provider and WebSocket integration path.
- **quant-edge-tracker** — MIT, Evan Stack (2026). Research reference for bet-journal, bankroll-ledger and CLV-oriented product architecture.
- **AlexBET Lite** — MIT (2026). Research reference for market-mover, alert and sports-intelligence workflow design.

Commercial API access and data redistribution/display rights remain governed by each provider's separate terms. An open-source SDK license does not itself grant rights to redistribute proprietary sports data.
