import { describe, expect, it } from "vitest";
import {
  americanToDecimal,
  arbitrage,
  devigMultiplicative,
  expectedValue,
  fractionalKelly,
  impliedProbability,
  parlayAmerican,
  percentCLVFromFairProbabilities,
} from "./oddsMath";

describe("odds math", () => {
  it("converts American odds", () => {
    expect(americanToDecimal(-110)).toBeCloseTo(1.9090909, 6);
    expect(americanToDecimal(150)).toBeCloseTo(2.5, 6);
  });

  it("computes implied probability", () => {
    expect(impliedProbability(-110)).toBeCloseTo(0.5238095, 6);
  });

  it("devigs a two-way market to one", () => {
    const fair = devigMultiplicative([-110, -110]);
    expect(fair[0] + fair[1]).toBeCloseTo(1, 12);
    expect(fair[0]).toBeCloseTo(0.5, 12);
  });

  it("calculates positive EV", () => {
    expect(expectedValue(0.61, -105, 100)).toBeGreaterThan(0);
  });

  it("fractional Kelly never exceeds full Kelly", () => {
    expect(fractionalKelly(0.58, -110, 0.25)).toBeGreaterThanOrEqual(0);
    expect(fractionalKelly(0.58, -110, 0.25)).toBeLessThan(1);
  });

  it("prices a parlay", () => {
    expect(parlayAmerican([-110, -110])).toBeGreaterThan(200);
  });

  it("detects an arbitrage market", () => {
    const result = arbitrage([
      { label: "A", odds: 110 },
      { label: "B", odds: 110 },
    ]);
    expect(result.isArbitrage).toBe(true);
    expect(result.profitPercent).toBeGreaterThan(0);
  });

  it("computes positive CLV when closing fair probability rises", () => {
    expect(percentCLVFromFairProbabilities(0.50, 0.55)).toBeGreaterThan(0);
  });
});
