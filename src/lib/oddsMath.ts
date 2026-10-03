export type AmericanOdds = number;

function finite(value: number, label: string) {
  if (!Number.isFinite(value)) throw new Error(`${label} must be finite`);
  return value;
}

export function validateAmerican(odds: AmericanOdds): AmericanOdds {
  finite(odds, "American odds");
  if (!Number.isInteger(odds) || Math.abs(odds) < 100) {
    throw new Error("American odds must be an integer with magnitude >= 100");
  }
  return odds === -100 ? 100 : odds;
}

export function americanToDecimal(odds: AmericanOdds): number {
  const a = validateAmerican(odds);
  return a > 0 ? 1 + a / 100 : 1 + 100 / -a;
}

export function decimalToAmerican(decimal: number): AmericanOdds {
  finite(decimal, "Decimal odds");
  if (decimal <= 1) throw new Error("Decimal odds must be > 1");
  const raw = decimal >= 2 ? (decimal - 1) * 100 : -100 / (decimal - 1);
  const rounded = Math.round(raw);
  return rounded === -100 ? 100 : rounded;
}

export function impliedProbability(odds: AmericanOdds): number {
  return 1 / americanToDecimal(odds);
}

export function expectedValue(probability: number, odds: AmericanOdds, stake = 100): number {
  if (!(probability >= 0 && probability <= 1)) throw new Error("Probability must be in [0,1]");
  if (!(stake >= 0) || !Number.isFinite(stake)) throw new Error("Stake must be non-negative");
  const decimal = americanToDecimal(odds);
  return probability * stake * (decimal - 1) - (1 - probability) * stake;
}

export function expectedValuePercent(probability: number, odds: AmericanOdds): number {
  return expectedValue(probability, odds, 100);
}

export function kellyFraction(probability: number, odds: AmericanOdds): number {
  if (!(probability >= 0 && probability <= 1)) throw new Error("Probability must be in [0,1]");
  const b = americanToDecimal(odds) - 1;
  const q = 1 - probability;
  return Math.max(0, (b * probability - q) / b);
}

export function fractionalKelly(probability: number, odds: AmericanOdds, fraction = 0.25): number {
  if (!(fraction >= 0 && fraction <= 1)) throw new Error("Kelly fraction multiplier must be in [0,1]");
  return kellyFraction(probability, odds) * fraction;
}

export function parlayDecimal(legs: AmericanOdds[]): number {
  if (!legs.length) throw new Error("At least one leg is required");
  return legs.reduce((acc, odds) => acc * americanToDecimal(odds), 1);
}

export function parlayAmerican(legs: AmericanOdds[]): AmericanOdds {
  return decimalToAmerican(parlayDecimal(legs));
}

export function overround(odds: AmericanOdds[]): number {
  if (odds.length < 2) throw new Error("At least two outcomes are required");
  return odds.reduce((sum, price) => sum + impliedProbability(price), 0);
}

export function devigMultiplicative(odds: AmericanOdds[]): number[] {
  const raw = odds.map(impliedProbability);
  const total = raw.reduce((a, b) => a + b, 0);
  if (!(total > 0)) throw new Error("Market probability sum must be positive");
  return raw.map(p => p / total);
}

export function devigAdditive(odds: AmericanOdds[]): number[] {
  const raw = odds.map(impliedProbability);
  const excess = raw.reduce((a, b) => a + b, 0) - 1;
  const adjusted = raw.map(p => p - excess / raw.length);
  if (adjusted.some(p => p <= 0)) return devigMultiplicative(odds);
  const total = adjusted.reduce((a, b) => a + b, 0);
  return adjusted.map(p => p / total);
}

export function devigPower(odds: AmericanOdds[]): number[] {
  const raw = odds.map(impliedProbability);
  let lo = 0.01;
  let hi = 10;
  for (let i = 0; i < 100; i++) {
    const k = (lo + hi) / 2;
    const sum = raw.reduce((s, p) => s + Math.pow(p, k), 0);
    if (sum > 1) lo = k;
    else hi = k;
  }
  const k = (lo + hi) / 2;
  const adjusted = raw.map(p => Math.pow(p, k));
  const total = adjusted.reduce((a, b) => a + b, 0);
  return adjusted.map(p => p / total);
}

export function probabilityCLV(takenFairProbability: number, closingFairProbability: number): number {
  if (![takenFairProbability, closingFairProbability].every(p => p >= 0 && p <= 1 && Number.isFinite(p))) {
    throw new Error("Fair probabilities must be finite and in [0,1]");
  }
  return closingFairProbability - takenFairProbability;
}

export function percentCLVFromFairProbabilities(takenFairProbability: number, closingFairProbability: number): number {
  if (!(takenFairProbability > 0 && takenFairProbability < 1 && closingFairProbability > 0 && closingFairProbability < 1)) {
    throw new Error("Fair probabilities must be strictly between 0 and 1");
  }
  const takenPrice = 1 / takenFairProbability;
  const closingPrice = 1 / closingFairProbability;
  return (takenPrice / closingPrice - 1) * 100;
}

export type ArbitrageOutcome = { label: string; odds: AmericanOdds };

export function arbitrage(outcomes: ArbitrageOutcome[], totalStake = 100) {
  if (outcomes.length < 2) throw new Error("At least two outcomes are required");
  if (!(totalStake > 0) || !Number.isFinite(totalStake)) throw new Error("Total stake must be positive");
  const implied = outcomes.map(o => impliedProbability(o.odds));
  const book = implied.reduce((a, b) => a + b, 0);
  const isArbitrage = book < 1;
  const targetPayout = isArbitrage ? totalStake / book : 0;
  const stakes = outcomes.map((outcome, i) => ({
    ...outcome,
    stake: isArbitrage ? targetPayout / americanToDecimal(outcome.odds) : 0,
  }));
  return {
    isArbitrage,
    impliedTotal: book,
    profitPercent: isArbitrage ? (1 / book - 1) * 100 : 0,
    targetPayout,
    stakes,
  };
}
