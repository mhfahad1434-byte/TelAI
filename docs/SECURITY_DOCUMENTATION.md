# TelAI — Security & Privacy Specification

## Non-Negotiable Security Invariants

### 1. Telegram Session Remains on Device
- The official Telegram TDLib client runs in-process inside the Android APK.
- All session auth keys, MTProto state, and chat databases reside strictly in `getFilesDir()/tdlib_data`.
- **Zero upload of Telegram database files, session strings, OTP login codes, or 2FA passwords to the cloud or third-party servers.**

### 2. Hardware-Backed Encryption via Android Keystore
- User-provided AI API keys (Google Gemini, OpenAI, Groq, etc.) are encrypted before being saved to local SQLite/Room storage.
- Uses **AES-256-GCM** with a non-exportable hardware key held in the Android Keystore.
- Ciphertext and 12-byte initialization vectors (IV) are isolated from cloud backups (`android:allowBackup="false"`).

### 3. Masked Key Display & Log Redaction
- In the UI, API keys are masked by default (e.g. `AIza••••••••9xQ1`).
- `SecretRedactor` scrubs all log streams (Logcat, OkHttp network logs) using regex patterns to block accidental leak of API keys or Bearer tokens.

### 4. Deterministic Multi-Tier Action Approval
Every Telegram mutation proposed by an AI agent must be evaluated by the local `SafetyAgent`:
- **Low Risk (Auto/Passive)**: In-app search queries, navigating to a message view.
- **Medium Risk (Preview Required)**: Drafting/sending a message, replying, forwarding, pinning, or archiving a chat. A human approval preview card is displayed before TDLib executes.
- **High Risk (Double Explicit Confirmation)**: Message deletion, leaving a chat, kicking members. Requires an explicit confirmation dialog detailing irreversible consequences.
- **Single-Use Binding**: An approval token is cryptographically bound to the exact action type, recipient ID, and message text hash. Changing any character immediately invalidates the approval.
- **Anti-Prompt Injection**: Telegram messages received from other users CANNOT trigger or approve actions. Approvals can only be granted via physical touch in the Android UI.

### 5. Telegram Terms Compliance & Zero Bulk Scraping
- No bulk ingestion of chat histories into AI context windows.
- No automated vector embeddings generated from user private chats.
- Only the specific message or thread explicitly selected by the user is passed to the active AI model for task execution.
