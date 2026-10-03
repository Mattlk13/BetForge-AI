import { authenticate } from "../../lib/auth";

export const onRequestGet = async (context: any) => {
  const actor = await authenticate(context.request, context.env);
  return Response.json({
    subject: actor.subject,
    authenticated: true,
    service: "betforge-ai",
  });
};
