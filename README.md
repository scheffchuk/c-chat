# C Chat: Multi-Model AI Chat Web App

A modern web application that enables users to interact with multiple AI models from a single interface, designed for students, developers, and researchers who value speed, comparison capabilities, and privacy.

## Background & Purpose

While the demand for multi-model AI chat interfaces is high, existing solutions often suffer from high costs, closed ecosystems, or performance issues. C Chat addresses these limitations by providing an intuitive, vendor lock-in free platform that combines educational value with practical utility.

## Development Status

**🚧 Currently in Active Development**

This project is under active development as a graduation assignment. The frontend UI is largely complete, but backend integration and AI model connectivity are still in progress.

### ✅ Completed Features
- Modern responsive UI with sidebar navigation
- Multimodal input interface (text, voice, file attachments)
- Theme switching support (light/dark mode)
- Multi-model selector UI (ready for backend integration)
- Chat interface layout and components
- Homepage with greeting component

### 🚧 In Progress
- Backend schema (Users, Messages, Chats)
- Authentication system (Clerk)
- AI SDK API endpoint integration
- Message persistence and chat history

### 📋 Planned Features
- Sign in/Sign out functionality
- Message actions (copy, upvote, branch off)
- Chat artifacts and file handling
- Settings page and user preferences
- Public/private chat visibility controls
- Complete routing system

## Key Features

- **Modern UI**: Clean, responsive interface with sidebar navigation and theme switching
- **Multimodal Input**: Support for text, voice, and file attachments
- **Multi-Model Ready**: UI prepared for multiple AI model integration
- **Developer Friendly**: Built with modern web technologies and TypeScript
- **Responsive Design**: Optimized for desktop and mobile experiences

## Target Audience

- Students learning AI/ML concepts
- Developers building AI-powered applications
- Researchers comparing model performance
- Anyone seeking efficient multi-model AI interactions

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **ai-elements** - AI-specific UI components
- **Motion** - Animation library (Framer Motion)

### Backend & Services
- **Convex** - Real-time backend platform (configured but not yet integrated)
- **Clerk** - Authentication system (planned)
- **AI SDK** - AI model integration (planned)
- **AI Gateway** - Model routing and management (planned)

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

3. Set up environment variables
```bash
# Copy and configure environment variables
cp .env.example .env.local
```

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
│   │   ├── layout.tsx     # Chat layout with sidebar
│   │   ├── page.tsx       # Main chat page
│   │   └── chat/[id]/     # Individual chat pages
│   ├── layout.tsx         # Root layout with theme provider
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
└── providers/             # Context providers
convex/                    # Convex backend (not yet configured)
├── _generated/           # Auto-generated files
└── README.md            # Convex setup guide
```

## Current Limitations

⚠️ **Important**: This is a development version with the following limitations:

- **No Backend Integration**: Convex configured but not yet connected to UI
- **No Authentication**: User management and sign in/out not implemented
- **No AI Model Connectivity**: Model selector is UI-only, no actual AI integration
- **No Message Persistence**: Messages not saved or retrieved
- **No Chat History**: Previous conversations not stored
- **Limited Message Actions**: Copy, upvote, and branch off features not implemented

## Development

- **Development**: `pnpm dev` - Start development server with Turbopack
- **Build**: `pnpm build` - Create production build
- **Lint**: `pnpm lint` - Run Biome linter
- **Format**: `pnpm format` - Format code with Biome

## Contributing

This project is currently in active development as a graduation assignment. The frontend UI is largely complete, and the next phase involves backend integration and AI model connectivity.
