# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Between Us** - AI-powered romantic relationship coaching mobile app
- **Target Users:** Young adults (18-30) navigating dating and relationships
- **Business Model:** Freemium with premium subscriptions
- **Core Features:** Love Decoder (text analysis), Flirt/Dating Coach, Daily Insights

## Tech Stack Architecture

### Monorepo Structure (pnpm workspaces)
```
betweenUs/
├── apps/
│   ├── mobile/     # Expo (React Native) with custom dev client
│   └── backend/    # Express API (TypeScript)
└── packages/
    ├── shared-types/       # TypeScript type definitions
    ├── shared-validation/  # Zod schemas (used by both mobile & backend)
    └── shared-constants/   # Subscription tiers, usage limits
```

**Key Architectural Decision:** Shared packages enable type-safe communication between mobile and backend. Zod schemas in `shared-validation` are used for both client-side form validation and server-side API validation.

### Mobile App (Expo + NativeWind)

**Important:** This project uses **Expo with custom dev client** (NOT Expo Go) because RevenueCat requires native modules.

**Styling:** NativeWind (Tailwind CSS for React Native)
- Use `className` prop with Tailwind classes
- Custom color palette in [tailwind.config.js](apps/mobile/tailwind.config.js)
- Import path aliases: `@/*` maps to `src/*`

**State Management:** Zustand stores (planned)
- `useAuthStore` - User session, login/logout
- `useSubscriptionStore` - RevenueCat subscription status
- `useDecoderStore`, `useCoachStore`, `useInsightsStore`

**Forms:** react-hook-form + Zod
- Validation schemas from `packages/shared-validation`
- Use `zodResolver` from `@hookform/resolvers/zod`

### Backend (Express + TypeScript)

**Service Layer Pattern:**
- Controllers handle HTTP requests/responses
- Services contain business logic
- Middleware for auth, rate limiting, usage limits

**AI Integration:** OpenAI GPT-4o
- Prompts in `src/services/ai/prompts/`
- Separate prompts for: decoder, coach, insights

**Database:** Supabase (PostgreSQL)
- Row Level Security (RLS) enforced on all tables
- Backend uses service role key for admin operations
- Mobile uses user JWT tokens

**Subscription Management:**
- RevenueCat webhook handling at `/api/v1/webhooks/revenuecat`
- Subscription state synced to Supabase `subscriptions` table
- Usage limits enforced via middleware before AI calls

## Development Commands

### Mobile App (Expo)

```bash
cd apps/mobile

# First-time setup (build custom dev client)
npx expo prebuild
npx expo run:ios       # or npx expo run:android

# Daily development (after first build)
npx expo start --dev-client

# Install new dependencies
npx expo install <package>   # For Expo-compatible packages
npm install <package>         # For standard npm packages
```

**Note:** Cannot use `npx expo start` alone - must use `--dev-client` flag.

### Backend

```bash
cd apps/backend

# Development (hot reload with tsx)
pnpm dev

# Build TypeScript
pnpm build

# Production
pnpm start
```

### Root-Level Commands

```bash
# Lint & format (runs on pre-commit via Husky)
pnpm biome check --write .

# Install dependencies in all workspaces
pnpm install

# Add dependency to specific workspace
pnpm --filter backend add <package>
pnpm --filter mobile add <package>
pnpm --filter shared-types add -D <package>
```

## Critical Implementation Patterns

### Shared Validation Example

**In `packages/shared-validation/src/schemas/auth.schemas.ts`:**
```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
```

**Mobile usage:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@betweenus/shared-validation';

const { control, handleSubmit } = useForm({
  resolver: zodResolver(loginSchema),
});
```

**Backend usage:**
```typescript
import { loginSchema } from '@betweenus/shared-validation';

const validateRequest = (schema: z.ZodSchema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
};

app.post('/login', validateRequest(loginSchema), loginController);
```

### NativeWind Component Pattern

All mobile components should use the `cn()` utility for conditional classes:

```typescript
// apps/mobile/src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Usage in components
import { cn } from '@/utils/cn';

<Pressable
  className={cn(
    'px-6 py-4 rounded-xl',
    variant === 'primary' && 'bg-primary-500',
    disabled && 'opacity-50'
  )}
