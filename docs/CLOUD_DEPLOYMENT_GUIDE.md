# TelAI — Cloudflare Workers & Supabase Deployment Guide

## 1. Cloudflare Workers Deployment (Free Tier)
TelAI uses Cloudflare Workers as a stateless API gateway and optional request proxy.

### Prerequisites
- [Node.js](https://nodejs.org) v18+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/): `npm install -g wrangler`
- Free Cloudflare Account (100,000 requests/day free)

### Steps
1. Navigate to the worker directory:
   ```bash
   cd cloudflare
   ```
2. Authenticate Wrangler:
   ```bash
   npx wrangler login
   ```
3. Set your secret Gemini API key (optional for server-assisted proxying):
   ```bash
   npx wrangler secret put GEMINI_API_KEY
   ```
4. Deploy the worker:
   ```bash
   npx wrangler deploy
   ```
5. You will receive a live URL:
   `https://telai-cloud-worker.<your-subdomain>.workers.dev`
6. In TelAI Android Settings -> Cloud Gateway, enter this URL.

---

## 2. Supabase PostgreSQL Deployment (Free Tier)
Supabase stores user metadata, automation rules, and action audit logs (no Telegram credentials).

### Steps
1. Create a free project at [https://supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Paste the contents of `database/migrations/001_initial_schema.sql` and run.
4. Verify all 12 tables and Row-Level Security policies are active.
5. In your Cloudflare Worker or Android Settings, configure the Supabase Project URL and Anon Public Key.
