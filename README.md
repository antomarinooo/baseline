# Baseline
<!-- Badges -->
![Last commit](https://img.shields.io/github/last-commit/antomarinooo/baseline)
![Open issues](https://img.shields.io/github/issues/antomarinooo/baseline)
![Stars](https://img.shields.io/github/stars/antomarinooo/baseline?style=social)
![License](https://img.shields.io/github/license/antomarinooo/baseline)
![Deployment](https://img.shields.io/website?down_color=red&down_message=down&up_color=green&up_message=online&url=https://baselineapp.figma.site)

A responsive web application that helps freelancers calculate minimum acceptable project prices using structured inputs and deterministic logic. Baseline is a pricing decision system built for freelancers who want clarity, not guesswork. It calculates a defensible price baseline for any project using structured inputs like project type, scope, timeline pressure, revision model, experience level, and personal capacity.

Rather than telling you “what to charge,” Baseline defines the minimum price that makes sense for the work and your current availability. Anything below that line is no longer negotiable. The result is a clear boundary you can use to price confidently, explain your rates, and avoid underpricing without relying on vague intuition or generic market averages.

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

## Credits

Thanks to the tools, libraries, and resources that made this project possible:

- [Shadcn UI](https://ui.shadcn.com) — component primitives and design patterns
- [Figma make](https://www.figma.com) — building and ui design
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling
- [React](https://reactjs.org) — UI library
- [Vercel](https://vercel.com) — deployment and hosting
- [Vite](https://vitejs.dev) — build tooling
- [Supabase](https://supabase.com) — login credentials backend

---

Developed by [@antomarinooo](https://github.com/antomarinooo)

© 2026 | Antonia C. Marino

## License

This project is licensed under the MIT License.
