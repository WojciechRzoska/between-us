# External Services Setup Guide

This guide walks you through setting up all external services for the Between Us app.

## 1. Supabase Setup

### Create Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name:** `betweenUs`
   - **Database Password:** Generate strong password (save this!)
   - **Region:** Choose closest to your users (e.g., US East, EU West)
   - **Pricing Plan:** Free tier (good for development)
5. Click **"Create new project"** and wait 2-3 minutes

### Get API Credentials

1. Go to **Project Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **Publishable key** (anon) - Safe for mobile/browser with RLS
   - **Secret key** - Backend only, KEEP THIS SECRET!

### Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider:
   - Toggle "Email" to ON
   - **Confirm email:** Enable for production, disable for development
   - **Secure email change:** Recommended ON
   - **Minimum password length:** 6 (Supabase default)
   - Click **Save**

3. (Optional) Configure email templates:
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation and password reset emails

**Note on Password Requirements:**
- Supabase dashboard only allows setting minimum length
- For stronger validation (uppercase, lowercase, digits, symbols), we enforce this in the **shared-validation** package using Zod schemas
- This ensures both mobile (client-side) and backend (server-side) validate the same rules

### Create Database Schema

1. Go to **SQL Editor**
2. Create a new query and run this SQL:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Users can only read their own data
create policy "Users can view own data"
  on public.users for select
  using (auth.uid() = id);

-- Subscriptions table
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  tier text not null check (tier in ('free', 'premium', 'premium_plus')),
  status text not null check (status in ('active', 'canceled', 'expired')),
  revenue_cat_customer_id text,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Usage logs table
