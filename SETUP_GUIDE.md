# Project Hub - Setup & Installation Guide

## Quick Start (5 minutes)

### 1. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app comes with **3 mock projects** pre-loaded for testing all features.

### 2. Explore the App

- **Dashboard** - See project statistics and charts
- **Projects** - Browse, search, and filter all projects
- **Board** - View projects organized by status (Kanban)
- **New Project** - Create a new project (data stays in memory currently)

## Database Integration (When Ready)

### Setup Neon PostgreSQL

1. **Sign up**: Go to [Neon Console](https://console.neon.tech/)
2. **Create a project**: Click "New Project"
3. **Get your connection string**: Copy the `postgresql://...` URL
4. **Add to `.env.local`**:
   ```
   DATABASE_URL=your_copied_connection_string
   ```

### Install Database Dependencies

```bash
pnpm add @neondatabase/serverless
```

### Update API to Use Database

Edit `lib/api.ts` and replace the mock data service with Drizzle ORM queries:

```typescript
import { db } from '@/lib/db';
import { projects } from '@/lib/schema';

export async function getProjects(): Promise<Project[]> {
  return await db.select().from(projects);
}

export async function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
  const [newProject] = await db.insert(projects).values({
    ...project,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();
  return newProject;
}
```

### Create Database Schema (When Ready)

```sql
-- Run in Neon SQL Editor
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50),
  status VARCHAR(50),
  priority VARCHAR(50),
  effort VARCHAR(50),
  device VARCHAR(50),
  owner VARCHAR(255),
  start_date DATE,
  end_date DATE,
  deadline DATE,
  client_name VARCHAR(255),
  client_email VARCHAR(255),
  preview_link VARCHAR(500),
  resource_links JSONB DEFAULT '[]',
  short_overview TEXT,
  business_goal TEXT,
  target_audience TEXT,
  competitors TEXT,
  tags TEXT[],
  company VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_status ON projects(status);
CREATE INDEX idx_type ON projects(type);
CREATE INDEX idx_priority ON projects(priority);
```

## Project Structure

```
📁 Project Hub
├── 📁 app/
│   ├── 📁 api/                 # API endpoints
│   ├── 📁 board/              # Kanban board page
│   ├── 📁 projects/           # Projects list, new, details
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Dashboard
│   └── globals.css            # Global styles & design tokens
│
├── 📁 components/
│   ├── 📁 dashboard/          # Dashboard-specific components
│   ├── 📁 ui/                 # shadcn/ui components
│   ├── sidebar.tsx            # Main navigation
│   └── badges.tsx             # Status/priority badges
│
├── 📁 lib/
│   ├── api.ts                 # API utilities & mock data
│   └── utils.ts               # Helper functions
│
├── 📁 types/
│   └── index.ts               # TypeScript definitions
│
├── .env.example               # Environment variables template
├── README.md                  # Full documentation
├── SETUP_GUIDE.md            # This file
└── package.json              # Dependencies
```

## Customization

### Change Brand Color

Edit `app/globals.css`:

```css
--primary: #FF8C42;        /* Change this to your color */
--primary-foreground: #ffffff;
```

All orange accents will update automatically.

### Add New Project Status

1. Edit `types/index.ts`:
```typescript
export type ProjectStatus = 'Planning' | 'In Progress' | 'Review' | 'On Hold' | 'Completed' | 'YourNewStatus';
```

2. Update badge colors in `components/badges.tsx`:
```typescript
'YourNewStatus': { bg: 'bg-teal-100', text: 'text-teal-700' },
```

3. Update `components/dashboard/chart-by-status.tsx` colors.

### Modify Form Fields

Edit `app/projects/new/page.tsx` to add/remove form fields.

## Deployment

### Deploy to Vercel

```bash
# Push to GitHub first
git push origin main

# In Vercel dashboard:
# 1. Connect your GitHub repo
# 2. Add DATABASE_URL env var
# 3. Deploy!
```

### Environment Variables on Vercel

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add:
   ```
   DATABASE_URL = your_neon_connection_string
   ```

### Build for Production

```bash
pnpm build
pnpm start
```

## Troubleshooting

### App won't start
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `pnpm install`
- Restart dev server: `pnpm dev`

### Icons missing
- All icons come from `lucide-react`
- Check that package is installed: `pnpm list lucide-react`

### Styles look weird
- Tailwind CSS may need rebuild
- Clear cache: `pnpm exec tailwindcss --clear`
- Restart: `pnpm dev`

### Database connection errors
- Verify `DATABASE_URL` is correct
- Check Neon dashboard for active connection
- Make sure IP is whitelisted (Neon allows all by default)

### Form data disappearing after page refresh
- This is expected with mock data
- Once you connect a real database, data will persist

## Advanced Features to Add

### Authentication
```bash
pnpm add @auth/core @auth/nextjs
```
Add session middleware and protected routes.

### File Uploads
```bash
pnpm add next-cloudinary
```
Add project attachment/image uploads.

### Real-time Updates
```bash
pnpm add socket.io socket.io-client
```
Add WebSocket support for live project updates.

### Search
```bash
pnpm add typesense
```
Full-text search across projects.

### Email Notifications
```bash
pnpm add resend
```
Send project update notifications.

## Key Technologies

| Tech | Purpose |
|------|---------|
| Next.js 16 | Frontend framework with App Router |
| React 19 | UI library |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| Zod | Schema validation |
| Lucide React | Icons |
| Drizzle ORM | (Ready for DB integration) |
| Neon PostgreSQL | Database (optional) |

## Performance Tips

1. **Images**: Optimize with `next/image`
2. **Lazy Loading**: Use `React.lazy()` for heavy components
3. **Caching**: Implement SWR for data fetching
4. **Build**: Check build size: `pnpm build`

## Support Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)
- [Neon Documentation](https://neon.tech/docs/introduction)

## Next Steps

1. ✅ Explore the UI with mock data
2. ⏭️ Set up Neon database when ready
3. ⏭️ Connect database to API
4. ⏭️ Add authentication
5. ⏭️ Deploy to Vercel

Happy building! 🚀
