# LeadFlow CRM 🚀

A Smart Client Lead Management System built for freelancers, agencies, and small startups.

🔴 **Live Demo:** [https://leadflow-crm-rouge.vercel.app/](https://leadflow-crm-rouge.vercel.app/)

## 🎯 What is LeadFlow?

LeadFlow helps you capture, track, and convert incoming leads into paying clients. Instead of losing track of emails and follow-ups, LeadFlow gives you a centralized dashboard that tracks exactly where every prospective client is in your sales pipeline.

### Core Features:
- **Real-time Dashboard:** Instantly see your conversion rates and pipeline health. 
- **Pipeline Tracking:** Move leads effortlessly from `New` → `Contacted` → `Converted`.
- **Follow-up Notes System:** Keep timestamped logs of calls, emails, and meetings for every lead so you never forget context.
- **Secure Authentication:** Protected behind a robust Supabase login system.

## 🏗 Architecture & Tech Stack

This project is built using a modern SaaS architecture:

- **Frontend UI Framework:** React 18 + TypeScript + Vite
- **Styling & Components:** Tailwind CSS + shadcn/ui + Framer Motion (for smooth micro-animations)
- **State & Data Fetching:** React Query (`@tanstack/react-query`) for instant cache UI updates
- **Backend & Database:** Supabase (PostgreSQL)
- **Real-time Sync:** Supabase Realtime Channels (Dashboard updates instantly when new leads arrive)

### Key Files Addressed:
- `src/hooks/useLeads.ts` – Handles fetching, creating, updating leads, and **real-time subscriptions**.
- `src/services/supabaseApi.ts` – The API layer communicating directly with your Supabase database.
- `src/components/LeadDetailPanel.tsx` – The slide-out modal for interacting deep into a single lead's history.

## 🔑 Database Schema Setup

To run this backend, these are the tables you must have in your Supabase SQL Editor:

**1. Leads Table**
```sql
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'New',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

**2. Lead Notes Table**
```sql
CREATE TABLE public.lead_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```
*(Row Level Security (RLS) is required for both to ensure secure public usage.)*

## 🛠 Local Development

```sh
# 1. Install dependencies
npm install

# 2. Setup environment variables (.env)
# VITE_SUPABASE_PROJECT_ID="your-project-id"
# VITE_SUPABASE_URL="https://your.supabase.co"
# VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-role-key"

# 3. Start the Vite server
npm run dev
```

## 🌍 Deployment

This project is currently deployed and hosted on Vercel:
**Live Application:** [https://leadflow-crm-rouge.vercel.app/](https://leadflow-crm-rouge.vercel.app/)

*If you wish to deploy your own instance:*

### Recommended Deployment Providers:
1. **Vercel** (Highly Recommended for Vite/React)
2. **Netlify**
3. **Cloudflare Pages**

**To Deploy via Vercel:**
1. Push this code to a GitHub repository.
2. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Add your `.env` variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`) to the Vercel Environment Variables settings.
5. Click **Deploy**.

Vercel will automatically detect that it is a Vite React project, run `npm run build`, and host your high-speed CRM! 🚀
