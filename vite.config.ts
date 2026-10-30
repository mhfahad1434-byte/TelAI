import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {GoogleGenAI} from '@google/genai';

function telAiServerPlugin(): Plugin {
  return {
    name: 'telai-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        // Parse JSON body helper
        const getBody = async (): Promise<any> => {
          return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                resolve(body ? JSON.parse(body) : {});
              } catch (e) {
                resolve({});
              }
            });
            req.on('error', reject);
          });
        };

        res.setHeader('Content-Type', 'application/json');

        if (req.url === '/api/ai/test' && req.method === 'POST') {
          try {
            const body = await getBody();
            const {providerType, baseUrl, apiKey, modelName} = body;
            const startTime = Date.now();

            const effectiveKey = apiKey || process.env.GEMINI_API_KEY;

            if (providerType === 'GEMINI_NATIVE') {
              if (!effectiveKey) {
                res.statusCode = 400;
                return res.end(JSON.stringify({
                  success: false,
                  message: 'No Gemini API key provided. Please input an API key in settings.'
                }));
              }

              const ai = new GoogleGenAI({apiKey: effectiveKey});
              const targetModel = modelName || 'gemini-3.8-flash';
              
              await ai.models.generateContent({
                model: targetModel,
                contents: 'Ping. Respond with OK.'
              });

              const latency = Date.now() - startTime;
              res.statusCode = 200;
              return res.end(JSON.stringify({
                success: true,
                latencyMs: latency,
                detectedModel: targetModel,
                message: `Successfully connected to Google Gemini (${targetModel}) in ${latency}ms.`
              }));
            } else {
              // OpenAI-compatible endpoint
              if (!baseUrl) {
                res.statusCode = 400;
                return res.end(JSON.stringify({
                  success: false,
                  message: 'Base URL is required for custom OpenAI-compatible endpoint.'
                }));
              }

              const targetUrl = baseUrl.endsWith('/chat/completions')
                ? baseUrl
                : `${baseUrl.replace(/\/+$/, '')}/chat/completions`;

              const headers: Record<string, string> = {
                'Content-Type': 'application/json'
              };
              if (apiKey) {
                headers['Authorization'] = `Bearer ${apiKey}`;
              }

              const fetchResponse = await fetch(targetUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                  model: modelName || 'gpt-4o-mini',
                  messages: [{role: 'user', content: 'Ping. Respond with OK.'}],
                  max_tokens: 10
                })
              });

              const latency = Date.now() - startTime;
              if (fetchResponse.ok) {
                res.statusCode = 200;
                return res.end(JSON.stringify({
                  success: true,
                  latencyMs: latency,
                  detectedModel: modelName,
                  message: `Successfully reached ${baseUrl} in ${latency}ms.`
                }));
              } else {
                const errText = await fetchResponse.text();
                res.statusCode = fetchResponse.status;
                return res.end(JSON.stringify({
                  success: false,
                  latencyMs: latency,
                  message: `Provider returned HTTP ${fetchResponse.status}: ${errText.slice(0, 180)}`
                }));
              }
            }
          } catch (err: any) {
            res.statusCode = 500;
            return res.end(JSON.stringify({
              success: false,
              message: err.message || 'Connection test failed.'
            }));
          }
        }

        if (req.url === '/api/ai/generate' && req.method === 'POST') {
          try {
            const body = await getBody();
            const {prompt, providerType, baseUrl, apiKey, modelName, systemInstruction} = body;
            const effectiveKey = apiKey || process.env.GEMINI_API_KEY;

            if (providerType === 'GEMINI_NATIVE' || !providerType) {
              const ai = new GoogleGenAI({apiKey: effectiveKey || ''});
              const targetModel = modelName || 'gemini-3.8-flash';

              const response = await ai.models.generateContent({
                model: targetModel,
                contents: prompt,
                config: {
                  systemInstruction: systemInstruction || 'You are TelAI, an Android Telegram personal assistant.',
                  temperature: 0.5,
                }
              });

              res.statusCode = 200;
              return res.end(JSON.stringify({
                success: true,
                text: response.text || ''
              }));
            } else {
              // OpenAI compatible
              const targetUrl = baseUrl.endsWith('/chat/completions')
                ? baseUrl
                : `${baseUrl.replace(/\/+$/, '')}/chat/completions`;

              const headers: Record<string, string> = {
                'Content-Type': 'application/json'
              };
              if (apiKey) {
                headers['Authorization'] = `Bearer ${apiKey}`;
              }

              const msgs: any[] = [];
              if (systemInstruction) {
                msgs.push({role: 'system', content: systemInstruction});
              }
              msgs.push({role: 'user', content: prompt});

              const fetchResponse = await fetch(targetUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                  model: modelName || 'gpt-4o-mini',
                  messages: msgs,
                  temperature: 0.5
                })
              });

              if (!fetchResponse.ok) {
                const errText = await fetchResponse.text();
                throw new Error(`OpenAI-compatible error HTTP ${fetchResponse.status}: ${errText}`);
              }

              const json = await fetchResponse.json() as any;
              const text = json.choices?.[0]?.message?.content || '';
              res.statusCode = 200;
              return res.end(JSON.stringify({
                success: true,
                text
              }));
            }
          } catch (err: any) {
            res.statusCode = 500;
            return res.end(JSON.stringify({
              success: false,
              error: err.message || 'Generation failed'
            }));
          }
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), telAiServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
