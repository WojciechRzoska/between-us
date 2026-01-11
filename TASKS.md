# Between Us - Implementation Tasks

## Legend
- ✅ Completed
- 🚧 In Progress
- ⏸️ Blocked
- ⏭️ Pending

---

## Phase 1: Project Setup & Infrastructure

### Repository & Tooling
- ✅ Create monorepo structure with pnpm workspaces
- ✅ Configure Biome for linting and formatting
- ✅ Set up Husky pre-commit hooks
- ✅ Create .gitignore
- ✅ Create CLAUDE.md documentation
- ✅ Create GitHub repository
- ✅ Push initial commit to GitHub
- ✅ Set up branch protection rules (main, develop)

### External Services Setup
- ⏭️ Create Supabase project
- ⏭️ Configure Supabase authentication (email/password)
- ⏭️ Set up RevenueCat account
- ⏭️ Configure RevenueCat products (Premium, Premium Plus)
- ⏭️ Get OpenAI API key
- ⏭️ Create environment variable files (.env.example)

---

## Phase 2: Shared Packages

### shared-types
- ⏭️ Create package.json and tsconfig.json
- ⏭️ Define API request/response types
  - ⏭️ Auth types (LoginRequest, SignupRequest, AuthResponse)
  - ⏭️ Decoder types (AnalyzeRequest, AnalysisResponse)
  - ⏭️ Coach types (ConversationRequest, MessageRequest)
  - ⏭️ Subscription types (SubscriptionStatus, PurchaseRequest)
  - ⏭️ Insight types (DailyInsight)
- ⏭️ Define database entity types (User, Subscription, Analysis, etc.)
- ⏭️ Build package (`pnpm build`)

### shared-validation
- ⏭️ Create package.json and tsconfig.json
- ⏭️ Create Zod schemas
  - ⏭️ Auth schemas (loginSchema, signupSchema)
  - ⏭️ Decoder schemas (analyzeSchema)
  - ⏭️ Coach schemas (conversationSchema, messageSchema)
  - ⏭️ Subscription schemas
- ⏭️ Export all schemas with proper types
- ⏭️ Build package (`pnpm build`)

### shared-constants
- ⏭️ Create package.json and tsconfig.json
- ⏭️ Define subscription tier constants
- ⏭️ Define usage limits per tier
- ⏭️ Define error codes and messages
- ⏭️ Define API endpoints constants
- ⏭️ Build package (`pnpm build`)

---

## Phase 3: Backend Implementation

### Core Setup
- ⏭️ Create src directory structure
  - ⏭️ config/
  - ⏭️ middleware/
  - ⏭️ routes/
  - ⏭️ controllers/
  - ⏭️ services/
  - ⏭️ jobs/
  - ⏭️ types/
  - ⏭️ utils/
- ⏭️ Configure TypeScript (tsconfig.json)
- ⏭️ Create environment config with validation (config/env.ts)
- ⏭️ Set up Winston logger (config/logger.ts)
- ⏭️ Create Express app setup (app.ts)
- ⏭️ Create server entry point (index.ts)

### Database
- ⏭️ Design database schema
- ⏭️ Write SQL migration for initial schema
- ⏭️ Create database tables in Supabase
  - ⏭️ users (extends auth.users)
  - ⏭️ subscriptions
  - ⏭️ usage_logs
  - ⏭️ analyses
  - ⏭️ conversations
  - ⏭️ messages
  - ⏭️ insights
- ⏭️ Configure Row Level Security policies
- ⏭️ Create Supabase client (services/supabase.service.ts)

### Middleware
- ⏭️ Create authentication middleware (middleware/auth.middleware.ts)
- ⏭️ Create request validation middleware (middleware/validation.middleware.ts)
- ⏭️ Create usage limit middleware (middleware/usageLimit.middleware.ts)
- ⏭️ Create error handler middleware (middleware/error.middleware.ts)
- ⏭️ Configure CORS middleware
- ⏭️ Configure Helmet security headers
- ⏭️ Configure rate limiting (express-rate-limit)

### Authentication
- ⏭️ Create auth service (services/auth.service.ts)
- ⏭️ Create auth controller (controllers/auth.controller.ts)
- ⏭️ Create auth routes (routes/auth.routes.ts)
  - ⏭️ POST /api/v1/auth/signup
  - ⏭️ POST /api/v1/auth/login
  - ⏭️ POST /api/v1/auth/logout
  - ⏭️ GET /api/v1/auth/me
