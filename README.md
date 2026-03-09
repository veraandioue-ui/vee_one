# Content Digest App

AI-powered content digest tool with multi-user support and magic link login.

## Setup 

### 1. Supabase
1. Go to supabase.com → New project
2. Go to SQL Editor → paste contents of `supabase_setup.sql` → Run
3. Go to Project Settings → API → copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`
4. Go to Authentication → URL Configuration → add your Vercel app URL to "Site URL"

### 2. Vercel Environment Variables
Add these in Vercel → Settings → Environment Variables:
- `ANTHROPIC_API_KEY` = your Anthropic key
- `VITE_SUPABASE_URL` = your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

### 3. Deploy
Push to GitHub → Vercel auto-deploys.
