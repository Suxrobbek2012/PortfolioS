# 🚀 Suhrobbek Baxtiyorov — Portfolio

A stunning $10,000-level personal portfolio built with Next.js 14, TypeScript, Three.js, and Framer Motion.

## ✨ Features

- **5 Themes**: Dark Neon, Light Clean, Cyberpunk, Minimal Mono, Aurora
- **Three.js 3D Background**: Interactive floating geometric shapes
- **Framer Motion Animations**: Scroll-triggered reveals, staggered entries, page transitions
- **Custom Cursor**: Smooth lerp-based cursor with hover effects
- **Blog System**: MDX-powered blog with syntax highlighting
- **Admin Panel**: Full CMS with NextAuth.js protection
- **SEO Optimized**: Dynamic OG images, JSON-LD, sitemap, robots.txt
- **Prisma + SQLite**: Database with seed data

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + CSS Variables
- **Animations**: Framer Motion + Three.js
- **Database**: Prisma ORM + SQLite (dev) / PostgreSQL (prod)
- **Auth**: NextAuth.js (admin only)
- **Blog**: next-mdx-remote + gray-matter
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 🚀 Quick Start

### 1. Install dependencies

```bash
cd portfolio
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Set up the database

```bash
npm run db:push    # Create database schema
npm run db:seed    # Seed with demo data
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📁 Project Structure

```
portfolio/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Home page (all sections)
│   ├── blog/               # Blog pages
│   ├── admin/              # Admin panel (protected)
│   └── api/                # API routes
├── components/
│   ├── three/              # Three.js components
│   ├── sections/           # Page sections (Hero, About, etc.)
│   ├── layout/             # Navbar, Footer, ThemeSwitcher
│   ├── admin/              # Admin UI components
│   └── ui/                 # Reusable UI components
├── content/blog/           # MDX blog posts
├── lib/                    # Utilities (db, auth, mdx)
├── prisma/                 # Schema + seed
└── styles/                 # Global CSS + theme variables
```

## 🎨 Themes

| Theme | Background | Accent |
|-------|-----------|--------|
| Dark Neon | `#0a0a0a` | `#00ff88` |
| Light Clean | `#ffffff` | `#6366f1` |
| Cyberpunk | `#1a0030` | `#ff00ff` |
| Minimal Mono | `#111111` | `#ffffff` |
| Aurora | `#0d1117` | `#a855f7` |

## 🔐 Admin Panel

Access at `/admin/login` with credentials from `.env`:
- Email: `ADMIN_EMAIL`
- Password: `ADMIN_PASSWORD`

### Admin Features
- **Dashboard**: Stats overview
- **Projects**: CRUD management
- **Blog**: View MDX posts
- **Messages**: Read/delete contact messages
- **Skills**: CRUD management
- **Experience**: CRUD management
- **Settings**: Update bio, socials, stats

## 📝 Adding Blog Posts

Create a new `.mdx` file in `/content/blog/`:

```mdx
---
title: "My New Post"
excerpt: "A brief description"
date: "2024-01-15"
tags: ["react", "tutorial"]
readTime: 5
published: true
---

# My New Post

Content here...
```

## 🌐 Deploy to Vercel

1. Push your repository to GitHub
2. Import the repo into Vercel
3. Open Vercel project settings → Environment Variables
4. Add these variables:
   - `NEXTAUTH_SECRET` = your strong secret (min 32 chars)
   - `NEXTAUTH_URL` = `https://your-app-name.vercel.app`
   - `DATABASE_URL` = `file:./dev.db` (for simple deploy) or a PostgreSQL URL
   - `ADMIN_EMAIL` and `ADMIN_PASSWORD` for admin login
5. Deploy and verify the site URL shown by Vercel
6. If using PostgreSQL, run `prisma db push` and `prisma db seed` in build

```bash
# vercel.json is included for optimal configuration
```

## 🔧 Customization

1. Update `prisma/seed.ts` with your real data
2. Replace `/public/images/profile.jpg` with your photo
3. Update `/public/cv.pdf` with your CV
4. Edit settings via Admin Panel → Settings

## 📄 License

MIT — feel free to use this as a template for your own portfolio!
