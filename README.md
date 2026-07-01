# Projectory - Project Management Web App

Projectory is a full-stack project management dashboard for planning, tracking, and reviewing digital projects across design, web development, and mobile app work. It combines project records, analytics, workflow status tracking, rich project documentation, client details, resource links, notifications, and a drag-and-drop Kanban board in one responsive dark glassmorphic interface.

## Preview

![Projectory app preview](./public/preview.png)

## Features

### Dashboard

- Workspace overview with live project metrics.
- Stat cards for total projects, in-progress projects, completed projects, critical priority, and important priority.
- Project velocity chart for recent project creation trends.
- Priority distribution chart across critical, urgent, high, important, major, minor, low, and quick-win work.
- Status distribution chart across the full workflow.
- Project type chart for UI/UX Design, Web Development, and Mobile App Development.
- Recent projects and critical items sections.
- Dashboard filtering by Tech Stack and Tools Used.

### Project Management

- Create, view, edit, and delete projects.
- Search projects by name, description, creator name, and company.
- Filter projects by status, project type, category, priority, device, tech stack, and tools used.
- Sort projects by newest, oldest, name A-Z, and name Z-A.
- Project cards with badges, metadata, tech/tool chips, creator details, company, and end date.
- Delete confirmation dialog to prevent accidental removals.

### Project Forms

- Multi-section project creation and editing workflow.
- Project information fields for name, high-level project type, category, status, priority, effort, device, creator, company, and industry.
- Timeline fields for start date, end date, and deadline.
- Client information fields for name, email, phone, and address.
- Preview link and dynamic resource links with title and URL.
- Rich text project description.
- Rich text strategy fields for short overview, business goal, target audience, and competitors.
- Tags, Tech Stack, and Tools Used support.

### Project Details

- Dedicated details page for each project.
- Status-aware hero header and badge system.
- Creator, company, client, timeline, links, strategy, tech stack, tools, and tags sections.
- Rich text rendering for project descriptions and strategy content.
- Status history log showing project creation status and later status transitions.
- Quick edit and delete actions.

### Kanban Board

- Horizontal Kanban board grouped by project status.
- Supports 17 workflow states: Research, Planning, In Progress, Review, On Hold, Completed, Cancelled, Archived, Pending Approval, Approved, Rejected, Needs Revision, In Testing, Ready for Deployment, Deployed, Maintenance, and Closed.
- Drag and drop projects between status columns.
- Status updates are saved through the API and logged in project history.
- Board filtering by Tech Stack and Tools Used.
- Compact project cards with priority, type, creator, and deadline.

### Authentication

- Login page and session-aware auth provider.
- API routes for login, logout, current user, and admin/user seeding.
- Password hashing with bcryptjs.
- JWT-based authentication helpers.

### Notifications

- In-app notification data model and notification routes.
- Project creation notifications.
- Project status change notifications.
- Read/unread support and active notification filtering.
- Client-side notification update events for responsive UI refreshes.

### Data And Lookup Options

- PostgreSQL-backed project records through Prisma ORM.
- Tech Stack and Tools Used lookup tables.
- JSON storage for tags, resource links, tech stack, and tools used.
- Project status log table for workflow history.
- `creatorName` is mapped to the database `owner` column for backward compatibility.

## Tech Stack

### Frontend

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Recharts
- TipTap rich text editor
- Lucide React icons
- Base UI and shadcn-style local components

### Backend

- Next.js Route Handlers
- Prisma ORM 7
- PostgreSQL / Neon PostgreSQL
- Zod validation
- bcryptjs password hashing
- jsonwebtoken authentication
- Node.js `pg` database driver

### Tooling

- npm scripts
- Prisma Client generation
- TypeScript configuration
- PostCSS and Tailwind CSS
- Vercel Analytics package included

## Main Functions

### Project Workflow

- Add a project with complete business, client, timeline, strategy, and technical metadata.
- Browse all projects in a searchable, filterable list.
- Open a project details page for full context.
- Edit project data without losing status history.
- Delete projects with confirmation.
- Move projects across workflow stages from the Kanban board.
- Track every status change in a project history log.