- ⏭️ Test authentication flow

### AI Integration
- ⏭️ Create OpenAI service (services/ai/openai.service.ts)
- ⏭️ Create prompt templates
  - ⏭️ Love Decoder prompts (services/ai/prompts/decoder.prompts.ts)
  - ⏭️ Coach prompts (services/ai/prompts/coach.prompts.ts)
  - ⏭️ Daily Insight prompts (services/ai/prompts/insights.prompts.ts)
- ⏭️ Implement PII sanitization utility
- ⏭️ Add error handling for OpenAI failures

### Love Decoder Feature
- ⏭️ Create decoder service (services/decoder.service.ts)
- ⏭️ Create decoder controller (controllers/decoder.controller.ts)
- ⏭️ Create decoder routes (routes/decoder.routes.ts)
  - ⏭️ POST /api/v1/decoder/analyze
  - ⏭️ GET /api/v1/decoder/history
- ⏭️ Implement usage tracking
- ⏭️ Test decoder with sample inputs

### Coach Feature
- ⏭️ Create coach service (services/coach.service.ts)
- ⏭️ Create coach controller (controllers/coach.controller.ts)
- ⏭️ Create coach routes (routes/coach.routes.ts)
  - ⏭️ POST /api/v1/coach/conversations
  - ⏭️ POST /api/v1/coach/conversations/:id/messages
  - ⏭️ GET /api/v1/coach/conversations/:id/messages
- ⏭️ Implement conversation history management
- ⏭️ Implement usage tracking
- ⏭️ Test coach conversation flow

### Daily Insights Feature
- ⏭️ Create insights service (services/insights.service.ts)
- ⏭️ Create insights controller (controllers/insights.controller.ts)
- ⏭️ Create insights routes (routes/insights.routes.ts)
  - ⏭️ GET /api/v1/insights/today
  - ⏭️ PATCH /api/v1/insights/:id/viewed
- ⏭️ Create cron job for daily generation (jobs/dailyInsights.job.ts)
- ⏭️ Test insight generation and retrieval

### Subscription Management
- ⏭️ Create subscription service (services/subscription.service.ts)
- ⏭️ Create subscription controller (controllers/subscription.controller.ts)
- ⏭️ Create subscription routes (routes/subscription.routes.ts)
  - ⏭️ GET /api/v1/subscription/status
  - ⏭️ POST /api/v1/subscription/restore
- ⏭️ Create RevenueCat webhook handler
  - ⏭️ POST /api/v1/webhooks/revenuecat
  - ⏭️ Verify webhook signature
  - ⏭️ Update subscription status in database
- ⏭️ Test webhook with ngrok and RevenueCat sandbox

### Error Handling
- ⏭️ Create custom error classes
  - ⏭️ ValidationError
  - ⏭️ AuthenticationError
  - ⏭️ UsageLimitError
  - ⏭️ OpenAIError
- ⏭️ Implement global error handler
- ⏭️ Test error responses

### Testing
- ⏭️ Set up Jest and Supertest
- ⏭️ Write unit tests for services
- ⏭️ Write integration tests for API endpoints
- ⏭️ Test usage limit enforcement
- ⏭️ Test webhook handling

---

## Phase 4: Mobile App Implementation

### Core Setup
- ⏭️ Create src directory structure
  - ⏭️ components/
  - ⏭️ screens/
  - ⏭️ navigation/
  - ⏭️ store/
  - ⏭️ api/
  - ⏭️ services/
  - ⏭️ utils/
  - ⏭️ types/
  - ⏭️ constants/
- ⏭️ Create environment config
- ⏭️ Set up NativeWind global styles

### Utilities & Helpers
- ⏭️ Create className utility (utils/cn.ts)
- ⏭️ Create API client with Axios (api/client.ts)
  - ⏭️ Configure base URL
  - ⏭️ Add auth interceptors
  - ⏭️ Add error handling
- ⏭️ Create error handling utilities

### State Management (Zustand)
- ⏭️ Create auth store (store/authStore.ts)
  - ⏭️ Login/logout actions
  - ⏭️ Session persistence with AsyncStorage
- ⏭️ Create subscription store (store/subscriptionStore.ts)
- ⏭️ Create decoder store (store/decoderStore.ts)
- ⏭️ Create coach store (store/coachStore.ts)
- ⏭️ Create insights store (store/insightsStore.ts)
- ⏭️ Export all stores (store/index.ts)

