# AGENTS.md - C Chat Development Guide

This file provides essential information for agentic coding agents working on the C Chat multi-model AI chat application.

## Project Overview

C Chat is a modern web application built with Next.js 15.5.6, React 19.1, and TypeScript that enables users to interact with multiple AI models from a single interface. The project uses Convex for real-time backend operations, Clerk for authentication, and the AI SDK for model integration.

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

## Code Style Guidelines

### Import Organization
- Biome automatically organizes imports (`organizeImports: "on"`)
- Use absolute imports with `@/` prefix for project files:
  - `@/components/ui/button` for UI components
  - `@/lib/utils` for utilities
  - `@/hooks/use-scroll-to-bottom` for custom hooks

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
- Utilities: camelCase (`utils.ts`, `types.ts`)
- Pages/Routes: follow Next.js App Router conventions
- Keep components focused and single-responsibility

### Styling Guidelines
- Use Tailwind CSS classes (version 4)
- Leverage `cn()` utility from `@/lib/utils` for conditional classes
- Use CVA for component variants (see `components/ui/button.tsx`)
- Follow shadcn/ui "new-york" style variant
- CSS variables enabled for theming (`cssVariables: true`)

### Error Handling
- Use custom `ChatSDKError` from `@/lib/errors`
- Implement comprehensive error boundaries
- Use `fetchWithErrorHandlers` utility for API calls
- Provide meaningful error messages to users
- Log errors appropriately without exposing sensitive data

### Database & Backend
- Convex schema defined in `convex/schema.ts`
- Use proper TypeScript types from Convex generated files
- Follow naming conventions: `chats`, `messages`, `users` tables
- Implement proper indexing for query performance
- Use Zod validation where applicable

### Authentication
- Clerk integration for user authentication
- Auth configuration in `convex/auth.config.ts`
- Use `Authenticated` component wrapper for protected routes
- Handle auth states gracefully in UI

### AI Integration
- Use AI SDK 5.0 for model interactions
- Model configurations in `@/lib/ai/models.ts`
- Streaming responses with proper error handling
- Support for multiple AI providers (OpenAI, Anthropic, etc.)

### State Management
- Use React hooks for local state
- Convex for server state and real-time updates
- Context providers for global state (theme, data stream)
- Avoid prop drilling where possible

### Performance Considerations
- Use React.memo for expensive components
- Implement proper loading states
- Use Next.js Image optimization for media
- Leverage Turbopack for faster development builds
- Implement proper debouncing for search/input

### Security Best Practices
- Never commit secrets or API keys
- Use environment variables for configuration
- Validate all user inputs
- Implement proper CSRF protection
- Use HTTPS in production

### Development Workflow
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

### Environment Variables
Required variables in `.env.local`:
- `NEXT_PUBLIC_CONVEX_URL` - Convex deployment URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk auth key
- `CLERK_SECRET_KEY` - Clerk secret key

### Common Patterns
- Utility-first approach with `@/lib/utils`
- Consistent error handling patterns
- Reusable UI components in `components/ui/`
- Proper TypeScript interfaces for all data structures
- Loading states and skeleton components for better UX

## Key Dependencies
- **Next.js**: 15.5.6 with Turbopack
- **React**: 19.1 with modern features
- **TypeScript**: 5 with strict configuration
- **Biome**: Linting and formatting
- **Tailwind CSS**: 4 with CSS variables
- **Convex**: 1.28 for real-time backend
- **Clerk**: Authentication system
- **AI SDK**: 5.0 for AI model integration
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Component library

Remember to always run linting commands before finalizing changes, and maintain consistency with existing patterns and conventions in the codebase.