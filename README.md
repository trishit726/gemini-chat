# Multi-Model AI Chat Interface 🚀

A highly sophisticated, premium AI chat interface built to handle real-time streaming responses from multiple cutting-edge Large Language Models (LLMs), including Google Gemini, Kimi K2.5, and OpenAI.

## 🌟 Overview
This project was born out of a desire to create a flawless, multi-model chat experience without the generic, clinical feel of standard AI wrappers. By leveraging the Vercel AI SDK, this application achieves seamless streaming from multiple providers while maintaining rock-solid state management.

## ✨ Key Features
- **Multi-Model Support**: Native integrations with Google Gemini, OpenAI, and Kimi K2.5 APIs.
- **Flawless Streaming**: Utilizes Vercel AI SDK's `useChat` and `streamText` for zero-latency token streaming.
- **Premium Dark Aesthetic**: Meticulously styled to purge all default "blue tints". The interface features absolute blacks, neutral zincs, and high-contrast typography for a strictly professional look.
- **Robust SSR Architecture**: Custom Express.js backend specifically engineered to handle complex Server-Side Rendering pipelines and eliminate 404 routing errors between the frontend and model APIs.
- **Automated Testing**: Playwright integration for end-to-end testing of the chat interface mechanics.

## 🛠️ Technical Stack
- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend / Routing**: Express.js with custom CORS configurations
- **AI Integration**: Vercel AI SDK (`@ai-sdk/react`, `@ai-sdk/google`, `@ai-sdk/openai`, `ai` core)
- **Testing**: Playwright

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Active API keys for Google Gemini, OpenAI, or Kimi.

### Installation
1. Clone the repository: `git clone <your-repo-url>`
2. Install dependencies: `npm install`
3. Set up environment variables locally.
4. Run the development environment: `npm run dev`