### Common Components
- ⏭️ Create Button component (components/common/Button.tsx)
- ⏭️ Create Input component (components/common/Input.tsx)
- ⏭️ Create Card component (components/common/Card.tsx)
- ⏭️ Create Loading component (components/common/Loading.tsx)
- ⏭️ Create Error component (components/common/Error.tsx)
- ⏭️ Create Modal component (components/common/Modal.tsx)

### Navigation
- ⏭️ Set up React Navigation
- ⏭️ Create navigation structure (navigation/AppNavigator.tsx)
  - ⏭️ Auth stack (Login, Signup)
  - ⏭️ Main tabs (Decoder, Coach, Insights, Profile)
- ⏭️ Implement auth state navigation logic

### Authentication Screens
- ⏭️ Create LoginScreen (screens/auth/LoginScreen.tsx)
  - ⏭️ Form with react-hook-form + Zod
  - ⏭️ Login action
  - ⏭️ Error handling
- ⏭️ Create SignupScreen (screens/auth/SignupScreen.tsx)
  - ⏭️ Form validation
  - ⏭️ Signup action
  - ⏭️ Navigate to login after success

### Love Decoder Feature
- ⏭️ Create LoveDecoderScreen (screens/decoder/LoveDecoderScreen.tsx)
  - ⏭️ Text input area
  - ⏭️ Context selection (relationship stage)
  - ⏭️ Submit button
  - ⏭️ Loading state
  - ⏭️ Results display
  - ⏭️ Usage limit indicator
- ⏭️ Create AnalysisHistoryScreen (screens/decoder/AnalysisHistoryScreen.tsx)
- ⏭️ Create AnalysisDetailScreen (screens/decoder/AnalysisDetailScreen.tsx)

### Coach Feature
- ⏭️ Create CoachScreen (screens/coach/CoachScreen.tsx)
  - ⏭️ Chat interface
  - ⏭️ Message input
  - ⏭️ Conversation history
  - ⏭️ Loading indicators
  - ⏭️ Usage limit indicator
- ⏭️ Create ConversationListScreen (screens/coach/ConversationListScreen.tsx)

### Daily Insights Feature
- ⏭️ Create InsightsScreen (screens/insights/InsightsScreen.tsx)
  - ⏭️ Display today's insight
  - ⏭️ Mark as viewed
  - ⏭️ View previous insights
- ⏭️ Set up push notifications (optional)

### Profile & Subscription
- ⏭️ Create ProfileScreen (screens/profile/ProfileScreen.tsx)
  - ⏭️ User info display
  - ⏭️ Subscription status
  - ⏭️ Logout button
- ⏭️ Create SubscriptionScreen (screens/subscription/SubscriptionScreen.tsx)
  - ⏭️ Tier comparison
  - ⏭️ Purchase buttons
  - ⏭️ RevenueCat integration
  - ⏭️ Restore purchases

### RevenueCat Integration
- ⏭️ Create subscription service (services/subscription.service.ts)
- ⏭️ Configure RevenueCat SDK
- ⏭️ Implement purchase flow
- ⏭️ Implement restore purchases
- ⏭️ Sync subscription status with backend

### App Entry Point
- ⏭️ Update App.tsx
  - ⏭️ Add providers
  - ⏭️ Add navigation container
  - ⏭️ Add global error boundary
- ⏭️ Test app launches successfully

### Testing
- ⏭️ Set up React Testing Library
- ⏭️ Write component tests
- ⏭️ Test forms and validation
- ⏭️ Test navigation flows

---

## Phase 5: Integration & Testing

### End-to-End Testing
- ⏭️ Test complete authentication flow
- ⏭️ Test Love Decoder feature
  - ⏭️ Submit analysis
  - ⏭️ View results
  - ⏭️ Test usage limits
  - ⏭️ Test upgrade flow
- ⏭️ Test Coach feature
  - ⏭️ Start conversation
  - ⏭️ Send messages
  - ⏭️ View history
- ⏭️ Test Daily Insights
  - ⏭️ View insight
  - ⏭️ Mark as viewed
- ⏭️ Test subscription flow
  - ⏭️ Purchase subscription (sandbox)
  - ⏭️ Verify webhook
  - ⏭️ Verify limits update
  - ⏭️ Restore purchases

### Error Scenarios
- ⏭️ Test network errors
- ⏭️ Test invalid inputs
- ⏭️ Test OpenAI failures
- ⏭️ Test offline mode

---

## Phase 6: Deployment Preparation

