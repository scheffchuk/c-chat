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
- Sign in/Sign out functionality (Clerk integration)
- AI SDK API endpoint with streaming support
- Message persistence and storage (Convex backend)
- Message display component with rendering
- Message actions (copy, edit)
- Convex backend schema (Users, Messages, Chats)
- Convex client integration with React
- Clerk authentication provider integration
- Real-time message sync

### 🚧 In Progress

- Chat history navigation (UI exists, backend integration pending)
- Individual chat pages (route scaffolded, implementation pending)
- Message actions (upvote, branch off - UI components exist, wiring pending)

### 📋 Planned Features

- Chat history retrieval and display in sidebar
- Complete routing system for individual chats
- Chat artifacts and file handling
- Settings page and user preferences
- Public/private chat visibility controls UI
- Message upvote and branch off functionality

## Key Features

- **Modern UI**: Clean, responsive interface with sidebar navigation and theme switching
- **Multimodal Input**: Support for text, voice, and file attachments
- **Multi-Model Ready**: UI prepared for multiple AI model integration
- **Real-time Backend**: Convex for real-time data sync and backend operations
- **Authentication**: Clerk provider integrated with sign in/out flows
- **Developer Friendly**: Built with modern web technologies and TypeScript
- **Responsive Design**: Optimized for desktop and mobile experiences

## Target Audience

- Students learning AI/ML concepts
- Developers building AI-powered applications
- Researchers comparing model performance
- Anyone seeking efficient multi-model AI interactions

## Tech Stack

### Frontend

- **Next.js 15.5.6** - React framework with App Router
- **React 19.1** - UI library
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS 4** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **ai-elements** - AI-specific UI components
- **Motion** - Animation library (Framer Motion)

### Backend & Services

- **Convex 1.28** - Real-time backend platform (schema and client integrated)
- **Clerk 6.34** - Authentication system (provider integrated)
- **AI SDK 5.0** - AI model integration with streaming support
- **resumable-stream** - Streaming chat responses

### Utilities

- **usehooks-ts** - TypeScript React hooks
- **nanoid** - Unique ID generation
- **class-variance-authority** - Component variant management
- **next-themes** - Theme switching

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

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<your-clerk-secret-key>
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
│   ├── layout.tsx         # Root layout (Clerk + Convex + Theme providers)
│   ├── page.tsx           # Home page redirect
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── ai-elements/       # AI-specific UI components
│   ├── ui/               # Reusable UI components (Radix-based)
│   ├── app-sidebar.tsx   # Main sidebar navigation
│   ├── chat.tsx          # Main chat interface
│   ├── chat-header.tsx   # Chat header with controls
│   ├── messages.tsx      # Message display component
│   ├── multimodal-input.tsx # Input with attachments/voice
│   └── greeting.tsx      # Landing page greeting
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── providers/
    ├── convex-client-provider.tsx  # Convex React client
    └── theme-provider.tsx          # Theme context
convex/                    # Convex backend
├── _generated/           # Auto-generated API & types
├── schema.ts            # Database schema (users, chats, messages)
├── chats.ts             # Chat queries & mutations
├── messages.ts          # Message queries & mutations
├── users.ts             # User queries & mutations
└── auth.config.ts       # Clerk auth config
```

## Current Limitations

⚠️ **Important**: This is a development version with the following limitations:

- **Chat History**: Sidebar shows placeholder data; backend integration pending
- **Individual Chat Pages**: Route exists but page implementation incomplete
- **Message Actions**: Copy and edit work; upvote and branch off UI exists but not wired
- **Visibility Controls**: Backend support exists; UI selector not implemented
- **Settings Page**: Not yet implemented

## Development

- **Development**: `pnpm dev` - Start development server with Turbopack
- **Build**: `pnpm build` - Create production build
- **Lint**: `pnpm lint` - Run Biome linter
- **Format**: `pnpm format` - Format code with Biome

## Contributing

This project is currently in active development as a graduation assignment. The frontend UI is largely complete, and the next phase involves backend integration and AI model connectivity.
