function httpsUrl(value?: string): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.hash;
  } catch {
    return false;
  }
}

export const onRequestGet = async (context: any) => {
  const env = context.env ?? {};
  const configuredProviders = [
    env.ODDS_API_KEY ? "odds-api" : null,
    env.SPORTSGAMEODDS_KEY ? "sportsgameodds" : null,
  ].filter(Boolean);

  let storage = false;
  let schema = false;
  if (env.BETFORGE_DB) {
    try {
      storage = !!(await env.BETFORGE_DB.prepare("SELECT 1 AS ok").first());
      const version = await env.BETFORGE_DB
        .prepare("SELECT value FROM betforge_meta WHERE key='schema_version'")
        .first();
      await env.BETFORGE_DB.prepare(
        "SELECT provider,bookmaker,event_id,market,selection,american_odds,observed_at FROM odds_observations LIMIT 0"
      ).all();
      await env.BETFORGE_DB.prepare(
        "SELECT owner_ref,event_id,market,selection,american_odds,stake_cents,status,placed_at FROM tracked_bets LIMIT 0"
      ).all();
      schema = !!version;
    } catch {
      schema = false;
    }
  }

  const authConfigured =
    httpsUrl(env.BETFORGE_AUTH_ISSUER) &&
    httpsUrl(env.BETFORGE_AUTH_JWKS_URL) &&
    !!env.BETFORGE_AUTH_AUDIENCE?.trim();

  const durableWrites =
    storage &&
    schema &&
    authConfigured &&
    env.BETFORGE_DURABLE_WRITES === "true";

  return Response.json({
    service: "betforge-ai",
    status: storage && schema ? "ready" : "demo",
    verification: "configuration_only",
    dataMode: configuredProviders.length ? "provider-ready" : "mock",
    providersConfigured: configuredProviders,
    checks: {
      storage,
      schema,
      authConfiguration: authConfigured,
    },
    durableWrites,
    capabilities: {
      realMoneyWagering: false,
      custody: false,
      paperBetting: true,
      oddsAnalytics: true,
      forgeScore: true,
    },
    timestamp: new Date().toISOString(),
  });
};