### Analytics Workflow

- Load dashboard totals from the database.
- Group projects by status, type, and priority.
- Show recent monthly project trends.
- Filter analytics by selected tech stack and tools.
- Keep chart labels stable even when some categories have zero projects.

### Notification Workflow

- Generate notifications when a project is created.
- Generate notifications when a project status changes.
- Fetch notifications for the authenticated user.
- Mark notification records as read or keep only active items visible.

## API Routes

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/projects` | `GET` | List all projects |
| `/api/projects` | `POST` | Create a project |
| `/api/projects?id={id}` | `GET` | Fetch one project by query id |
| `/api/projects/[id]` | `GET` | Fetch one project by route id |
| `/api/projects/[id]` | `PATCH` | Update project fields or status |
| `/api/projects/[id]` | `DELETE` | Delete a project |
| `/api/projects/seed` | `GET` | Seed sample project data |
| `/api/dashboard` | `GET` | Fetch dashboard stats and grouped analytics |
| `/api/dashboard/velocity` | `GET` | Fetch daily project velocity data |
| `/api/options?type=tech` | `GET` | Fetch tech stack lookup options |
| `/api/options?type=tool` | `GET` | Fetch tools lookup options |
| `/api/auth/login` | `POST` | Log in a user |
| `/api/auth/logout` | `POST` | Log out a user |
| `/api/auth/me` | `GET` | Fetch the current authenticated user |
| `/api/auth/seed` | `POST` | Seed an initial auth user |
| `/api/notifications` | `GET` | Fetch notifications for the current user |
| `/api/notifications/[id]` | `PATCH` | Update a notification, such as marking it read |

## Database Models

- `User`: authenticated users with email, hashed password, name, and notification relation.
- `Project`: complete project record with metadata, client details, rich text fields, JSON arrays, timestamps, and workflow relations.
- `Notification`: in-app notification records tied to users and projects.
- `ProjectStatusLog`: status transition history for each project.
- `TechOption`: reusable tech stack options.
- `ToolOption`: reusable tools-used options.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local` in the project root:

```env
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
NEXT_PUBLIC_API_URL="http://localhost:3000"
NODE_ENV="development"
```

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. Push the database schema

```bash
npm run db:push
```

### 5. Run the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Available Scripts

```bash
npm run dev              # Start the Next.js development server
npm run build            # Create a production build
npm run start            # Start the production server
npm run lint             # Run ESLint
npm run prisma:generate  # Generate Prisma Client
npm run db:push          # Push Prisma schema to the database
```

## Seed Data

With the development server running, seed sample project data:

```bash
curl http://localhost:3000/api/projects/seed
```

Seed the initial auth user:

```bash
curl -X POST http://localhost:3000/api/auth/seed
```

## Project Structure

```text
app/
  api/                 Route handlers for projects, auth, dashboard, options, and notifications
  board/               Kanban board page
  login/               Login page
  notifications/       Notifications page
  profile/             Profile page
  projects/            Project list, create, details, and edit pages
  settings/            Settings page
components/
  dashboard/           Dashboard charts and summary widgets
  ui/                  Reusable UI controls
  app-shell.tsx        Application shell
  badges.tsx           Status, type, priority, effort, and device badges
  rich-text-editor.tsx TipTap editor
  rich-text-viewer.tsx Rich text display
lib/
  api.ts               Project and dashboard data functions
  auth.ts              Authentication helpers
  notification-*.ts    Notification logic and client helpers
  prisma.ts            Prisma client setup
prisma/
  schema.prisma        Database schema
public/
  preview.png          README preview image
types/
  index.ts             Shared TypeScript types
```

## Design Notes

- Dark glassmorphic UI with translucent cards, soft borders, and gradient action buttons.
- Responsive layouts for dashboard, project list, project forms, details, and board views.
- Badge-driven visual categorization for fast scanning.
- Rich text editing supports structured project documentation directly inside project records.
- Dashboard and board filters reuse Tech Stack and Tools Used lookup data for consistent reporting.

