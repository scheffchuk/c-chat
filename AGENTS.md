# AGENTS.md - C Chat Development Guide

This file provides essential information for agentic coding agents working on the C Chat multi-model AI chat application.

## Project Overview

C Chat is a modern web application built with Next.js 15.5.9, React 19.1, and TypeScript that enables users to interact with multiple AI models from a single interface. The project uses Convex for real-time backend operations, Convex Auth for authentication, and the AI SDK for model integration via AI Gateway.

## Essential Commands

### Development & Build Commands
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Create production build with Turbopack
- `pnpm start` - Start production server
- `pnpm lint` - Run Biome linter (check for issues)
- `pnpm format` - Format code with Biome (fixes formatting)
- `pnpm knip` - Find unused dependencies and exports

### Package Management
- **IMPORTANT**: This project enforces pnpm usage via preinstall hook
- Always use `pnpm install` for dependencies
- Use `pnpm add <package>` for new dependencies

### Testing Commands
- No test framework is currently configured
- Manual testing via `pnpm dev` is the primary approach
- Consider adding Jest/Vitest if implementing automated tests

### Optional Services
- Redis (`REDIS_URL`) - Optional, for resumable streaming support

## Environment Variables

Required variables in `.env.local`:
- `NEXT_PUBLIC_CONVEX_URL` - Convex deployment URL
- `CONVEX_DEPLOYMENT` - Convex dev deployment ID
- `NEXT_PUBLIC_CONVEX_SITE_URL` - Convex site URL for auth
- `NEXT_PUBLIC_SITE_URL` - Main site URL
- `AI_GATEWAY_API_KEY` - AI Gateway authentication key
- `AUTH_EMAIL_FROM` - Resend email sender for authentication

Optional variables:
- `REDIS_URL` - Redis URL for resumable streaming support

## Authentication

### Migration from Clerk
C Chat has migrated from Clerk to Convex Auth (`@convex-dev/auth`).

**Current Configuration:**
- Uses Google OAuth + Resend (email OTP) providers
- Auth configuration in `convex/auth.config.ts`

**Helper Functions:**
- `getToken()` - Get authentication token
- `getAuthenticatedUser()` - Get current authenticated user
- `AuthenticationError` - Custom error class for auth failures

**Auth Config Location:**
- `convex/auth.config.ts` - Main authentication configuration

### Auth Implementation
- Use `Authenticated` component wrapper for protected routes
- Handle auth states gracefully in UI
- Implement proper error boundaries for authentication errors

## Database & Backend

### Convex Schema
Schema defined in `convex/schema.ts` with the following tables:

**User Preferences Table:**
- `userPreferences` - Stores user preferences including:
  - `favoriteModels`: Array of model IDs
  - `selectedModelId`: User's default model
  - `reasoningEffort`: Reasoning effort level ("none", "low", "medium", "high")
  - `maxSteps`: Step limit for reasoning (1-10)

**Core Tables:**
- `chats` - Chat conversations with `selectedModelId` and `lastContext` (AppUsage)
- `messages` - Messages with AI SDK parts support including reasoning
- `users` - User profiles

**Supporting Tables:**
- `streams` - Resumable streaming support
- `documents` - File/document storage
- `suggestions` - AI suggestions storage

### Database Conventions
- Use proper TypeScript types from Convex generated files
- Follow naming conventions: `chats`, `messages`, `users`, `userPreferences`
- Implement proper indexing for query performance
- Use Zod validation where applicable

## State Management

### Local State
- Zustand store: `src/stores/model-store.ts`
  - Persisted to localStorage
  - Manages selected model, reasoning effort, max steps
  - Handles optimistic UI updates

### Server State
- Convex for server state and real-time updates
- Custom hooks for syncing local and server state

### Custom Hooks
- `use-favorite-models.ts` - Syncs with Convex user preferences
- Handles optimistic UI updates for model favorites

## AI Integration

### AI Gateway
- Uses `@ai-sdk/gateway` as unified interface for AI providers
- Single endpoint for multiple AI providers
- Supports streaming responses with proper error handling
- Usage tracking integration with `tokenlens`

### Usage Tracking
- `AppUsage` type combining LanguageModelUsage with tokenlens data
- Per-chat usage context storage
- Model-specific usage information
- Cost estimation support

### Streaming
- Streaming responses with `createUIMessageStream()`
- Background title generation after first message
- Step counting and reasoning support
- Smooth streaming with word chunking

### Error Handling
- Use custom `ChatSDKError` from `@/lib/errors`
- Implement comprehensive error boundaries
- Use `fetchWithErrorHandlers` utility for API calls
- Provide meaningful error messages to users
- Log errors appropriately without exposing sensitive data

## Model Selection System

### Model Selector Component
- Location: `src/components/model-selector.tsx`
- Search functionality for filtering models
- Provider logos display
- Favorite models feature with persistence
- Per-chat model selection support

### Features
- Favorite models highlighting and quick access
- Model search and filtering
- Provider-based organization
- Popular models suggestions
- Persistence via Convex user preferences

## Reasoning Controls

### Configuration Options
- **Effort Levels**: "none", "low", "medium", "high"
  - Controls reasoning depth for supported models

- **Max Steps**: 1-10
  - Step limit for reasoning models

### Implementation
- Integrated into Zustand model store
- Backend support via Convex user preferences
- UI component: `reasoning-controls.tsx`
- Syncs with user preferences in real-time

## User Preferences

