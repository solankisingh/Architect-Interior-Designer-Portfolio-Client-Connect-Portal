# AtelierConnect | Architect & Interior Designer Portfolio & Client Connect Portal

A modern, responsive full-stack web application designed for accredited architects, interior designers, and clients. Built in strict alignment with statutory professional standards (such as the **Council of Architecture (COA)** and the **Indian Institute of Interior Designers (IIID)**), the platform bridges the gap between independent design practices and property owners seeking bespoke architectural expertise.

---

## 🏛️ Key Features & Interconnected Pages (8 Pages)

1. **Home / Showcase Landing (`/`)**:
   - Hero search by studio name, specialization, or city.
   - Institutional standards ribbon (COA & IIID alignment).
   - Curated architectural disciplines (*Modern Minimalist, Biophilic Contemporary, Scandinavian, Industrial Loft*).
   - Featured studio showcases with live rating badges, location, and case study previews.
   - Platform statistics & commissioning workflow walkthrough.

2. **Designer Directory & Discovery (`/designers`)**:
   - Live multi-filtering by:
     - **Design Style**: Modern Minimalist, Biophilic Contemporary, Scandinavian, Industrial Loft, Neo-Classical, Mediterranean Warmth.
     - **Budget Tier**: `$`, `$$`, `$$$`, `$$$$`.
     - **Location & Specialization**: Residential, Penthouse, Commercial, Sustainable.
     - **Sort by**: Highest Rated, Years of Experience, Most Reviewed, Recently Joined.
   - Case study thumbnail previews, verified badges, and quick links.

3. **Designer Portfolio & Profile Detail (`/designers/:id`)**:
   - Studio cover header, credentials, COA/IIID accreditations, and philosophy.
   - Categorized portfolio projects with specifications (sq ft, completion year, estimated budget).
   - Interactive **Project Lightbox Modal**: Multi-photo carousel, thumbnail navigator, and detailed structural narratives.
   - Verified client reviews with 1–5 star ratings and project category tags.
   - Prominent **"Initiate Project Inquiry"** commission modal trigger.

4. **Inquiry View & Communication Hub (`/inquiries/:id`)**:
   - Complete project requirement brief (budget, timeline, location, scope).
   - Real-time status lifecycle tracker (`PENDING`, `UNDER_REVIEW`, `ACCEPTED`, `DECLINED`, `COMPLETED`).
   - Designers & Admins can update status directly from the view.
   - Threaded conversation feed between client and architect with message timestamps.

5. **Authentication Portal (`/login` & `/register`)**:
   - Dual-mode registration for **Clients** and **Designers/Architects** (with studio name, experience, styles, budget tier).
   - **🚀 1-Click Fast Demo Login Switcher**: Instant buttons to test as **Client**, **Architect**, or **Admin** with zero typing.

6. **Client Dashboard (`/client/dashboard`)**:
   - Overview metrics: Inquiries Sent, Active Discussions, Completed Projects.
   - Inquiries management table with status badges and latest message previews.
   - Quick inquiry opener and studio discovery.

7. **Designer Studio Dashboard (`/designer/dashboard`)**:
   - Studio performance KPI metrics (portfolios, inquiries, ratings, experience).
   - **Full Portfolio CRUD**: Add New Project modal, edit existing projects, and delete projects.
   - **Inquiries Inbox**: Review incoming client leads, update commission status (`Accept Scope`, `Under Review`, `Decline`), and reply to threads.
   - **Studio Settings Editor**: Update bio, taglines, base location, budget tier, and accreditations.

8. **Admin Governance & Moderation Console (`/admin`)**:
   - System KPIs: Registered Studios, Active Clients, Published Portfolios, Inquiries Submitted, Conversion Rate %.
   - User Management table: Search users, toggle COA verification badges, toggle spotlight status, delete accounts.
   - Portfolio Content Moderation: Inspect and remove non-compliant projects.

---

## ⚡ 1-Click Demo Accounts

A floating **Demo Switcher** widget is located at the bottom-right corner of all pages. Alternatively, use the following credentials on `/login`:

| Persona | Email | Password | Role & Purpose |
|---|---|---|---|
| 👑 **Platform Admin** | `admin@atelier.com` | `password123` | Elena Vance (Curator) — Superuser governance & KPIs |
| 🏛️ **Architect / Designer** | `designer@atelier.com` | `password123` | Ar. Vikramaditya Singhania — Principal Architect at Singhania Atelier |
| 🏡 **Client / Homeowner** | `client@atelier.com` | `password123` | Aarav & Meera Kapoor — Discerning property owners |

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Axios, React Router 6.
* **Backend**: Node.js, Express.js REST API, JSON Web Tokens (JWT), bcryptjs password hashing.
* **Database**: Prisma ORM with SQLite for zero-dependency local execution, effortlessly scalable to PostgreSQL or MongoDB for production.
* **Styling**: Minimalist luxury architectural design system (warm stone, obsidian charcoal, subtle gold/champagne accents, editorial typography).

---

## 🚀 Getting Started

### 1. Start Both Frontend and Backend (Development Mode)
```bash
# From project root:
node dev.js
```
* **Frontend**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

### 2. Re-seed Database with Sample Architectural Studios & Projects
```bash
node server/prisma/seed.js
```

### 3. Production Build & Unified Server
```bash
# Build frontend
npm run build

# Start unified production server (serves both API and SPA on port 5000)
node start.js
```
Visit [http://localhost:5000](http://localhost:5000) for the live unified production application.

---

## 🌐 Cloud Deployment (Render / Vercel / Railway)
The project includes unified single-port serving:
1. Set the root build command to: `npm run build`
2. Set the start command to: `node start.js`
3. Environment variables: `PORT=5000`, `JWT_SECRET=your-secret-key`, `DATABASE_URL="file:./dev.db"` (or Postgres connection string).