### Backend Deployment
- ⏭️ Choose hosting platform (Railway/Render)
- ⏭️ Set up production environment variables
- ⏭️ Configure database connection pooling
- ⏭️ Set up health check endpoint
- ⏭️ Deploy to staging environment
- ⏭️ Test staging deployment
- ⏭️ Deploy to production

### Mobile App Deployment
- ⏭️ Install EAS CLI (`npm install -g eas-cli`)
- ⏭️ Configure EAS (`eas build:configure`)
- ⏭️ Create eas.json
- ⏭️ Update app.json with correct identifiers
- ⏭️ Generate app icons and splash screens
- ⏭️ Build development client
  - ⏭️ iOS: `eas build --profile development --platform ios`
  - ⏭️ Android: `eas build --profile development --platform android`
- ⏭️ Test development builds
- ⏭️ Build preview for TestFlight/Internal Testing
- ⏭️ Gather beta tester feedback
- ⏭️ Build production release
- ⏭️ Submit to App Store
- ⏭️ Submit to Google Play

### CI/CD
- ⏭️ Create GitHub Actions workflow for backend
  - ⏭️ Run Biome checks
  - ⏭️ Run tests
  - ⏭️ Build TypeScript
  - ⏭️ Deploy to staging
- ⏭️ Create GitHub Actions workflow for mobile
  - ⏭️ Run Biome checks
  - ⏭️ Run tests
  - ⏭️ Build with EAS (optional)

### Monitoring & Analytics
- ⏭️ Set up backend logging (Winston)
- ⏭️ Set up error tracking (Sentry optional)
- ⏭️ Set up mobile analytics (Mixpanel/Amplitude/Firebase)
- ⏭️ Configure alerts for critical errors

---

## Phase 7: Polish & Launch

### Documentation
- ⏭️ Write API documentation
- ⏭️ Create README for each package
- ⏭️ Document deployment process
- ⏭️ Create user guide (optional)

### Performance Optimization
- ⏭️ Optimize backend queries
- ⏭️ Add database indexes
- ⏭️ Implement caching (Redis optional)
- ⏭️ Optimize mobile app bundle size
- ⏭️ Add React.memo where needed
- ⏭️ Implement lazy loading

### Final Testing
- ⏭️ Run full verification checklist
- ⏭️ Test on real iOS devices
- ⏭️ Test on real Android devices
- ⏭️ Security audit
- ⏭️ Performance testing

### Launch
- ⏭️ Finalize pricing tiers
- ⏭️ Create marketing materials
- ⏭️ Prepare app store listings
- ⏭️ Soft launch to limited users
- ⏭️ Monitor metrics and fix issues
- ⏭️ Full public launch

---

## Future Enhancements (Post-MVP)

### User Profile Features
- ⏭️ Add full name field
- ⏭️ Add display name field
- ⏭️ Avatar upload functionality
- ⏭️ Dating context fields:
  - ⏭️ Relationship status (single, dating, relationship, complicated)
  - ⏭️ Gender
  - ⏭️ Age range
- ⏭️ User preferences:
  - ⏭️ Language selection
  - ⏭️ Timezone setting
- ⏭️ Notification preferences:
  - ⏭️ Push notifications toggle
  - ⏭️ Email notifications toggle
- ⏭️ Profile editing screen

### Onboarding Flow
- ⏭️ Add `onboarding_completed` field to users table
- ⏭️ Create onboarding screens:
  - ⏭️ Welcome screen
  - ⏭️ Feature explanation (Love Decoder, Coach, Insights)
  - ⏭️ Optional: Basic preferences collection
- ⏭️ Navigation logic to show onboarding on first launch
- ⏭️ Skip/Complete onboarding functionality

### Advanced Features
- ⏭️ Voice message analysis
- ⏭️ Screenshot upload & OCR
- ⏭️ Couple mode (connect two accounts)
- ⏭️ AI-powered date idea generator
- ⏭️ Push notifications for coach replies
- ⏭️ Advanced analytics dashboard
- ⏭️ Internationalization (i18n)
- ⏭️ Dark mode support
- ⏭️ Social login (Google, Apple)

---

## Notes

**Current Status:** Initial setup phase completed. Ready to begin Phase 2 (Shared Packages).

**Next Immediate Tasks:**
1. Create GitHub repository and push code
2. Set up external services (Supabase, RevenueCat, OpenAI)
3. Begin implementing shared packages

**Blockers:** None currently

**Last Updated:** 2026-01-10