create table public.usage_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  feature text not null check (feature in ('love_decoder', 'coach', 'insights')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.usage_logs enable row level security;

create policy "Users can view own usage"
  on public.usage_logs for select
  using (auth.uid() = user_id);

-- Analyses table (Love Decoder history)
create table public.analyses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  input_text text not null,
  context text,
  result jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.analyses enable row level security;

create policy "Users can view own analyses"
  on public.analyses for select
  using (auth.uid() = user_id);

-- Conversations table (Coach feature)
create table public.conversations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.conversations enable row level security;

create policy "Users can view own conversations"
  on public.conversations for select
  using (auth.uid() = user_id);

-- Messages table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.messages enable row level security;

create policy "Users can view messages from own conversations"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

-- Insights table
create table public.insights (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  content text not null,
  viewed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.insights enable row level security;

create policy "Users can view own insights"
  on public.insights for select
  using (auth.uid() = user_id);

-- Function to create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);

  insert into public.subscriptions (user_id, tier, status)
  values (new.id, 'free', 'active');

  return new;
end;
$$ language plpgsql security definer;

-- Trigger to auto-create profile
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

3. Click **Run** to execute

### Test Connection

You can test your Supabase connection using the SQL Editor or the project dashboard.

---

## 2. OpenAI Setup

### Get API Key

1. Go to https://platform.openai.com
2. Sign up or log in
3. Go to **API Keys** (https://platform.openai.com/api-keys)
4. Click **"+ Create new secret key"**
5. Name it: `betweenUs-backend`
6. Copy the key (starts with `sk-`) - **You can only see this once!**
7. Save it securely

### Set Billing

1. Go to **Settings** → **Billing**
2. Add payment method
3. Set usage limits (recommended: $10-20/month for development)
4. Enable email alerts for usage

### Notes
- GPT-4o pricing: ~$2.50 per 1M input tokens, ~$10 per 1M output tokens
- Expected cost: ~$0.01-0.05 per conversation/analysis
- Free tier credits may be available for new accounts

---

## 3. RevenueCat Setup

### Create Account

1. Go to https://www.revenuecat.com
2. Sign up (free tier available)
3. Create a new app

### Create iOS App

1. Click **"Apps"** → **"+ New"**
2. Select **"iOS"**
3. Fill in:
   - **App name:** Between Us
   - **Bundle ID:** `com.yourcompany.betweenus` (must match app.json)
4. Click **"Save"**

### Create Android App

1. Click **"Apps"** → **"+ New"**
2. Select **"Android"**
3. Fill in:
   - **App name:** Between Us
   - **Package name:** `com.yourcompany.betweenus` (must match app.json)
4. Click **"Save"**

### Configure Products (Subscriptions)

1. Go to **"Products"** → **"+ New"**
2. Create **Premium** subscription:
   - **Identifier:** `premium_monthly`
   - **Type:** Subscription
   - Click **"Save"**
3. Create **Premium Plus** subscription:
   - **Identifier:** `premium_plus_monthly`
   - **Type:** Subscription
   - Click **"Save"**

### Set Up App Store Connect (iOS) - Later Step

You'll need to:
1. Create app in App Store Connect
2. Configure in-app purchases there
3. Link to RevenueCat using Shared Secret

### Set Up Google Play Console (Android) - Later Step

You'll need to:
1. Create app in Google Play Console
2. Configure in-app products there
3. Link to RevenueCat using Service Credentials JSON

### Get API Keys

1. Go to your app in RevenueCat
2. Click **"API Keys"** in the left sidebar
3. Copy:
   - **Public API Key** for iOS
   - **Public API Key** for Android
   - **Secret API Key** (for backend webhook verification)

### Configure Webhook

1. Go to **"Integrations"** → **"Webhooks"**
2. Click **"+ Add"**
3. Fill in:
   - **URL:** `https://your-backend-url.com/api/v1/webhooks/revenuecat`
   - **Authorization:** Will use secret key validation
4. Click **"Add Webhook"**
5. Copy the **Webhook Secret** for backend validation

**Note:** For local development, use ngrok:
```bash
ngrok http 3000
# Use the https URL: https://abc123.ngrok.io/api/v1/webhooks/revenuecat
```

---

## 4. Environment Variables Setup

### Backend (.env)

Create `apps/backend/.env` (copy from `.env.example`):

```bash
cp apps/backend/.env.example apps/backend/.env
```

Then fill in your actual values:

```env
NODE_ENV=development
PORT=3000

SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_PUBLISHABLE_KEY=eyJhbG...
SUPABASE_SECRET_KEY=eyJhbG...

OPENAI_API_KEY=sk-...

REVENUECAT_API_KEY=YOUR_SECRET_KEY
REVENUECAT_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET

JWT_SECRET=generate-a-random-string-here-use-openssl-rand-base64-32
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081,exp://localhost:8081
```

### Mobile (.env)

Create `apps/mobile/.env` (copy from `.env.example`):

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

Then fill in:

```env
API_URL=http://localhost:3000/api/v1

SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_PUBLISHABLE_KEY=eyJhbG...

REVENUECAT_API_KEY_IOS=rcb_YOUR_IOS_KEY
REVENUECAT_API_KEY_ANDROID=rcb_YOUR_ANDROID_KEY
```

---

## 5. Verify Setup

### Test Supabase

```bash
cd apps/backend
# Create a simple test script or use curl
curl -X POST https://YOUR_PROJECT.supabase.co/auth/v1/signup \
  -H "apikey: YOUR_PUBLISHABLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test OpenAI

```bash
cd apps/backend
pnpm dev
# Once backend is running, it will validate the OpenAI key on startup
```

### Test RevenueCat

RevenueCat can be tested once you:
1. Build the custom dev client with RevenueCat plugin
2. Run the app on a device
3. Use RevenueCat's sandbox mode for testing purchases

---

## Security Checklist

- [ ] Never commit `.env` files (they're in `.gitignore`)
- [ ] Use different API keys for development/production
- [ ] Enable Row Level Security (RLS) on all Supabase tables
- [ ] Set usage limits on OpenAI account
- [ ] Use RevenueCat's sandbox mode for testing
- [ ] Rotate secrets if accidentally exposed
- [ ] Set up monitoring/alerts for API usage

---

## Next Steps

After completing this setup:

1. Start building shared packages (types, validation, constants)
2. Implement backend API endpoints
3. Create mobile app screens
4. Test end-to-end flows

See [TASKS.md](TASKS.md) for the full implementation roadmap.