### Preference Structure
```typescript
interface UserPreferences {
  favoriteModels: string[];      // Array of model IDs
  selectedModelId: string;       // Default model ID
  reasoningEffort: "none" | "low" | "medium" | "high";
  maxSteps: number;             // 1-10
}
```

### CRUD Operations
- Convex queries for reading preferences
- Convex mutations for updating preferences
- Optimistic updates in UI
- Sync between local storage and Convex

## Resumable Streaming

### Redis Backend
- Uses `@upstash/redis` for Redis integration
- `resumable-stream` package for stream management
- Optional `REDIS_URL` environment variable

### Features
- Resumable streams across sessions
- Background title generation
- Smooth word-by-word streaming
- Step counting for reasoning models

## Code Style Guidelines

### Import Organization
- Biome automatically organizes imports (`organizeImports: "on"`)
- Use absolute imports with `@/` prefix for project files:
  - `@/components/ui/button` for UI components
  - `@/lib/utils` for utilities
  - `@/hooks/use-scroll-to-bottom` for custom hooks
  - `@/stores/*` for Zustand stores

### TypeScript Configuration
- Strict mode enabled with `strictNullChecks: true`
- Path alias: `@/*` maps to `./src/*`
- Target ES2017, module resolution bundler
- Always provide explicit types, avoid `any` when possible
- Use interfaces for object shapes, types for unions/primitives

### Component Architecture
- Follow shadcn/ui patterns with class-variance-authority (CVA)
- Use Radix UI primitives for accessibility
- Components should be default exports with named component functions
- Props interfaces should extend appropriate HTML element props
- Example:
  ```tsx
  interface ButtonProps extends React.ComponentProps<"button"> {
    variant?: "default" | "destructive" | "outline";
    size?: "default" | "sm" | "lg";
  }
  ```

### File Naming & Structure
- Components: PascalCase (`Button.tsx`, `ChatHeader.tsx`)
- Hooks: camelCase with `use-` prefix (`use-scroll-to-bottom.tsx`)
- Stores: camelCase (`model-store.ts`)
- Utilities: camelCase (`utils.ts`, `types.ts`)
- Pages/Routes: follow Next.js App Router conventions
- Keep components focused and single-responsibility

### Styling Guidelines
- Use Tailwind CSS classes (version 4)
- Leverage `cn()` utility from `@/lib/utils` for conditional classes
- Use CVA for component variants (see `components/ui/button.tsx`)
- Follow shadcn/ui "new-york" style variant
- CSS variables enabled for theming (`cssVariables: true`)

### Security Best Practices
- Never commit secrets or API keys
- Use environment variables for configuration
- Validate all user inputs
- Implement proper CSRF protection
- Use HTTPS in production

## Development Workflow

### Before Committing
- Run `pnpm lint` before committing changes
- Use `pnpm format` to maintain consistent code style
- Test features manually with `pnpm dev`
- Check `package.json` for available scripts
- Review changes against existing patterns

### Cursor Rules Integration
This project includes Cursor commands for common development tasks:
- Code review: Focus on functionality, maintainability, and security
- Error handling: Implement comprehensive error boundaries and validation
- Accessibility audit: Ensure WCAG compliance
- Performance optimization: Identify bottlenecks and improvements

### Git & Version Control
- Use conventional commit messages
- Never commit `.env.local` or other sensitive files
- Check `.gitignore` before adding new file types
- Branch feature work from main/develop

## Common Patterns

### Utility-first Approach
- `@/lib/utils` for shared utilities
- Consistent error handling patterns
- Reusable UI components in `components/ui/`
- Proper TypeScript interfaces for all data structures
- Loading states and skeleton components for better UX

### New Component Patterns
- Model store with Zustand and localStorage persistence
- Custom hooks for Convex data synchronization
- AI Elements components for AI-specific UI
- Optimistic updates for better UX
- Error boundaries for graceful failure handling

### Performance Considerations
- Use React.memo for expensive components
- Implement proper loading states
- Use Next.js Image optimization for media
- Leverage Turbopack for faster development builds
- Implement proper debouncing for search/input
- Optimize Convex queries with proper indexing

## Key Dependencies

### Core Framework
- **Next.js**: 15.5.9 with Turbopack
- **React**: 19.1 with modern features
- **TypeScript**: 5 with strict configuration
- **Biome**: 2.3.4 for linting and formatting

### Styling & UI
- **Tailwind CSS**: 4 with CSS variables
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Component library
- **lucide-react**: 0.546.0 for icons
- **motion**: 12.23.24 for animations
- **class-variance-authority**: Variants management

### Backend & Database
- **Convex**: 1.28 for real-time backend
- **@upstash/redis**: 1.35.7 for Redis integration
- **@convex-dev/auth**: 0.0.90 for authentication

### AI & Machine Learning
- **@ai-sdk/gateway**: 2.0.12 for AI Gateway
- **@ai-sdk/openai**: 2.0.65 for OpenAI integration
- **@ai-sdk/anthropic**: 2.0.44 for Anthropic integration
- **@ai-sdk/react**: 2.0.76 for React integration
- **ai-elements**: 1.1.2 for AI-specific UI components
- **tokenlens**: 1.3.1 for usage tracking
- **resumable-stream**: 2.2.8 for resumable streaming
- **shiki**: 3.15.0 for syntax highlighting

### State Management
- **zustand**: 5.0.11 for local state management

### Email & Authentication
- **@resend/node-email**: For email OTP authentication

### Development Tools
- **knip**: 5.80.1 for unused dependency checking
- **ultracite**: 6.3.2 dev dependency

Remember to always run linting commands before finalizing changes, and maintain consistency with existing patterns and conventions in the codebase.
