export const onRequestGet = async (context: any) => {
  const env = context.env ?? {};
  const configuredProviders = [
    env.ODDS_API_KEY ? "odds-api" : null,
    env.SPORTSGAMEODDS_KEY ? "sportsgameodds" : null,
  ].filter(Boolean);

  return Response.json({
    service: "betforge-ai",
    status: "ok",
    mode: configuredProviders.length ? "provider-ready" : "demo",
    providersConfigured: configuredProviders,
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
