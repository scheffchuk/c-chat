# C Chat: Multi-Model AI Chat Web App

A modern web application that enables users to interact with multiple AI models from a single interface, designed for students, developers, and researchers who value speed, comparison capabilities, and privacy.

## Background & Purpose

While the demand for multi-model AI chat interfaces is high, existing solutions often suffer from high costs, closed ecosystems, or performance issues. C Chat addresses these limitations by providing an intuitive, vendor lock-in free platform that combines educational value with practical utility.

## Key Features

- **Multi-Model Support**: Switch between and compare different AI models seamlessly
- **Intuitive UX**: Clean, responsive interface built with modern web technologies
- **Vendor Independence**: No single provider lock-in, giving users flexibility
- **Performance Focused**: Optimized for speed and reliability
- **Privacy Conscious**: User data handling with transparency

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

### Backend & Services
- **Convex** - Real-time backend platform
- **Better Auth** - Authentication system
- **AI SDK** - AI model integration
- **AI Gateway** - Model routing and management

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
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
convex/                 # Convex backend
├── _generated/         # Auto-generated files
└── README.md          # Convex setup guide
```

## Development

- **Development**: `pnpm dev` - Start development server with Turbopack
- **Build**: `pnpm build` - Create production build
- **Lint**: `pnpm lint` - Run Biome linter
- **Format**: `pnpm format` - Format code with Biome
