# Madhav Parivar - Devotional Management System

## Overview

This is a comprehensive devotional management system built for managing spiritual communities, devotees, families, events, and religious activities. The application provides a full-stack solution with a React frontend and Express backend, designed to handle various aspects of spiritual community management including devotee registration, family management, event planning, donations tracking, and volunteer coordination.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom theming support
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful endpoints with TypeScript support

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Management**: Type-safe schema definitions with Zod validation
- **Migrations**: Drizzle Kit for database migrations
- **Connection**: Neon serverless PostgreSQL with connection pooling

## Key Components

### Core Entities
1. **Users**: Authentication and user management with role-based access
2. **Devotees**: Individual devotee profiles with comprehensive information
3. **Families**: Family unit management with relationships
4. **Mentors**: Spiritual guides and counselors management
5. **Events**: Event planning and management system
6. **Attendance**: Tracking participation in events and activities
7. **Donations**: Financial contribution tracking and management
8. **Volunteering**: Volunteer activity coordination
9. **Groups**: Community groups with messaging integration

### Advanced Features
1. **Dashboard Designer**: Customizable dashboard with draggable widgets
2. **ID Card Generator**: Professional ID card creation with multiple templates
3. **Theme System**: Multiple theme options including devotional, matrix, and modern styles
4. **Analytics**: Comprehensive reporting and analytics dashboard
5. **Bulk Operations**: Mass operations for devotee management
6. **Export/Import**: Data export and import capabilities
7. **Developer Studio** (`/dev-studio`): Full app designer with 6 tabs:
   - **App Info**: Change app name, subtitle, logo symbol with live preview
   - **Theme Editor**: 8 preset themes + custom HSL color sliders + border radius control
   - **Navigation Editor**: Reorder/rename/show-hide/add sidebar items with live preview
   - **Custom Fields**: Define extra fields (text/number/date/dropdown/boolean) for entities
   - **Role Profiles**: Configure page access and edit/delete permissions per role
   - **Config**: Export/Import JSON config, snapshot history with restore
8. **Notifications**: Live notification system with bell icon, mark read/delete
9. **Dev Mode**: Code `DevelopZ`, yellow banner with quick Dev Studio link

## Data Flow

### Authentication Flow
1. User authentication through Replit Auth (OpenID Connect)
2. Session management with PostgreSQL-backed storage
3. Role-based access control for different user types
4. Secure API endpoints with authentication middleware

### Data Management Flow
1. Frontend forms with Zod validation
2. API requests through TanStack Query with optimistic updates
3. Server-side validation and business logic
4. Database operations through Drizzle ORM
5. Real-time updates and cache invalidation

### File Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Theme, Dashboard)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and configurations
│   │   └── pages/          # Page components
├── server/                 # Express backend
│   ├── db.ts              # Database configuration
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database operations
│   └── replitAuth.ts      # Authentication setup
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── migrations/            # Database migrations
```

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS for utility-first styling
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns for date manipulation
- **Form Validation**: Zod for schema validation

### Backend Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: drizzle-orm for type-safe database operations
- **Authentication**: openid-client for OAuth integration
- **Session Storage**: connect-pg-simple for PostgreSQL session storage
- **Build Tools**: esbuild for server bundling

### Development Dependencies
- **TypeScript**: Full TypeScript support across the stack
- **ESLint/Prettier**: Code formatting and linting
- **Vite**: Fast development server with HMR

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds the React application to `dist/public`
2. **Backend Build**: esbuild bundles the Express server to `dist/index.js`
3. **Database Setup**: Drizzle migrations ensure schema consistency

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **SESSION_SECRET**: Secret for session encryption
- **REPLIT_DOMAINS**: Allowed domains for authentication
- **ISSUER_URL**: OpenID Connect issuer URL

### Production Deployment
- Server runs on Node.js with production optimizations
- Static files served through Express
- Database connections pooled for performance
- Session storage in PostgreSQL for scalability

## Key Features

### Developer Mode
- Activated via the "Developer Mode" button in the sidebar using code **DevelopZ**
- Shows a persistent yellow banner when active
- Grants full system configuration access

### Devotee Profile Page (/devotees/:id)
- Full-page profile with large centered avatar (25% screen width)
- Quick stats: Attendance %, Total Donated, Total Seva Hours
- Clickable family member tiles (navigate between profiles)
- 4 tabs: Details, Attendance (BarChart), Donations (AreaChart + PieChart), Volunteering (BarChart)

### Events Management (/events)
- Card-based layout with event images (URL-based)
- Event type badges: satsang, festival, workshop, meeting
- Archive/unarchive individual events
- Auto-Archive Past button for bulk archiving
- Create/edit events with image preview

### Dashboard (/dashboard)
- Upcoming Events section above the attendance chart
- Shows next 5 events sorted by date with countdown (Today/Tomorrow/In X days)
- Event images, type, location, and capacity shown

### Storage
- Uses in-memory storage (MemoryStorage) — no PostgreSQL required
- Seed data: 10 devotees across 3 families, 6 events, 12 months of attendance/donation/volunteering history

## Changelog

```
Changelog:
- July 06, 2025. Initial setup
- March 13, 2026. Major feature additions: Developer Mode, Devotee Full Profile Page with analytics charts,
  Upcoming Events on Dashboard, Events image upload and archiving, Fixed Select.Item empty value bugs,
  Updated to in-memory storage with rich seed data
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```