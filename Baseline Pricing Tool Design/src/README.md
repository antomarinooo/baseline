# Baseline

A responsive web application that helps freelancers calculate minimum acceptable project prices using structured inputs and deterministic logic.

## Overview

Baseline provides a smart pricing calculator with three user tiers:
- **Preview Mode**: 5 calculations without an account
- **Free Account**: 5 calculations per account with authentication
- **Full License**: Unlimited calculations with license key

## Features

- **Smart Pricing Calculator**: Calculate baseline prices based on hours, hourly rate, risk multiplier, and complexity factor
- **User Authentication**: Secure signup and login with Supabase Auth
- **Device Fingerprinting**: Fair usage enforcement to prevent multi-account abuse
- **Responsive Design**: Desktop-first two-column layout with mobile stacked layout
- **Multi-language Support**: English and Spanish interface
- **Privacy-First**: No tracking, minimal data collection, transparent policies
- **Modern UI**: Clean design with custom components, tooltips, and smooth interactions

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS v4
- **Backend**: Supabase (Auth + Database + Edge Functions)
- **Build Tool**: Vite
- **Hosting**: Vercel

## Project Structure

```
baseline/
├── App.tsx                          # Main application component
├── main.tsx                         # React entry point
├── index.html                       # HTML template
│
├── components/
│   ├── baseline/                    # Core UI components
│   │   ├── Alert.tsx               # Alert messages (success/error/warning)
│   │   ├── Footer.tsx              # Footer with links
│   │   ├── SegmentedControl.tsx    # Toggle control component
│   │   ├── Slider.tsx              # Range slider component
│   │   ├── Tooltip.tsx             # Tooltip component
│   │   └── Tutorial.tsx            # Tutorial overlay
│   ├── CookieConsent.tsx           # Cookie consent banner
│   ├── LanguageProvider.tsx        # i18n context provider
│   ├── PrivacyModal.tsx            # Privacy policy modal
│   └── TermsModal.tsx              # Terms of use modal
│
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx           # Edge function (Hono server)
│           └── kv_store.tsx        # Key-value storage utility
│
├── utils/
│   ├── deviceFingerprint.ts        # Device identification
│   └── supabase/
│       ├── client.tsx              # Supabase client singleton
│       └── info.tsx                # Supabase project configuration
│
├── imports/                         # SVG assets from Figma
├── styles/
│   └── globals.css                 # Global styles + Tailwind v4 config
│
└── [config files]                   # package.json, tsconfig, vite.config, etc.
```

## Key Components

### Calculator Logic
The calculator computes minimum acceptable pricing using:
```
Base Price = Hours × Hourly Rate
Risk-Adjusted Price = Base Price × Risk Multiplier
Final Price = Risk-Adjusted Price × Complexity Factor
```

### Authentication Flow
1. User can use calculator 5 times without account (localStorage tracking)
2. After limit, prompted to sign up
3. Signup creates account with email verification ready
4. Free accounts get 5 calculations (tracked in database)
5. Licensed users get unlimited calculations

### Security Features
- Device fingerprinting prevents multi-account creation
- Secure session management with Supabase Auth
- Service role key isolated to server-side code
- HTTPS-only connections
- Security headers configured

### Usage Tracking
- **Preview Mode**: Tracked in localStorage (`baseline_preview_calculations`)
- **Free Accounts**: Tracked in database (`user:{userId}`)
- **Devices**: Tracked in database (`device:{fingerprint}`)

## Environment Variables

Required environment variables (set in Vercel):

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_DB_URL=postgresql://postgres:[password]@[host]:5432/postgres
```

Also update `/utils/supabase/info.tsx`:
```tsx
export const projectId = 'your-project-id';
export const publicAnonKey = 'your_anon_key_here';
```

## Database Schema

Uses a single key-value table (`kv_store_a15ad91a`) with different key prefixes:
- `user:{userId}` - User data (email, name, calculations count, license status)
- `device:{fingerprint}` - Device tracking (user ID, timestamps)
- `license:{key}` - License key validation (currently placeholder)

## API Endpoints

Edge function endpoints (`/functions/v1/make-server-a15ad91a/...`):
- `POST /signup` - Create new user account
- `POST /verify-device` - Check if device is registered
- `POST /track-device` - Track device after signup/login
- `POST /verify-email` - Email verification (placeholder)
- `POST /verify-recaptcha` - reCAPTCHA verification (unused, kept for compatibility)

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment Notes

### Supabase Edge Function
Deploy the server function:
```bash
supabase functions deploy make-server-a15ad91a
```

Set required secrets:
```bash
supabase secrets set SUPABASE_URL=...
supabase secrets set SUPABASE_ANON_KEY=...
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...
supabase secrets set SUPABASE_DB_URL=...
```

### Vercel
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Add all environment variables in Project Settings

## License

Private - All rights reserved

---

Built with React, TypeScript, Tailwind CSS, and Supabase
