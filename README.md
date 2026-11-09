# ArchConnect | Architect & Interior Designer Portfolio & Client Connect Portal

A responsive full-stack web application connecting property owners, home builders, and commercial clients with accredited architects and interior design professionals. Developed in alignment with statutory standards set by the **Council of Architecture (COA)** and the **Indian Institute of Interior Designers (IIID)**.

---

## 🏛️ Platform Pages (8 Interconnected Pages)

1. **Home / Discovery (`/`)**:
   - City & specialization search (Bangalore, Mumbai, Goa, Delhi NCR, Kochi, Pune).
   - Real project categories: Residential Villas, Apartment & Penthouse Interiors, Commercial Workspaces, Holiday Homes.
   - Featured studio showcases with COA registration badges, city, and verified reviews.
   - 3-step commissioning workflow explanation.

2. **Architect & Designer Directory (`/designers`)**:
   - Multi-filtering by location (city), specialization, design style, and budget range in Rupees.
   - Sort by highest rating, years of experience, review count, and registration date.
   - Project preview thumbnails, verified registration badges, and direct portfolio links.

3. **Studio Portfolio & Profile (`/designers/:id`)**:
   - Detailed studio profile, Council of Architecture (COA) registration number, practice philosophy.
   - Categorized completed projects with drawings and photographs.
   - Project specs: location, completion year, built-up / carpet area (sq.ft), estimated budget in Lakhs/Crores.
   - Photo gallery lightbox with multi-photo carousel and thumbnail selector.
   - Verified client reviews with star ratings.
   - "Send Project Inquiry" modal.

4. **Inquiry & Project Communication Hub (`/inquiries/:id`)**:
   - Project brief display: Plot / carpet area, site city, estimated budget, timeline, scope.
   - Status workflow (`Pending Review`, `Under Review`, `Accepted (Scope Active)`, `Declined`, `Completed Engagement`).
   - Designers and admins can update scope status directly.
   - Chronological message feed between client and architect with send box.
   - Print scope brief option.

5. **Authentication Portal (`/login` & `/register`)**:
   - Clean registration for **Clients** and **Architects / Interior Designers** (with studio name, experience, city, budget tier).
   - Test login credentials helper for fast reviewer evaluation.

6. **Client Dashboard (`/client/dashboard`)**:
   - Overview metrics: Total Inquiries, Active Discussions, Completed Contracts.
   - Inquiries list with status badges, latest message preview, and direct thread link.

7. **Architect Studio Workspace (`/designer/dashboard`)**:
   - Studio statistics (portfolios published, active client inquiries, rating, experience).
   - Full Portfolio CRUD: Add Project modal (with image file upload or URL, category, sq.ft, budget in ₹, city), Edit, Delete.
   - Inquiries Inbox: Accept scope, change status, and reply to client inquiries.
   - Studio Profile Settings: Edit firm name, bio, city, budget tier, and COA registration number.

8. **Admin Governance Console (`/admin`)**:
   - Key platform metrics (total designers, clients, portfolios, inquiries, conversion rate).
   - User Management table: Search users, filter by role, toggle COA verification badges, toggle spotlight status, delete users.
   - Portfolio Content Moderation: Inspect and remove non-compliant project entries.

---

## 🔑 Test Credentials for Evaluation

The login page (`/login`) includes one-click autofill buttons for these test accounts:

| Role | Email | Password | Details |
|---|---|---|---|
| 🏡 **Client** | `client@architectportal.com` | `password123` | Amit & Neha Verma (Homeowners building a villa) |
| 🏛️ **Architect** | `designer@architectportal.com` | `password123` | Ar. Rajesh Nair (Studio Vismaya, CA/2009/44120) |
| 👑 **Admin** | `admin@architectportal.com` | `password123` | Pooja Sharma (Portal Administrator) |

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Axios, React Router 6.
* **Backend**: Node.js, Express.js REST API, JSON Web Tokens (JWT), bcryptjs password hashing.
* **Database**: Prisma ORM with SQLite for zero-config persistence (`dev.db`).
* **Design Philosophy**: Clean, standard, professional layouts without artificial gimmicks or emojis.

---

## 🚀 Running the Project

### Development Mode
```bash
# Starts both Express API on port 5000 and Vite on port 5173
node dev.js
```
* **Frontend**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

### Re-seed Database with Clean Data
```bash
node server/prisma/seed.js
```

### Production Build & Unified Server
```bash
npm run build
node start.js
```
The server serves both the REST API and the built client on `http://localhost:5000`.
