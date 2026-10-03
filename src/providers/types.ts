export type SportKey = "NFL" | "NBA" | "MLB" | "NHL" | "NCAAF" | "NCAAB" | string;

export interface PriceQuote {
  bookmaker: string;
  market: "moneyline" | "spread" | "total" | "prop";
  selection: string;
  line?: number;
  americanOdds: number;
  observedAt: string;
}

export interface SportsEvent {
  id: string;
  sport: SportKey;
  league: string;
  startsAt: string;
  home: string;
  away: string;
  status: "scheduled" | "live" | "final";
  quotes: PriceQuote[];
}

export interface OddsProvider {
  readonly name: string;
  listEvents(input?: { sport?: SportKey; from?: string; to?: string }): Promise<SportsEvent[]>;
}

export interface ScoresProvider {
  readonly name: string;
  listScores(input?: { sport?: SportKey; date?: string }): Promise<Array<{
    eventId: string;
    homeScore: number | null;
    awayScore: number | null;
    status: string;
  }>>;
}

export interface NewsProvider {
  readonly name: string;
  listNews(input: { eventId?: string; team?: string; sport?: SportKey }): Promise<Array<{
    id: string;
    headline: string;
    source: string;
    publishedAt: string;
    url?: string;
  }>>;
}

export interface AnalysisProvider {
  readonly name: string;
  analyze(input: {
    event: SportsEvent;
    market: string;
    selection: string;
    modelProbability?: number;
  }): Promise<{
    modelProbability: number;
    confidenceLow: number;
    confidenceHigh: number;
    support: string[];
    counterFactors: string[];
    missingData: string[];
  }>;
}
