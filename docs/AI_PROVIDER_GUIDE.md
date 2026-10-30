# TelAI — Configurable AI Provider Architecture Guide

## Core Architecture Principle
TelAI features a **provider-independent model abstraction**. Gemini is the default provider out of the box, but the application is not tightly coupled to any single vendor. Users can configure, test, switch, and delete AI providers directly inside the Android application without rebuilding the APK.

---

## Supported Provider Types

### 1. Google Gemini Native (`GEMINI_NATIVE`)
- **Direct REST Adapter**: Calls Google Generative Language v1beta API directly from the Android device or via the optional Cloudflare gateway.
- **Default Model**: `gemini-3.8-flash`
- **Supported Models**: `gemini-3.8-flash`, `gemini-3.1-flash-lite`, `gemini-4-argon`, etc.
- **Authentication**: API Key passed via query parameter or header; never logged or persisted in plain text.

### 2. OpenAI-Compatible Custom Endpoints (`OPENAI_COMPATIBLE`)
- **Base URL Support**: Any custom HTTP/HTTPS endpoint compliant with OpenAI `/chat/completions` specs.
- **Tested Providers**:
  - **OpenAI**: `https://api.openai.com/v1` (Models: `gpt-4o`, `gpt-4o-mini`)
  - **Groq Cloud**: `https://api.groq.com/openai/v1` (Models: `llama-3.3-70b-versatile`)
  - **Together AI**: `https://api.together.xyz/v1` (Models: `deepseek-ai/DeepSeek-V3`)
  - **Ollama / Local Gateway**: `http://192.168.1.50:11434/v1` (Models: `llama3:8b`, `mistral`)
  - **Private Enterprise Gateway**: Custom proxy URLs with Bearer token authentication.

---

## Connection Testing Pipeline
Before activating any provider, the **Test Connection** button runs a strict verification flow:
1. **URL Format Check**: Validates scheme and hostname.
2. **Credential Presence**: Rejects empty API keys.
3. **Synthetic Probe**: Sends a minimal 1-token test prompt (`"Ping. Answer with 'OK'."`).
4. **Latency Measurement**: Captures real round-trip network response time in milliseconds.
5. **Exact Error Parsing**: Distinguishes between HTTP 401/403 Authentication failures, 404 Route errors, and 429 Rate limit throttles.
*Zero fake success responses.*
