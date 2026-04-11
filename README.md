# PinkLabs — Web Development Agency

A production-ready, fully dynamic CMS-powered agency website with dark mode, rich portfolio modals, and a complete admin dashboard.

![PinkLabs](https://img.shields.io/badge/PinkLabs-Agency-E91E63?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIwLjg0IDQuNjFhNS41IDUuNSAwIDAgMC03Ljc4IDBMMTIgNS42N2wtMS4wNi0xLjA2YTUuNSA1LjUgMCAwIDAtNy43OCA3Ljc4bDEuMDYgMS4wNkwxMiAyMS4yM2w3Ljc4LTcuNzggMS4wNi0xLjA2YTUuNSA1LjUgMCAwIDAgMC03Ljc4eiIvPjwvc3ZnPg==)

## ✨ Features

- **Dynamic CMS** — All content powered by Supabase (hero, services, portfolio, pricing, FAQ, testimonials, team)
- **Dark Mode** — Persistent theme toggle with system preference detection
- **Rich Portfolio** — Expandable project cards with tech stacks, live links, GitHub repos, and image galleries
- **Admin Dashboard** — Full CRUD admin panel at `/admin` with auth
- **Contact Form** — Lead capture with Supabase integration
- **Professional SVG Icons** — Zero emojis, all Feather/Lucide-style vector icons
- **Responsive Design** — Mobile-first, works on all screen sizes
- **Security Headers** — XSS protection, clickjacking prevention, content-type enforcement

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/Unique-newbie/PinkLabs.git
cd PinkLabs
```

### 2. Configure Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase-schema.sql` in the Supabase SQL Editor
3. Update `config.js` with your project URL and anon key:
```js
const PINKLABS_CONFIG = {
  SUPABASE_URL: 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: 'your-anon-key-here',
};
```

### 3. Create Admin User
Go to Supabase → Authentication → Add User → Enter email & password

### 4. Run Locally
Open `index.html` in a browser, or use a local server:
```bash
npx serve .
```

## 📁 Project Structure

```
PinkLabs/
├── index.html          # Main public website
├── reachout.html        # Contact/reach out page
├── admin.html           # Admin dashboard (hidden, noindex)
├── style.css            # All site styles + dark mode
├── script.js            # Public site logic
├── admin.js             # Admin panel logic
├── admin.css            # Admin dashboard styles
├── config.js            # Supabase credentials (edit this!)
├── vercel.json          # Vercel deployment config
├── supabase-schema.sql  # Database schema (16 tables)
└── images/              # Static images
```

## 🔧 Configuration

All configuration lives in `config.js`. The Supabase anon key is **public by design** — security is enforced through Row Level Security (RLS) policies on the database.

## 🌐 Deployment

Deployed on [Vercel](https://vercel.com). Clean URLs like `/admin` and `/reachout` are configured via `vercel.json`.

## 🛡️ Security

- Admin portal is `noindex, nofollow` and not linked from the public site
- Supabase RLS policies protect all database operations
- Security headers configured in `vercel.json`

## 📄 License

MIT © PinkLabs
