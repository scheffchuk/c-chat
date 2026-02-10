# C Chat: Multi-Model AI Chat Web App

A modern web application that enables users to interact with multiple AI models from a single interface, designed for students, developers, and researchers who value speed, comparison capabilities, and privacy.

## Background & Purpose

While the demand for multi-model AI chat interfaces is high, existing solutions often suffer from high costs, closed ecosystems, or performance issues. C Chat addresses these limitations by providing an intuitive, vendor lock-in free platform that combines educational value with practical utility.

## Development Status

**🚧 Currently in Active Development**

This project is under active development as a graduation assignment. Core chat functionality is operational with AI model integration, message persistence, and authentication working. UI enhancements and additional features are in progress.

### ✅ Completed Features

- Modern responsive UI with sidebar navigation
- Multimodal input interface (text, voice, file attachments)
- Theme switching support (light/dark mode)
- Multi-model selector UI with backend integration
- Chat interface layout and components
- Homepage with greeting component
- Sign in/Sign out functionality (Convex Auth integration)
- AI Gateway API endpoint with streaming support
- Message persistence and storage (Convex backend)
- Message display component with rendering
- Message actions (copy, edit)
- Convex backend schema (Users, Messages, Chats, UserPreferences, Streams)
- Convex client integration with React
- Convex Auth with Google OAuth + Resend (email OTP)
- Real-time message sync
- Model selector UI with favorites and search
- User preferences system (Convex-backed with localStorage sync)
- Resumable streaming with Redis backend
- Usage tracking with tokenlens
- Individual chat pages with full routing system
- Reasoning support (backend - effort levels and max steps via model store)
- Chat artifacts and file handling (backend + preview UI)

### 🚧 In Progress

- Chat artifacts UI (preview exists, full handling in progress)
- Visibility selector UI (backend complete, UI limited)

### 📋 Planned Features

- Settings page
- Public/private chat visibility controls UI
- UI controls for reasoning configuration

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

- **Convex 1.28** - Real-time backend platform (schema and client integrated)
- **@convex-dev/auth** 0.0.90 - Authentication system (Convex Auth)
- **@ai-sdk/gateway** 2.0.12 - AI Gateway for model integration
- **@ai-sdk/openai** 2.0.65 - OpenAI provider
- **@ai-sdk/anthropic** 2.0.44 - Anthropic provider
- **@ai-sdk/react** 2.0.76 - React integration
- **resumable-stream** 2.2.8 - Streaming chat responses
- **tokenlens** 1.3.1 - Usage tracking and cost estimation
- **@upstash/redis** 1.35.7 - Redis integration for resumable streaming

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

### Prerequisites

- Node.js 18+
- pnpm

### Environment Variables

Create a `.env.local` file with the following required variables:

```bash
# Convex Backend
NEXT_PUBLIC_CONVEX_URL=<your-convex-deployment-url>
CONVEX_DEPLOYMENT=<your-convex-dev-deployment-id>
NEXT_PUBLIC_CONVEX_SITE_URL=<your-convex-site-url>
NEXT_PUBLIC_SITE_URL=<your-site-url>

# Convex Auth
AI_GATEWAY_API_KEY=<your-ai-gateway-api-key>
AUTH_EMAIL_FROM=<your-email-from-address>
```

**Note**: You can run Convex locally with `npx convex dev` or use a Convex Cloud deployment URL.

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd c-chat
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables as described above

4. Start the development server

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

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
│   ├── ai-elements/       # AI-specific UI components
│   ├── ui/                # Reusable UI components (Radix-based)
│   ├── app-sidebar.tsx   # Main sidebar navigation
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
├── _generated/           # Auto-generated API & types
├── schema.ts             # Database schema (users, chats, messages, userPreferences, streams)
├── chats.ts              # Chat queries & mutations
├── messages.ts           # Message queries & mutations
├── users.ts              # User queries & mutations
├── auth.config.ts        # Convex Auth config
└── preferences.ts        # User preferences queries & mutations
```

## Current Limitations

⚠️ **Important**: This is a development version with the following limitations:

- **Settings Page**: Not yet implemented
- **Visibility Controls**: Backend support complete; UI selector needs full implementation
- **Reasoning Controls UI**: Backend and model store support complete; no dedicated reasoning controls UI component (controlled via model-store.ts)

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

This project is currently in active development as a graduation assignment. The frontend UI is largely complete, and the next phase involves backend integration and AI model connectivity.