/>
```

### Usage Limits Middleware (Backend)

The backend enforces daily usage limits based on subscription tier:

```typescript
// Middleware checks usage BEFORE calling OpenAI
export const checkUsageLimit = (feature: FeatureType) => {
  return async (req, res, next) => {
    const subscription = await getSubscription(req.user.id);
    const todayUsage = await getTodayUsage(req.user.id, feature);

    if (todayUsage >= SUBSCRIPTION_TIERS[subscription.tier].limits[feature].dailyLimit) {
      throw new UsageLimitError(...);
    }

    next();
  };
};
```

## Environment Configuration

### Mobile ([apps/mobile/.env.development](apps/mobile/.env.development))
```
API_URL=http://localhost:3000/api/v1
SUPABASE_URL=
SUPABASE_ANON_KEY=
REVENUECAT_API_KEY_IOS=
REVENUECAT_API_KEY_ANDROID=
```

### Backend ([apps/backend/.env.development](apps/backend/.env.development))
```
NODE_ENV=development
PORT=3000
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=sk-...
REVENUECAT_API_KEY=
REVENUECAT_WEBHOOK_SECRET=
JWT_SECRET=
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081
```

## Common Workflows

### Adding a New Feature

1. **Define types** in `packages/shared-types/src/api/`
2. **Create validation schema** in `packages/shared-validation/src/schemas/`
3. **Backend:** Add route → controller → service → OpenAI prompt
4. **Mobile:** Create screen → add to navigation → implement with NativeWind + react-hook-form
5. **Update usage limits** in `packages/shared-constants/src/limits.ts` if needed

### Modifying Subscription Tiers

All subscription tier logic lives in `packages/shared-constants/src/limits.ts`:

```typescript
export const SUBSCRIPTION_TIERS = {
  FREE: {
    tier: 'free',
    limits: {
      loveDecoder: { dailyLimit: 3 },
      coach: { dailyLimit: 5 },
    },
  },
  PREMIUM: { /* ... */ },
};
```

This constant is imported by both mobile (to show limits in UI) and backend (to enforce limits).

### Testing RevenueCat Webhooks Locally

Use ngrok to expose your local backend:
```bash
ngrok http 3000
# Set webhook URL in RevenueCat dashboard to: https://abc123.ngrok.io/api/v1/webhooks/revenuecat
```

## Testing Strategy

This monorepo uses **different testing frameworks** optimized for each workspace:

### Backend & Shared Packages: Vitest
- **Why:** Native TypeScript support, faster than Jest, modern DX
- **Config:** [apps/backend/vitest.config.ts](apps/backend/vitest.config.ts)
- **Test directory:** `apps/backend/test/`

```bash
cd apps/backend
pnpm test              # Run tests in watch mode
pnpm test:run          # Run tests once
pnpm test:ui           # Open Vitest UI
pnpm test:coverage     # Generate coverage report
```

**Example test:**
```typescript
// test/unit/services/auth.service.test.ts
import { describe, it, expect } from 'vitest';
import { authService } from '../../../src/services/auth.service';

describe('authService', () => {
  it('should validate email', () => {
    expect(authService.validateEmail('test@example.com')).toBe(true);
  });
});
```

### Mobile App: Jest
- **Why:** Official Expo support via `jest-expo`, React Native ecosystem standard
- **Config:** [apps/mobile/jest.config.js](apps/mobile/jest.config.js)
- **Test directory:** `apps/mobile/src/**/__tests__/`

```bash
cd apps/mobile
pnpm test              # Run tests in watch mode
pnpm test:coverage     # Generate coverage report
```

**Example component test:**
```typescript
// src/components/common/__tests__/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button onPress={onPressMock} title="Click Me" />
    );

    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
```

### Shared Packages: Vitest
- **Why:** Fast, simple testing for pure TypeScript/Zod logic
- **Config:** Each package has its own `vitest.config.ts`

```bash
cd packages/shared-validation
pnpm test              # Run tests
pnpm test:run          # Run once
```

**Example Zod schema test:**
```typescript
// packages/shared-validation/test/schemas/auth.schemas.test.ts
import { describe, it, expect } from 'vitest';
import { loginSchema } from '../../src/schemas/auth.schemas';

describe('loginSchema', () => {
  it('should reject invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });
});
```

### Root-Level Test Commands

```bash
# Run all tests across monorepo
pnpm test

# Run tests for specific workspace
pnpm test:backend
pnpm test:mobile
pnpm test:shared

# Generate coverage reports
pnpm test:coverage
```

### Mock Service Worker (MSW) for Backend

The backend uses MSW to mock external APIs (OpenAI, Supabase) in tests:

```typescript
// test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('https://api.openai.com/v1/chat/completions', () => {
    return HttpResponse.json({
      choices: [{ message: { content: 'Mocked AI response' } }],
    });
  }),
];
```

## Code Quality Tools

- **Biome:** Linting + formatting (replaces ESLint + Prettier)
- **Husky:** Pre-commit hook runs `pnpm biome check --write .`
- **TypeScript:** Strict mode enabled in all packages
- **Testing:** Vitest (backend/shared) + Jest (mobile)

Run manually:
```bash
pnpm biome check --write .
pnpm test
```

## Deployment Notes

- **Mobile:** Use Expo EAS for cloud builds (`eas build --platform ios`)
- **Backend:** Designed for Railway, Render, or similar Node.js hosting
- **Database:** Supabase (managed PostgreSQL with auth)
