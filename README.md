# BetterDose — Complete Website Documentation

> A comprehensive reference for everything built, every page, every feature, every design decision, and the Supabase architecture.

---

## 1. Business Identity

| Field | Value |
|---|---|
| Business Name | BetterDose |
| Founder & Director | Nebiyu Muluadam |
| Senior Developer | Eyob Mulugeta |
| Senior Developer | Abel Tadesse |
| Registration Country | United Kingdom |
| Operating Location | Addis Ababa, Ethiopia |
| Industry | Software Development & Digital Services |
| Contact Email | contact@betterdose.website |

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (React, App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| Fonts | Inter (Google Fonts) |
| Database | Supabase PostgreSQL |
| Media Storage | Supabase Storage (portfolio-images, team-photos, documents buckets) |
| Authentication | Web Crypto API — SHA-256 hashing |
| Deployment Target | Vercel |

---

## 3. How to Run

### Local Setup:

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables in a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

Open `http://localhost:3000` in your browser.

---

## 4. Supabase Integration & Database Schema

The persistence layer has been migrated from browser `localStorage` to a secure, production-ready Supabase PostgreSQL backend.

### Database Tables:
*   `projects`: Stores detailed information about each project (features, outcome, challenges, screenshots, etc.).
*   `business_config`: Stores editable configurations like contact links, phone numbers, and social URLs.
*   `team_members`: Stores information about team members (roles, university/professional emails, bio, skills, profile photos).
*   `activity_entries`: Stores dynamic updates about builds, shipments, and development events.

### Storage Buckets:
*   `portfolio-images`: Holds project screenshots.
*   `documents`: Holds downloadable PDF profile files/resumes.
*   `team-photos`: Holds team profile photos.

### Security Model:
*   **Row-Level Security (RLS)** is enabled on all tables.
*   All public tables allow read-only (`SELECT`) access for the anonymous (`anon`) role.
*   All write/update/delete mutations are locked and handled on the server-side via Next.js API Routes using the `SUPABASE_SERVICE_ROLE_KEY`.

---

## 5. Admin Dashboard

The admin panel is located at `/admin` and allows direct management of website data.

| Field | Value |
|---|---|
| URL | `http://localhost:3000/admin` |
| Username | `admin` |
| Password | `betterdose2026` |
| Auth Method | SHA-256 hashed credentials |

### Admin Capabilities:
- **Projects Tab:** Create, edit, and delete projects. Upload screenshots directly to Supabase Storage.
- **Team Tab:** Manage team members, roles, biographies, skills, and upload profile photos.
- **Activity Tab:** Post and update development timeline logs.
- **Media Tab:** Browse, view, and upload assets directly to Supabase storage buckets.
- **Settings Tab:** Edit contact and social media profiles. 
- *Note: Legal Identity (Owner Name, UK Registry Number, Operating Address) is locked at the application layer to maintain formal compliance integrity.*

---

## 6. Complete Page Directory

### Public Pages (Next.js Server & Client Components)

- `/` — Home (Displays availability badge, services, payment options, and the three most recent projects).
- `/services` — Services (Detailed breakdown of custom software offerings).
- `/portfolio` — Portfolio (Presents Completed, Ongoing, and University projects fetched from Supabase).
- `/portfolio/[id]` — Project Details (Deep dive into project outcomes, features, architecture, screenshots, and links).
- `/activity` — Activity Logs (Dynamically lists chronological builds and deliveries).
- `/about` — About (Team profiles, skill listings, and academic AAU email contacts).
- `/business-info` — Corporate Registry (UK registry credentials, operating offices, and compliance statements).
- `/deliverables` — Deliverables (Clarifies exact deliverables like source code, REST APIs, and database structures).
- `/contact` — Contact Form (Direct client inquiry gateway).

---
