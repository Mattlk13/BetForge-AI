type Env = {
  BETFORGE_ALLOWED_ORIGINS?: string;
};

function allowedOrigins(env: Env) {
  return (env.BETFORGE_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map(v => v.trim())
    .filter(Boolean);
}

export const onRequest = async (context: any) => {
  const request: Request = context.request;
  const env: Env = context.env;
  const origin = request.headers.get("origin");
  const pathname = new URL(request.url).pathname;
  const allowed = allowedOrigins(env);

  if (origin && allowed.length && !allowed.includes(origin)) {
    return Response.json({ error: { code: "ORIGIN_DENIED", message: "Origin is not allowed." } }, { status: 403 });
  }

  if (request.method === "OPTIONS") {
    const headers = new Headers();
    if (origin && (!allowed.length || allowed.includes(origin))) {
      headers.set("access-control-allow-origin", origin);
      headers.set("access-control-allow-methods", "GET, POST, OPTIONS");
      headers.set("access-control-allow-headers", "Authorization, Content-Type, X-Correlation-ID, Cf-Access-Jwt-Assertion");
      headers.set("access-control-max-age", "600");
    }
    return new Response(null, { status: 204, headers });
  }

  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > 64_000) {
    return Response.json({ error: { code: "PAYLOAD_TOO_LARGE", message: "Request exceeds 64KB." } }, { status: 413 });
  }

  const response = await context.next();
  const headers = new Headers(response.headers);
  const correlationId = request.headers.get("x-correlation-id") || crypto.randomUUID();

  if (pathname.startsWith("/api/")) headers.set("cache-control", "no-store");
  headers.set("x-content-type-options", "nosniff");
  headers.set("strict-transport-security", "max-age=31536000; includeSubDomains");
  headers.set("x-frame-options", "DENY");
  headers.set("referrer-policy", "no-referrer");
  headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");
  headers.set("cross-origin-opener-policy", "same-origin");
  headers.set("x-correlation-id", correlationId);
  headers.set("vary", "Origin");

  if (origin && (!allowed.length || allowed.includes(origin))) {
    headers.set("access-control-allow-origin", origin);
  }

  return new Response(response.body, { status: response.status, headers });
};
