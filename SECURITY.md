# BetForge AI Security Policy

## Current security boundary
BetForge is an analytics and paper-betting application. It must not accept deposits, withdrawals, custody funds, or submit wagers.

## Secrets
- Sports-data API keys, Cloudflare tokens and future AI-provider secrets belong only in protected server-side secret stores.
- Never expose them through `VITE_*` variables, client JavaScript, logs, commits, screenshots or support messages.
- BetForge should use a dedicated Cloudflare token rather than reusing another project's token in production.

## PBN isolation
PBN is a separate application. BetForge may reproduce proven patterns such as least-privilege workflows, Cloudflare Access verification, readiness probes, CORS allowlists, payload limits and security headers, but must not depend on PBN source files, databases, secrets, runtime bindings, environments or deployments.

## Data integrity
- Preserve raw provider observations separately from derived probabilities and AI interpretation.
- Timestamp prices at ingestion.
- Record source/book/provider for every quote.
- Never rewrite historical odds observations in place.
- CLV comparisons must be like-for-like; line-moved comparisons must be explicitly marked.

## Release gates
Before production user accounts or paid analytics:
- provider licensing / display-rights review;
- authentication and authorization tests;
- dependency and vulnerability review;
- API rate limiting and abuse controls;
- data retention/deletion policy;
- incident and credential-rotation procedure;
- responsible-play review;
- legal review for each jurisdiction in which the service is marketed.
