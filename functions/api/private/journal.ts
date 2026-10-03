import { authenticate } from "../../lib/auth";

type Env = {
  BETFORGE_DB?: D1Database;
  BETFORGE_DURABLE_WRITES?: string;
  BETFORGE_AUTH_ISSUER?: string;
  BETFORGE_AUTH_AUDIENCE?: string;
  BETFORGE_AUTH_JWKS_URL?: string;
};

function requireDb(env: Env): D1Database {
  if (!env.BETFORGE_DB) {
    throw new Response(JSON.stringify({ error: { code: "STORAGE_NOT_CONFIGURED", message: "BetForge storage is not configured." } }), {
      status: 503,
      headers: { "content-type": "application/json" },
    });
  }
  return env.BETFORGE_DB;
}

function boundedText(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export const onRequestGet = async (context: any) => {
  const actor = await authenticate(context.request, context.env);
  const db = requireDb(context.env);

  const rows = await db.prepare(
    `SELECT id,event_id,sport,market,selection,line,american_odds,stake_cents,sportsbook,status,placed_at,settled_at,closing_fair_probability,notes
     FROM tracked_bets
     WHERE owner_ref=?
     ORDER BY placed_at DESC
     LIMIT 100`
  ).bind(actor.subject).all();

  return Response.json({ data: rows.results ?? [] });
};

export const onRequestPost = async (context: any) => {
  const actor = await authenticate(context.request, context.env);
  const db = requireDb(context.env);

  if (context.env.BETFORGE_DURABLE_WRITES !== "true") {
    throw new Response(JSON.stringify({ error: { code: "DURABLE_WRITES_GATED", message: "Paper-bet writes are currently disabled." } }), {
      status: 503,
      headers: { "content-type": "application/json" },
    });
  }

  const body = await context.request.json();
  const eventId = boundedText(body.eventId, 160);
  const sport = boundedText(body.sport, 32);
  const market = boundedText(body.market, 64);
  const selection = boundedText(body.selection, 160);
  const sportsbook = boundedText(body.sportsbook, 80);
  const notes = boundedText(body.notes, 1000);
  const americanOdds = Number(body.americanOdds);
  const stakeCents = Number(body.stakeCents);
  const line = body.line == null ? null : Number(body.line);

  if (!eventId || !sport || !market || !selection) {
    return Response.json({ error: { code: "INVALID_INPUT", message: "Event, sport, market and selection are required." } }, { status: 400 });
  }
  if (!Number.isInteger(americanOdds) || Math.abs(americanOdds) < 100) {
    return Response.json({ error: { code: "INVALID_ODDS", message: "American odds are invalid." } }, { status: 400 });
  }
  if (!Number.isInteger(stakeCents) || stakeCents < 0 || stakeCents > 100_000_000) {
    return Response.json({ error: { code: "INVALID_STAKE", message: "Paper stake is invalid." } }, { status: 400 });
  }
  if (line !== null && !Number.isFinite(line)) {
    return Response.json({ error: { code: "INVALID_LINE", message: "Market line is invalid." } }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const eventIdJournal = crypto.randomUUID();
  const placedAt = new Date().toISOString();
  const eventBody = JSON.stringify({
    action: "paper_bet_created",
    eventId,
    sport,
    market,
    selection,
    line,
    americanOdds,
    stakeCents,
    sportsbook,
  });

  await db.batch([
    db.prepare(
      `INSERT INTO tracked_bets
       (id,owner_ref,event_id,sport,market,selection,line,american_odds,stake_cents,sportsbook,status,placed_at,notes)
       VALUES (?,?,?,?,?,?,?,?,?,?, 'paper_open', ?, ?)`
    ).bind(id, actor.subject, eventId, sport, market, selection, line, americanOdds, stakeCents, sportsbook || null, placedAt, notes || null),
    db.prepare(
      `INSERT INTO bet_journal_events
       (id,bet_id,owner_ref,event_type,body_json,recorded_at)
       VALUES (?,?,?,?,?,?)`
    ).bind(eventIdJournal, id, actor.subject, "paper_bet_created", eventBody, placedAt),
  ]);

  return Response.json({ data: { id, status: "paper_open", placedAt } }, { status: 201 });
};
