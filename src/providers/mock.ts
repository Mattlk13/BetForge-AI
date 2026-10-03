import type { OddsProvider, SportsEvent } from "./types";

const now = new Date().toISOString();

const MOCK_EVENTS: SportsEvent[] = [
  {
    id: "demo-nfl-kc-jax",
    sport: "NFL",
    league: "NFL",
    startsAt: "2026-10-05T19:15:00-05:00",
    home: "Jacksonville",
    away: "Kansas City",
    status: "scheduled",
    quotes: [
      { bookmaker: "DraftKings", market: "spread", selection: "Kansas City", line: -3.5, americanOdds: -110, observedAt: now },
      { bookmaker: "FanDuel", market: "spread", selection: "Kansas City", line: -3, americanOdds: -115, observedAt: now },
      { bookmaker: "BetMGM", market: "spread", selection: "Kansas City", line: -3.5, americanOdds: -105, observedAt: now },
      { bookmaker: "Caesars", market: "spread", selection: "Kansas City", line: -3.5, americanOdds: -108, observedAt: now },
    ],
  },
];

export class MockOddsProvider implements OddsProvider {
  readonly name = "mock";
  async listEvents(input?: { sport?: string }) {
    return input?.sport ? MOCK_EVENTS.filter(e => e.sport === input.sport) : MOCK_EVENTS;
  }
}
