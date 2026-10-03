import { createRemoteJWKSet, jwtVerify } from "jose";

export type AuthEnv = {
  BETFORGE_AUTH_ISSUER?: string;
  BETFORGE_AUTH_AUDIENCE?: string;
  BETFORGE_AUTH_JWKS_URL?: string;
};

const jwks = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

export async function authenticate(request: Request, env: AuthEnv) {
  if (!env.BETFORGE_AUTH_ISSUER || !env.BETFORGE_AUTH_AUDIENCE || !env.BETFORGE_AUTH_JWKS_URL) {
    throw new Response(JSON.stringify({ error: { code: "AUTH_NOT_CONFIGURED", message: "Authentication is not configured." } }), {
      status: 503,
      headers: { "content-type": "application/json" },
    });
  }

  const bearer = /^Bearer (\S+)$/.exec(request.headers.get("authorization") ?? "")?.[1];
  const accessAssertion = request.headers.get("cf-access-jwt-assertion") ?? undefined;
  const token = bearer ?? accessAssertion;
  if (!token) {
    throw new Response(JSON.stringify({ error: { code: "UNAUTHENTICATED", message: "Verified session required." } }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const url = new URL(env.BETFORGE_AUTH_JWKS_URL);
  if (url.protocol !== "https:") throw new Error("JWKS URL must use HTTPS");
  let key = jwks.get(url.href);
  if (!key) {
    key = createRemoteJWKSet(url);
    jwks.set(url.href, key);
  }

  try {
    const { payload } = await jwtVerify(token, key, {
      issuer: env.BETFORGE_AUTH_ISSUER,
      audience: env.BETFORGE_AUTH_AUDIENCE,
      algorithms: ["RS256", "ES256"],
      requiredClaims: ["sub", "exp", "iat"],
    });
    return { subject: payload.sub!, email: typeof payload.email === "string" ? payload.email : undefined };
  } catch {
    throw new Response(JSON.stringify({ error: { code: "UNAUTHENTICATED", message: "Invalid or expired session." } }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
}
