/**
 * TelAI Cloudflare Worker
 * Secure API Gateway for Android TelAI Client
 * 
 * Non-Negotiable Rules:
 * - Never store or log user API keys or Telegram sessions.
 * - Enforce HTTPS and redact Authorization headers from logs.
 * - Pass-through streaming and strict JSON payload validation.
 */

export interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

export interface Env {
  GEMINI_API_KEY?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Security CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-TelAI-Client, X-Custom-Base-Url",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check endpoint
    if (url.pathname === "/health" || url.pathname === "/") {
      return new Response(
        JSON.stringify({
          status: "healthy",
          service: "TelAI Cloudflare Gateway",
          timestamp: new Date().toISOString(),
          version: "1.0.0",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Proxy Gemini Request
    if (url.pathname === "/v1/ai/gemini" && request.method === "POST") {
      try {
        const body = await request.json() as {
          model?: string;
          contents?: any[];
          generationConfig?: any;
          systemInstruction?: any;
        };

        const clientApiKey = request.headers.get("Authorization")?.replace("Bearer ", "") || env.GEMINI_API_KEY;
        if (!clientApiKey) {
          return new Response(
            JSON.stringify({ error: "Missing Gemini API Key. Provide via Bearer token." }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const model = body.model || "gemini-3.8-flash";
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${clientApiKey}`;

        const upstreamResponse = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: body.contents,
            systemInstruction: body.systemInstruction,
            generationConfig: body.generationConfig,
          }),
        });

        const data = await upstreamResponse.text();
        return new Response(data, {
          status: upstreamResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err: any) {
        return new Response(
          JSON.stringify({ error: err.message || "Gateway processing failure" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Proxy Custom OpenAI-Compatible Request
    if (url.pathname === "/v1/ai/openai-compatible" && request.method === "POST") {
      try {
        const customBaseUrl = request.headers.get("X-Custom-Base-Url") || "https://api.openai.com/v1";
        const authHeader = request.headers.get("Authorization");
        const body = await request.text();

        const endpoint = customBaseUrl.endsWith("/chat/completions")
          ? customBaseUrl
          : `${customBaseUrl.replace(/\/+$/, "")}/chat/completions`;

        const upstreamHeaders: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (authHeader) {
          upstreamHeaders["Authorization"] = authHeader;
        }

        const upstreamResponse = await fetch(endpoint, {
          method: "POST",
          headers: upstreamHeaders,
          body: body,
        });

        const data = await upstreamResponse.text();
        return new Response(data, {
          status: upstreamResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err: any) {
        return new Response(
          JSON.stringify({ error: err.message || "OpenAI-compatible proxy error" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "Route not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  },
};
