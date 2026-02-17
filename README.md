# C Chat: Multi-Model AI Chat Web App

A modern web application that enables users to interact with multiple AI models from a single interface, designed for students, developers, and researchers who value speed, comparison capabilities, and privacy.

## Background & Purpose

While the demand for multi-model AI chat interfaces is high, existing solutions often suffer from high costs, closed ecosystems, or performance issues. C Chat addresses these limitations by providing an intuitive, vendor lock-in free platform that combines educational value with practical utility.

## Development Status

**Core functionality complete.** Full multi-model chat with AI Gateway, Convex backend, and Convex Auth. Remaining work: settings, visibility UI, reasoning controls UI, artifact panel.

### Completed

- Responsive UI with sidebar, theme switching (light/dark)
- Multimodal input (text, voice, file attachments)
- Multi-model selector with favorites, search, provider logos
- AI Gateway streaming, resumable streams (Redis optional)
- Convex backend: chats, messages, userPreferences, streams, documents
- Convex Auth: Google OAuth + Resend email OTP
- Message actions (copy, edit), reasoning display (collapsible)
- Usage tracking (tokenlens), per-chat cost display
- Reasoning params in backend (effort, max steps) – passed from model store

### In Progress

- Chat artifacts (backend + prompt ready; UI panel not wired)
- Visibility selector (schema + component; mutation/hook not connected)

### Planned

- Settings page
- Reasoning controls UI (effort, max steps – store exists, no UI)

## Key Features

- **Modern UI**: Clean, responsive interface with sidebar navigation and theme switching
- **Multimodal Input**: Support for text, voice, and file attachments
- **Multi-Model Ready**: UI prepared for multiple AI model integration
- **Real-time Backend**: Convex for real-time data sync and backend operations
- **Authentication**: Convex Auth with Google OAuth + Resend (email OTP)
- **Developer Friendly**: Built with modern web technologies and TypeScript
- **Responsive Design**: Optimized for desktop and mobile experiences
- **Reasoning Controls**: Configurable effort levels and step limits
- **Usage Tracking**: Token usage and cost estimation per chat

## Target Audience

- Students learning AI/ML concepts
- Developers building AI-powered applications
- Researchers comparing model performance
- Anyone seeking efficient multi-model AI interactions

## Tech Stack

### Frontend

- **Next.js 15.5.9** - React framework with App Router
- **React 19.1** - UI library
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS 4** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **ai-elements** - AI-specific UI components
- **Motion** - Animation library (Framer Motion)
- **lucide-react** - Icon library

### Backend & Services

- **Convex 1.28** - Real-time backend (chats, messages, userPreferences, auth)
- **@convex-dev/auth** 0.0.90 - Google OAuth + Resend email OTP
- **@ai-sdk/gateway** 2.0.12 - AI Gateway (OpenAI, Anthropic, etc.)
- **@ai-sdk/react** 2.0.76 - useChat, streaming
- **resumable-stream** 2.2.8 - Resumable streaming
- **tokenlens** 1.3.1 - Usage tracking, cost estimation
- **@upstash/redis** 1.35.7 - Optional Redis backend for resumable streams

### Utilities

- **usehooks-ts** - TypeScript React hooks
- **nanoid** - Unique ID generation
- **class-variance-authority** - Component variant management
- **next-themes** - Theme switching
- **zustand** 5.0.11 - Local state management

### Development Tools

- **Biome** 2.3.4 - Linting and formatting
- **knip** 5.80.1 - Unused dependency checker

### Deployment

- **Vercel** - Hosting and deployment platform

## Getting Started

**Prerequisites:** Node.js 18+, pnpm

```bash
git clone <repository-url>
cd c-chat
pnpm install
cp .env.example .env.local
```

Fill in `.env.local`. Where to get each value:

| Variable | Source |
|----------|--------|
| `NEXT_PUBLIC_CONVEX_URL`, `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_SITE_URL` | Run `npx convex dev` once – it creates a Convex project and writes these to `.env.local`. Or copy from [dashboard.convex.dev](https://dashboard.convex.dev) → your deployment → Settings. |
| `NEXT_PUBLIC_SITE_URL` | Your app URL. Use `http://localhost:3000` for local dev. |
| `AI_GATEWAY_API_KEY` | [Vercel dashboard](https://vercel.com) → AI Gateway → API Keys → Create key. |
| `AUTH_EMAIL_FROM` | [Resend](https://resend.com) – verified sender address (e.g. `noreply@yourdomain.com`). Required for email OTP sign-in. |

Then run:

```bash
npx convex dev    # terminal 1: Convex backend
pnpm dev          # terminal 2: Next.js
```

Open [http://localhost:3000](http://localhost:3000). Sign in with Google or email OTP.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (chat)/            # Chat route group
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts  # AI streaming endpoint
│   │   ├── layout.tsx     # Chat layout with sidebar
│   │   ├── page.tsx       # Main chat page
│   │   └── chat/[id]/     # Individual chat pages
│   ├── layout.tsx         # Root layout (Convex + Convex Auth + Theme providers)
│   ├── page.tsx           # Home page redirect
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── ai-elements/       # AI-specific UI (reasoning, context, suggestions)
│   ├── sidebar/           # app-sidebar, sidebar-provider, etc.
│   ├── ui/                # Radix-based primitives
│   ├── chat.tsx           # Main chat interface
│   ├── messages.tsx       # Message display component
│   ├── multimodal-input.tsx # Input with attachments/voice
│   ├── greeting.tsx       # Landing page greeting
│   ├── model-selector.tsx # Model selection UI
│   ├── message.tsx        # Individual message component
│   ├── message-actions.tsx # Message action buttons
│   ├── message-editor.tsx # Message editing UI
│   ├── message-reasoning.tsx # Reasoning display
│   ├── preview-attachment.tsx # Attachment preview
│   └── visibility-selector.tsx # Visibility controls
├── hooks/                  # Custom React hooks
│   └── use-favorite-models.ts # Sync favorites with preferences
├── stores/                 # Zustand stores
│   └── model-store.ts     # Model, reasoning settings store
├── lib/                    # Utility functions
└── providers/
    ├── convex-client-provider.tsx  # Convex React client
    └── theme-provider.tsx          # Theme context
convex/                    # Convex backend
├── _generated/            # Auto-generated API & types
├── schema.ts              # Database schema
├── chats.ts               # Chat CRUD, list
├── messages.ts            # Message queries & mutations
├── userPreferences.ts     # User preferences
├── auth.config.ts         # Convex Auth config
├── auth.ts                # Auth helpers
└── files.ts               # File storage
```

## Current Limitations

- **Settings page**: Not implemented
- **Visibility selector**: Component exists; Convex mutation + hook not wired
- **Reasoning controls**: Store + API support effort/maxSteps; no UI to change them (defaults used)

## Development

- **Development**: `pnpm dev` - Start development server with Turbopack
- **Build**: `pnpm build` - Create production build
- **Lint**: `pnpm lint` - Run Biome linter
- **Format**: `pnpm format` - Format code with Biome
- **Check**: `pnpm knip` - Find unused dependencies

## Testing

This project uses a dual testing strategy with **Vitest** for unit tests and **Playwright** for end-to-end (E2E) tests.

### Unit Tests (Vitest)

Unit tests focus on isolated business logic and utilities:

| File | Purpose |
|------|---------|
| `src/lib/ai/model-config.test.ts` | Tests AI model configuration including `getModelById()`, provider filtering, popular models, and default model selection |
| `src/lib/errors.test.ts` | Tests `ChatSDKError` class with error message generation, status codes, and API response formatting |
| `src/lib/utils.test.ts` | Tests utility functions including `cn()` for className merging, text sanitization, and message conversion utilities |

**Purpose**: Ensure core business logic, AI model configuration, error handling, and utility functions work correctly across different scenarios.

### E2E Tests (Playwright)

E2E tests verify full user workflows across different browsers:

| File | Purpose |
|------|---------|
| `e2e/landing.spec.ts` | Tests landing page loading, console error detection, and responsive design validation |
| `e2e/chat.spec.ts` | Tests chat page display, meta tags, and navigation handling between chat views |
| `e2e/auth.spec.ts` | Tests authentication flows including signin page, auth provider buttons, email OTP form, and error states |
| `e2e/example.spec.ts` | Example Playwright tests for reference (tests external site) |

**Purpose**: Validate critical user journeys including landing page experience, chat functionality, and authentication flows work correctly in real browser environments (Chromium, Firefox, WebKit).

### Running Tests

```bash
# Unit tests
pnpm test              # Run Vitest unit tests
pnpm test:ui           # Run Vitest with interactive UI

# E2E tests (requires dev server)
pnpm test:e2e          # Run Playwright E2E tests
pnpm test:e2e:ui       # Run Playwright E2E tests with UI
```

### Test Coverage Areas

- ✅ **AI Model Configuration** - Model lookup, filtering, and configuration validation
- ✅ **Error Handling** - Custom error classes and API error responses
- ✅ **Utility Functions** - Text processing, className merging, data transformation
- ✅ **Landing Page** - Page load, console errors, responsive design
- ✅ **Chat Functionality** - Page rendering, meta tags, navigation
- ✅ **Authentication** - Signin flow, auth options, form validation

## Contributing

Core chat, backend, and auth are production-ready. Contributions welcome for settings, visibility UI, reasoning controls, and the artifact panel.
