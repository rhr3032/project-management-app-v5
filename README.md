# Project Hub - Project Management Web App

A comprehensive project management application built with Next.js, Express, and designed to match the exact UI/UX specifications provided.

## Features

- **Dashboard** - Overview of all projects with statistics and charts
  - Total Projects, In Progress, Completed, and Critical Priority counts
  - By Status chart showing project distribution
  - By Type chart showing design/web/mobile breakdown
  - Critical Items list
  - Recent Projects preview

- **Projects List** - Full project listing with powerful filtering and search
  - Search by project name or description
  - Filter by Status, Type, Priority, and Device
  - Sort by newest or oldest first
  - Full project cards with badges and metadata

- **New Project Form** - Create projects with comprehensive information
  - Project Info (name, type, status, priority, effort, device, owner)
  - Dates (start, end, deadline)
  - Client Information (name, email/phone)
  - Links (preview link and resource links)
  - Project Strategy (overview, business goal, target audience, competitors)
  - Tags support

- **Project Details** - View complete project information
  - All project metadata in organized sections
  - External links handling
  - Formatted dates and client contact info
  - Full strategy and context

- **Kanban Board** - Visual project organization by status
  - 5 status columns: Planning, In Progress, Review, On Hold, Completed
  - Project cards with key information
  - Status-based organization

- **Sidebar Navigation** - Easy access to all sections
  - Dashboard, Projects, Board links
  - Badge showing project counts
  - New Project button
  - Dark Mode toggle (placeholder)

## Tech Stack

### Frontend
- **Next.js 16** with App Router
- **React 19.2** with latest hooks
- **Tailwind CSS v4** for styling
- **TypeScript** for type safety
- **Lucide React** for icons

### Backend
- **Express.js** (ready for integration)
- **Node.js** runtime
- **Zod** for schema validation

### Database (Ready for Integration)
- **Neon PostgreSQL** - Add `DATABASE_URL` to `.env` when ready
- **Drizzle ORM** - Configured and ready
- Mock data service currently used (swappable)

## Project Structure

```
app/
├── layout.tsx           # Root layout with sidebar
├── page.tsx            # Dashboard page
├── api/
│   ├── dashboard/      # Dashboard data endpoints
│   └── projects/       # Projects CRUD endpoints
├── projects/
│   ├── page.tsx        # Projects list
│   ├── new/
│   │   └── page.tsx    # New project form
│   └── [id]/
│       └── page.tsx    # Project details
└── board/
    └── page.tsx        # Kanban board

components/
├── sidebar.tsx         # Main navigation sidebar
├── badges.tsx          # Status, Priority, Type badges
└── dashboard/
    ├── stat-card.tsx
    ├── chart-by-status.tsx
    ├── chart-by-type.tsx
    ├── critical-items.tsx
    └── recent-projects.tsx

types/
└── index.ts           # TypeScript types and interfaces

lib/
├── api.ts             # API utilities and mock data
└── utils.ts           # Utility functions
```

## Design System

### Colors
- **Primary**: #FF8C42 (Orange) - Main brand color
- **Secondary/Neutral**: #f5f5f5, #e8e8e8, #666666
- **Background**: #f5f5f5
- **Foreground**: #1a1a1a
- **Accent Colors**: Purple, Cyan, Yellow, Pink, Green for badges

### Typography
- **Font Family**: Geist Sans (headings & body)
- **Font Family Mono**: Geist Mono
- **Font Sizing**: Tailwind default scale

### Spacing & Radius
- **Radius**: 0.5rem
- **Spacing**: Tailwind default scale (gap-4, p-6, etc.)

## Getting Started

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Setup

The app currently uses mock data. To connect a real database:

1. Create a `.env.local` file:
```env
DATABASE_URL=your_neon_postgresql_connection_string
```

2. Update `lib/api.ts` to use actual database queries instead of mock data.

3. Run migrations (when ready with your schema).

## API Routes

All API routes are available at `/api`:

- `GET /api/projects` - List all projects
- `POST /api/projects` - Create a new project
- `GET /api/dashboard` - Get dashboard statistics

Future routes (when database is connected):
- `GET /api/projects/[id]` - Get project details
- `PATCH /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

## Mock Data

The application ships with 3 sample projects for testing:
- Lorem ipsum dolor sit amet (Review, Critical, UI/UX Design)
- Lorem ipsum dolor sit amet (In Progress, Medium, UI/UX Design)
- Lorem ipsum dolor sit amet (Planning, Medium, UI/UX Design)

These are stored in `lib/api.ts` and will be replaced when a database is connected.

## Customization

### Adding New Statuses/Types/Priorities

Edit `types/index.ts`:
```typescript
export type ProjectStatus = 'Planning' | 'In Progress' | 'Review' | 'On Hold' | 'Completed' | 'YourNewStatus';
```

Then update `components/badges.tsx` with color mappings.

### Styling

All colors and typography are defined in `app/globals.css` as CSS variables. Modify them there to change the entire app's appearance.

## Deployment

This app is ready to deploy on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel Settings
4. Deploy!

The app will automatically build and deploy with `pnpm build`.

## Future Enhancements

- Database integration with Neon PostgreSQL
- User authentication with Better Auth
- Real-time updates with WebSockets
- Project collaboration features
- File uploads for project assets
- Email notifications
- Advanced filtering and search
- Project templates
- Activity timeline
- Team management

## Notes

- The "Dark Mode" button is a placeholder and can be implemented with Next.js theme providers
- The form currently stores data in memory (mock). It will persist to database once connected
- Icons use Lucide React - add more icons as needed
- All dates use ISO format (YYYY-MM-DD) for consistency
- The mock API service in `lib/api.ts` includes TODO comments for database replacement

## Support

For questions or issues, check:
- Next.js Documentation: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com
- TypeScript: https://www.typescriptlang.org

## License

Created by Raisul R. [Portfolio](https://nuysrafi.vercel.app/)
