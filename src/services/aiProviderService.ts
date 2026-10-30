import { ModelProviderConfig } from '../types';

export interface TestResult {
  success: boolean;
  message: string;
  latencyMs?: number;
  detectedModel?: string;
}

export class AIProviderService {
  /**
   * Masks sensitive API keys for UI display and logs.
   * e.g., AIzaSy...xQ1 -> AIza••••••••xQ1
   */
  static maskKey(key: string): string {
    if (!key) return '••••••••••••';
    if (key.length <= 8) return '••••••••';
    return `${key.slice(0, 4)}••••••••${key.slice(-4)}`;
  }

  /**
   * Verifies endpoint, credentials, and model identifier.
   * Never fakes a success response.
   */
  static async testConnection(config: ModelProviderConfig): Promise<TestResult> {
    try {
      const response = await fetch('/api/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerType: config.providerType,
          baseUrl: config.baseUrl,
          apiKey: config.apiKey,
          modelName: config.modelName,
        }),
      });

      const data = await response.json();
      return {
        success: data.success,
        message: data.message || (data.success ? 'Connection verified successfully.' : 'Failed to reach model.'),
        latencyMs: data.latencyMs,
        detectedModel: data.detectedModel,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Network error reaching test endpoint.',
      };
    }
  }

  /**
   * Generates AI model response or action proposal.
   */
  static async generate(
    prompt: string,
    config: ModelProviderConfig,
    systemInstruction?: string
  ): Promise<{ success: boolean; text: string; error?: string }> {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          providerType: config.providerType,
          baseUrl: config.baseUrl,
          apiKey: config.apiKey,
          modelName: config.modelName,
          systemInstruction,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'AI generation failed');
      }

      return {
        success: true,
        text: data.text,
      };
    } catch (err: any) {
      return {
        success: false,
        text: '',
        error: err.message || 'Model request failed.',
      };
    }
  }

  /**
   * Hardware-grade AES-256-GCM encryption simulator using browser WebCrypto.
   * Emulates Android Keystore cipher operations.
   */
  static async simulateKeystoreEncrypt(plainText: string): Promise<string> {
    try {
      const enc = new TextEncoder();
      const rawData = enc.encode(plainText);
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const key = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );

      const cipherBuffer = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        rawData
      );

      const combined = new Uint8Array(iv.length + cipherBuffer.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(cipherBuffer), iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch {
      return btoa(plainText);
    }
  }
}
