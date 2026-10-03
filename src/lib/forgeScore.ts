export interface ForgeScoreInput {
  edgePercent: number;
  priceQuality: number;
  dataQuality: number;
  marketStability: number;
  uncertainty: number;
  bankrollRisk: number;
  correlationRisk: number;
}

export interface ForgeScoreResult {
  score: number;
  components: Record<string, number>;
  flags: string[];
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0));

export function forgeScore(input: ForgeScoreInput): ForgeScoreResult {
  const edge = clamp01((input.edgePercent + 2) / 12);
  const price = clamp01(input.priceQuality);
  const data = clamp01(input.dataQuality);
  const stability = clamp01(input.marketStability);
  const uncertaintyPenalty = clamp01(input.uncertainty);
  const bankrollPenalty = clamp01(input.bankrollRisk);
  const correlationPenalty = clamp01(input.correlationRisk);

  const raw =
    edge * 0.30 +
    price * 0.20 +
    data * 0.20 +
    stability * 0.10 +
    (1 - uncertaintyPenalty) * 0.10 +
    (1 - bankrollPenalty) * 0.06 +
    (1 - correlationPenalty) * 0.04;

  const flags: string[] = [];
  if (input.dataQuality < 0.6) flags.push("LOW_DATA_QUALITY");
  if (input.uncertainty > 0.6) flags.push("HIGH_UNCERTAINTY");
  if (input.bankrollRisk > 0.5) flags.push("BANKROLL_EXPOSURE");
  if (input.correlationRisk > 0.5) flags.push("CORRELATION_RISK");
  if (input.edgePercent <= 0) flags.push("NO_MODELED_EDGE");

  let score = Math.round(raw * 100);
  if (flags.includes("LOW_DATA_QUALITY")) score = Math.min(score, 69);
  if (flags.includes("HIGH_UNCERTAINTY")) score = Math.min(score, 64);
  if (flags.includes("BANKROLL_EXPOSURE")) score = Math.min(score, 59);
  if (flags.includes("NO_MODELED_EDGE")) score = Math.min(score, 49);

  return {
    score,
    components: {
      edge: Math.round(edge * 100),
      priceQuality: Math.round(price * 100),
      dataQuality: Math.round(data * 100),
      marketStability: Math.round(stability * 100),
      uncertaintySafety: Math.round((1 - uncertaintyPenalty) * 100),
      bankrollSafety: Math.round((1 - bankrollPenalty) * 100),
      correlationSafety: Math.round((1 - correlationPenalty) * 100),
    },
    flags,
  };
}
