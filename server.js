// ─────────────────────────────────────────────────────────────
//  Multi-Model Streaming Server — Vercel AI SDK v6
//  Uses pipeUIMessageStreamToResponse for @ai-sdk/react v3
// ─────────────────────────────────────────────────────────────

import express from 'express';
import cors from 'cors';
import { streamText, pipeUIMessageStreamToResponse } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';

const app = express();
app.use(cors());
app.use(express.json());

// Log ALL incoming requests
app.use((req, res, next) => {
    console.log(`[REQ] ${req.method} ${req.url}`);
    next();
});

// ── Provider 1: Google Gemini ────────────────────────────────
const google = createGoogleGenerativeAI({
    apiKey: "AIzaSyCnGTMaj3gCLCoOF_9leTFrMfCE7vJ1OLw",
});

// ── Provider 2: NVIDIA NIM (OpenAI-compatible endpoint) ─────
const nvidia = createOpenAI({
    apiKey: "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",
    baseURL: "https://integrate.api.nvidia.com/v1",
});

// ── Streaming Chat Endpoint ─────────────────────────────────
app.post('/api/chat', async (req, res) => {
    // @ai-sdk/react v3 sends custom body fields inside the main body
    const { messages, modelType: topLevelModelType } = req.body;
    // Use the top-level modelType or look for it if it was merged elsewhere
    const modelType = topLevelModelType || req.body.modelType || 'gemini';

    try {
        const model = modelType === 'nim'
            ? nvidia("moonshotai/kimi-k2.5")
            : google("models/gemini-2.5-flash");

        console.log(`[${new Date().toISOString()}] Streaming with: ${modelType === 'nim' ? 'Kimi K2.5 (NVIDIA NIM)' : 'Gemini 2.5 Flash'}`);

        const coreMessages = messages.map(msg => {
            let content = '';
            if (typeof msg.content === 'string' && msg.content) {
                content = msg.content;
            } else if (Array.isArray(msg.parts)) {
                content = msg.parts
                    .filter(p => p.type === 'text')
                    .map(p => p.text)
                    .join('');
            } else if (msg.text) {
                content = msg.text;
            }

            return {
                role: msg.role || 'user',
                content: content || ''
            };
        }).filter(m => m.content);

        console.log(`[${new Date().toISOString()}] Parsed ${coreMessages.length} messages for ${modelType}`);

        const result = streamText({
            model,
            messages: coreMessages,
        });

        // v3 transport expects a specific JSON event stream
        pipeUIMessageStreamToResponse({
            response: res,
            stream: result.toUIMessageStream(),
        });

    } catch (error) {
        console.error('Streaming error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message });
        }
    }
});

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', models: ['gemini-2.5-flash', 'kimi-k2.5'] });
});

app.listen(3001, () => {
    console.log('');
    console.log('  ✦ Vercel AI SDK v6 Streaming Server');
    console.log('  ➜ Local:   http://localhost:3001');
    console.log('  ➜ Models:  Gemini 2.5 Flash | Kimi K2.5 (NVIDIA NIM)');
    console.log('');
});
