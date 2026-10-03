PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS betforge_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS odds_observations (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  bookmaker TEXT NOT NULL,
  event_id TEXT NOT NULL,
  sport TEXT NOT NULL,
  market TEXT NOT NULL,
  selection TEXT NOT NULL,
  line REAL,
  american_odds INTEGER NOT NULL,
  observed_at TEXT NOT NULL,
  raw_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_odds_event_market_time
ON odds_observations(event_id, market, observed_at);

CREATE TABLE IF NOT EXISTS tracked_bets (
  id TEXT PRIMARY KEY,
  owner_ref TEXT NOT NULL,
  event_id TEXT NOT NULL,
  sport TEXT NOT NULL,
  market TEXT NOT NULL,
  selection TEXT NOT NULL,
  line REAL,
  american_odds INTEGER NOT NULL,
  stake_cents INTEGER NOT NULL CHECK(stake_cents >= 0),
  sportsbook TEXT,
  status TEXT NOT NULL CHECK(status IN ('paper_open','paper_won','paper_lost','paper_push','paper_void')),
  placed_at TEXT NOT NULL,
  settled_at TEXT,
  closing_fair_probability REAL,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_tracked_bets_owner_placed
ON tracked_bets(owner_ref, placed_at);

CREATE TABLE IF NOT EXISTS bet_journal_events (
  id TEXT PRIMARY KEY,
  bet_id TEXT NOT NULL,
  owner_ref TEXT NOT NULL,
  event_type TEXT NOT NULL,
  body_json TEXT NOT NULL,
  recorded_at TEXT NOT NULL,
  FOREIGN KEY(bet_id) REFERENCES tracked_bets(id)
);

CREATE INDEX IF NOT EXISTS idx_bet_journal_bet_time
ON bet_journal_events(bet_id, recorded_at);

CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  owner_ref TEXT NOT NULL,
  kind TEXT NOT NULL,
  event_id TEXT,
  market TEXT,
  selection TEXT,
  threshold_json TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1 CHECK(enabled IN (0,1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bankroll_settings (
  owner_ref TEXT PRIMARY KEY,
  virtual_bankroll_cents INTEGER NOT NULL DEFAULT 100000,
  base_unit_bps INTEGER NOT NULL DEFAULT 100,
  max_single_risk_bps INTEGER NOT NULL DEFAULT 250,
  max_daily_exposure_bps INTEGER NOT NULL DEFAULT 500,
  updated_at TEXT NOT NULL
);

INSERT OR IGNORE INTO betforge_meta(key,value,updated_at)
VALUES ('schema_version','1',datetime('now'));
