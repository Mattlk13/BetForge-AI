# BetForge AI — Product Strategy

## Positioning
BetForge AI is a **sports decision-intelligence platform**, not another picks app and not a sportsbook.

The product should answer five questions in order:

1. **What is the market offering?**
2. **Where is the best price?**
3. **What assumptions produce the model edge?**
4. **What could make that edge wrong?**
5. **Does the proposed exposure fit the user's bankroll rules?**

## Defensible product wedges

### 1. Price-First Line Shopping
Most betting interfaces encourage selection first and price second. BetForge reverses this:
- compare books and market prices before surfacing an edge;
- calculate break-even probability;
- quantify the cost of a worse line or worse juice;
- log the exact entry price for later CLV analysis.

### 2. Explainable AI, Not "AI Picks"
Every analysis should expose:
- model probability;
- market-implied probability;
- edge;
- confidence band;
- inputs and assumptions;
- supporting evidence;
- counter-factors;
- missing/stale data warnings;
- what would invalidate the thesis.

No guaranteed-win language.

### 3. Bet Journal + Process Score
Users should be able to measure whether their **decision process** is improving even during short-term variance:
- closing-line value;
- price-shopping savings;
- average stake;
- exposure concentration;
- thesis vs result;
- tagged mistake types;
- performance by sport, market and odds band.

### 4. Bankroll Guardian
Risk controls are a core feature, not a compliance footer:
- configurable unit size;
- max stake and max daily exposure;
- correlated-position warnings;
- parlay exposure visualization;
- loss-chasing warnings;
- cooling-off / recommendation-hide controls;
- virtual bankroll and paper mode.

### 5. Smart Market Alerts
BetForge should replace manual refreshing:
- target price reached;
- spread/total movement threshold;
- consensus divergence;
- stale-line detection;
- injury/news trigger;
- model edge crossed threshold;
- closing-line tracking.

## Strong secondary modules
- +EV scanner with transparent math
- arbitrage scanner with execution-risk warnings
- parlay probability lab
- prop research workbench
- matchup intelligence
- injury/weather/news aggregation
- paper betting
- social sharing of a thesis card without exposing private bankroll data

## Monetization direction
The preferred early model is analytics subscription + permitted affiliate/referral relationships with licensed operators. BetForge should not custody wagers or user gambling funds in the MVP.

Potential tiers:
- Free: limited games, basic line shopping, paper journal
- Pro: real-time alerts, full +EV scanner, CLV analytics, AI Analyst
- Advanced: advanced filters, historical market data, exports, portfolio/exposure analytics

## Product rule
If a feature makes BetForge look more like a sportsbook but does not improve **information quality, price quality, decision quality, or risk discipline**, it is lower priority.
