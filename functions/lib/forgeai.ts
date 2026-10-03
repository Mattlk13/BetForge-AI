export type ForgeAIEnv = {
  FORGEAI_BASE_URL?: string;
  FORGEAI_API_KEY?: string;
};

export async function askForgeAI(env: ForgeAIEnv, prompt: string) {
  if (!env.FORGEAI_BASE_URL || !env.FORGEAI_API_KEY) {
    return { enabled: false as const, text: "" };
  }

  const response = await fetch(
    env.FORGEAI_BASE_URL.replace(/\/+$/, "") + "/v1/chat/completions",
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.FORGEAI_API_KEY}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "forgeai-free",
        messages: [
          {
            role: "system",
            content:
              "Assist BetForge with software, sports-data analysis, simulations, documentation, and risk explanations. Do not place wagers, bypass age/geographic controls, or present uncertain predictions as guaranteed outcomes."
          },
          { role: "user", content: prompt }
        ],
        stream: false
      })
    }
  );

  const body = await response.json<any>();
  if (!response.ok) throw new Error(body?.error?.message || `ForgeAI HTTP ${response.status}`);

  return {
    enabled: true as const,
    text: body?.choices?.[0]?.message?.content || "",
    provider: body?.forgeai?.provider || null
  };
}
