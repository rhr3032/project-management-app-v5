# Projectory - Project Management Web App

A modern, high-performance project management application built with Next.js and Prisma ORM, featuring a gorgeous dark glassmorphic user interface.

## Core Features

### 1. Dashboard Overview
- **Metrics Grid** - 5 key metrics cards with live counts:
  - **Total Projects**
  - **In Progress Projects**
  - **Completed Projects**
  - **Critical Priority Projects**
  - **Important Priority Projects** (added statistics card)
- **Project Velocity (Daily Trends)** - Interactive area chart detailing daily created, completed, and closed projects.
  - Supports separate **Month and Year filters** that dynamically fetch daily data.
  - X-axis renders all day ticks cleanly.
- **Priority Distribution (Projects by Priority)** - Dynamic bar chart displaying project counts for key priorities:
  - Displays exactly 8 sorted priorities: `Critical`, `Urgent`, `High`, `Important`, `Major`, `Minor`, `Low`, and `Quick Win`.
  - Supports separate **Month and Year filters** that run instant client-side updates.
- **Status Distribution (Projects by Status)** - Full-width dynamic bar chart tracking workflow progression.
  - Displays exactly 14 target statuses: `Research`, `In Progress`, `Review`, `On Hold`, `Completed`, `Cancelled`, `Pending Approval`, `Approved`, `Rejected`, `In Testing`, `Needs Revision`, `Maintenance`, `Deployed`, and `Ready for Deployment`.
  - Supports separate **Month and Year filters** with instant client-side re-aggregation.

### 2. Projects List & Filtering
- Interactive list layout showing project cards with badges, metadata, and tags.
- Search by project name, description, or **Creator Name** (formerly Owner Name).
- Powerful dropdown filters for **Project Type**, **Category**, **Priority**, and **Device**.
- Sort options by newest or oldest project first.

### 3. Project Creation & Editing
- Comprehensive multi-section forms for adding and modifying projects:
  - **Standard Fields** - Name, Category, High-level Type, Status, Priority, Effort, and Device.
  - **Creator Name** - Renamed from Owner Name across the application.
  - **Client Information** - Client Name, Email, Phone, and **Client Address** (text input).
  - **Industry** - Required dropdown selection mapped to 38 sorted options.
  - **Resource Links** - Dynamic URL and Title fields.
  - **Project Strategy (WYSIWYG)** - Interactive rich-text editors powered by TipTap for editing *Short Overview*, *Business Goal*, *Target Audience*, and *Competitors*.

### 4. Kanban Board
- Visual project pipeline grouped into columns by status.
- Cards show priorities, creators, tags, and formatted deadlines.

---

## Tech Stack

### Frontend & App Framework
- **Next.js 16** (App Router with Turbopack)
- **React 19**
- **Tailwind CSS v4** (Modern utilities and glassmorphic UI design)
- **Recharts** (Interactive charting library)
- **TipTap** (Rich text editing system)
- **Lucide React** (Modern SVG icon system)

### Backend & Database
- **Next.js Route Handlers** (API Endpoints)
- **Prisma ORM** (Database schema management & queries)
- **Neon PostgreSQL** (Serverless cloud database provider)
- **Zod** (Request payload validation)
- **Bcryptjs** (Password hashing)

---

## Database Integration

The application is fully integrated with PostgreSQL. The database schema in prisma/schema.prisma maps the logical `creatorName` to the underlying PostgreSQL `owner` column using `@map("owner")` to maintain full database backward compatibility.

### Setting Up Environment Variables

Create a `.env.local` file in the project root:

```env
# Neon PostgreSQL Connection String
DATABASE_URL="postgresql://username:password@hostname/neondb?sslmode=require"

# API URL Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Syncing the Database

To push the database schema and generate the Prisma Client, run:

```bash
# Push schema to PostgreSQL
npm run db:push

# Generate Prisma Client
npm run prisma:generate
```

### Seeding Test Data

A database seeder is included to seed 15 realistic projects with varied statuses, timelines, and priorities. To seed, run the development server and access `/api/projects/seed` via your browser or run:

```bash
curl http://localhost:3000/api/projects/seed
```

To seed initial Admin credentials (`rhr3032@yahoo.com` / `rhr3032`), run:

```bash
curl -X POST http://localhost:3000/api/auth/seed
```

---

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Browser**:
   Navigate to http://localhost:3000.

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## API Routes

- `GET /api/projects` - List all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/[id]` - Get single project details
- `PATCH /api/projects/[id]` - Update project fields
- `DELETE /api/projects/[id]` - Delete a project
- `GET /api/dashboard` - Get aggregated dashboard statistics and projects light metadata
- `GET /api/dashboard/velocity` - Fetch daily trend counts filtered by Month & Year
- `GET /api/projects/seed` - Clear and seed 15 realistic projects
- `POST /api/auth/seed` - Seed Admin account credentials

---

## Development Notes

- **Glassmorphic Styling** - Card elements use Tailwind custom classes to achieve modern semi-transparent blur backdrops.
- **Client Address & Industry** - These fields are stored as database columns (`clientAddress` and `industry`) and are fully accessible via forms and detail panels.
- **WYSIWYG Strategy Content** - Rich-text content generated by TipTap editors is safely stored as HTML strings in the database and rendered via `dangerouslySetInnerHTML` in the details panel.
