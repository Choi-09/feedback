# Development Guidelines

## Project Overview

### Purpose

- 23명 규모 부서의 LLM/ERP 서비스 피드백을 익명으로 수집하고, 관리자(최정인)가 취합/관리하는 내부 MVP 웹앱

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router), React 19, TypeScript 5.6+ |
| Styling | TailwindCSS v4, shadcn/ui (new-york style), Lucide React |
| Forms | React Hook Form 7.x, Zod |
| Auth/DB | Supabase (Auth, PostgreSQL, RLS) |
| Excel | ExcelJS |
| Deploy | Vercel |

### Feature Scope

- **F001**: Login/Auto-register (name + password)
- **F002**: Logout
- **F003**: Tab switch (LLM/ERP)
- **F004**: Feedback list (anonymous)
- **F005**: Create feedback
- **F006**: Edit feedback (own only)
- **F007**: Delete feedback (own only)
- **F008**: Search feedback
- **F009**: Guide banner per category
- **F010**: Admin sees author names
- **F011**: Excel download

### Key Reference Documents

| Document | Purpose |
|----------|---------|
| `docs/PRD.md` | Feature specification source of truth (F001~F011) |
| `ROADMAP.md` | Development phases and task tracking (Task 001~017) |
| `docs/guides/project-structure.md` | Directory and naming conventions |
| `docs/guides/nextjs-15.md` | Next.js 15 App Router rules |
| `docs/guides/styling-guide.md` | TailwindCSS v4 + shadcn/ui styling rules |
| `docs/guides/component-patterns.md` | Component design patterns |
| `docs/guides/forms-react-hook-form.md` | Form handling with RHF + Zod + Server Actions |
| `tasks/000-sample.md` | Task file template |

---

## Project Architecture

### Directory Structure

```
src/
├── app/
│   ├── layout.tsx                         # Root layout
│   ├── globals.css                        # Global styles (CSS variables)
│   ├── (auth)/
│   │   ├── layout.tsx                     # Center-aligned card layout, no header
│   │   └── login/page.tsx                 # Login page (F001)
│   ├── (main)/
│   │   ├── layout.tsx                     # Header + content layout
│   │   ├── page.tsx                       # / → /feedbacks redirect
│   │   └── feedbacks/
│   │       ├── page.tsx                   # Feedback list (F003~F011)
│   │       ├── loading.tsx                # Skeleton loading
│   │       ├── new/page.tsx               # Create feedback (F005)
│   │       └── [id]/edit/page.tsx         # Edit feedback (F006, F007)
│   ├── api/
│   │   └── feedbacks/export/route.ts      # Excel download API (F011)
│   └── actions/
│       ├── auth.ts                        # Auth Server Actions (F001, F002)
│       └── feedback.ts                    # Feedback CRUD Server Actions (F004~F008)
├── components/
│   ├── ui/                                # shadcn/ui base components (auto-generated)
│   ├── layout/
│   │   ├── app-header.tsx                 # AppHeader (logo + user + logout)
│   │   ├── page-container.tsx             # PageContainer (max-width + responsive padding)
│   │   └── page-header.tsx                # PageHeader (title + action area)
│   ├── feedback/
│   │   ├── feedback-tabs.tsx              # LLM/ERP tab switch (Client)
│   │   ├── feedback-guide-banner.tsx      # Category guide message (Server)
│   │   ├── feedback-search-bar.tsx        # Keyword search (Client)
│   │   ├── feedback-card.tsx              # Feedback card (Server)
│   │   ├── feedback-empty-state.tsx       # Empty state
│   │   ├── feedback-skeleton-list.tsx     # Skeleton list
│   │   ├── feedback-form.tsx              # Create form (Client)
│   │   ├── feedback-edit-form.tsx         # Edit form (Client)
│   │   └── excel-download-button.tsx      # Excel download (Client)
│   ├── providers/
│   │   └── theme-provider.tsx             # Theme provider
│   └── login-form.tsx                     # Login/auto-register form (Client, root level)
├── lib/
│   ├── utils.ts                           # cn() and common utilities
│   ├── env.ts                             # Environment variable validation
│   ├── excel.ts                           # ExcelJS workbook helpers
│   ├── types/
│   │   ├── auth.ts                        # User, AuthUser, UserProfile
│   │   ├── feedback.ts                    # Feedback, FeedbackListItem, FeedbackFormData
│   │   └── common.ts                      # ActionResult, shared types
│   ├── schemas/
│   │   ├── auth.ts                        # loginSchema, passwordConfirmSchema
│   │   └── feedback.ts                    # feedbackCreateSchema, feedbackUpdateSchema
│   ├── supabase/
│   │   ├── server.ts                      # Server Component/Action client
│   │   ├── client.ts                      # Browser client
│   │   ├── middleware.ts                  # Middleware client
│   │   └── admin.ts                       # Service role client
│   └── data/
│       └── mock-feedbacks.ts              # Mock data (Phase 2 only, remove in Phase 4)
├── middleware.ts                           # Auth route protection
supabase/
└── migrations/
    ├── 001_create_tables.sql
    ├── 002_create_triggers.sql
    ├── 003_create_rls_policies.sql
    └── 004_create_indexes.sql
tasks/
└── XXX-description.md                     # Task files
```

### Route Groups

| Group | Purpose | Layout |
|-------|---------|--------|
| `(auth)` | Login page | Center-aligned card, no header |
| `(main)` | Feedback pages | AppHeader + PageContainer |

### Component Categories

| Category | Location | Rule |
|----------|----------|------|
| UI primitives | `components/ui/` | shadcn/ui auto-generated, no business logic |
| Layout | `components/layout/` | Page structure, header/footer |
| Domain (feedback) | `components/feedback/` | Feedback-specific components |
| Providers | `components/providers/` | React Context providers |
| Root-level forms | `components/login-form.tsx` | Cross-domain forms at root |

---

## Code Standards

### Naming

| Target | Convention | Example |
|--------|-----------|---------|
| Files | kebab-case | `feedback-card.tsx` |
| Components | PascalCase | `FeedbackCard` |
| Folders | lowercase/kebab-case | `feedback/`, `mock-data/` |
| Variables/Functions | camelCase | `getFeedbacks`, `isAdmin` |
| Types/Interfaces | PascalCase | `FeedbackListItem`, `ActionResult` |
| Constants | UPPER_SNAKE_CASE | `MAX_CONTENT_LENGTH` |

### Import Order

```tsx
// 1. External libraries
import React from "react";
import { useForm } from "react-hook-form";

// 2. Internal (@/ path aliases)
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 3. Relative (avoid, use @/ instead)
import "./component.css";
```

### Export Rules

- **Named export** for all components: `export function FeedbackCard() {}`
- **Default export** only for `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- **Never** mix named + default export for the same component

### File Size

- **Maximum 300 lines** per file
- Split into sub-components when exceeding

### Path Aliases (mandatory)

```tsx
// CORRECT
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// FORBIDDEN
import { Button } from "../../../components/ui/button";
```

---

## Functionality Implementation Standards

### Server vs Client Components

**Default: Server Component.** Only use `'use client'` when interaction is required.

| Component | Type | Reason |
|-----------|------|--------|
| `login-form.tsx` | Client | useState, form interaction |
| `feedback-tabs.tsx` | Client | Tab switch interaction |
| `feedback-search-bar.tsx` | Client | Search input + debounce |
| `feedback-form.tsx` | Client | RHF form |
| `feedback-edit-form.tsx` | Client | RHF form + AlertDialog |
| `excel-download-button.tsx` | Client | fetch + download trigger |
| `feedback-guide-banner.tsx` | **Server** | Static content by category |
| `feedback-card.tsx` | **Server** | Pure data display |
| All `page.tsx` | **Server** | Data fetching + composition |
| `app-header.tsx` | **Server** | User info from Supabase (LogoutButton is Client sub-component) |

### Server Actions Location

```
CORRECT:   src/app/actions/auth.ts
CORRECT:   src/app/actions/feedback.ts

FORBIDDEN: src/lib/actions/auth.ts
FORBIDDEN: src/lib/actions/feedback.ts
```

### Authentication Flow

```
1. User enters: name + password
2. Check if name exists: checkUserExists(name) via service_role
3a. Existing user → signInWithPassword(email: "{name}@feedback.internal", password)
3b. New user → Show password confirm field → signUp(email, password, metadata: {name})
4. DB trigger on auth.users INSERT → creates public.users record
   - name='최정인' → is_admin=true
5. Middleware redirects:
   - /login (logged in) → /feedbacks
   - /feedbacks/* (not logged in) → /login
```

### Anonymity Guarantee

**Critical rule: Never return `author_id` to the client.**

| User Type | API Response Fields |
|-----------|-------------------|
| Regular user | `id`, `category`, `content`, `created_at`, `updated_at`, `is_mine` (boolean) |
| Admin | Above + `author_name` (string) |

- `is_mine`: Computed server-side by comparing `author_id` with current user's ID
- Admin detection: Check `users.is_admin` for current user before including `author_name`

### Form Handling Pattern

```tsx
// 1. Define Zod schema in src/lib/schemas/
// 2. Create Server Action in src/app/actions/
// 3. Build Client Component with:
//    - useForm + zodResolver (client validation)
//    - useActionState + formAction (server submission)
//    - Server Action performs safeParse (server validation)
```

### Data Model

**Users table:**
- `id` UUID PK
- `auth_id` UUID UNIQUE → auth.users.id
- `name` TEXT UNIQUE NOT NULL (login identifier)
- `is_admin` BOOLEAN DEFAULT false
- `created_at` TIMESTAMPTZ

**Feedbacks table:**
- `id` UUID PK
- `category` TEXT CHECK ('llm' | 'erp')
- `content` TEXT NOT NULL
- `author_id` UUID → users.id
- `created_at` TIMESTAMPTZ
- `updated_at` TIMESTAMPTZ (auto-updated via trigger)

### Next.js 15 Async APIs

```tsx
// CORRECT: Async params and searchParams
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { id } = await params;
  const { category } = await searchParams;
}

// FORBIDDEN: Synchronous access
export default function Page({ params }: { params: { id: string } }) {}
```

---

## Framework/Plugin Usage Standards

### TailwindCSS v4

- **Utility classes first**, never inline styles
- Use **semantic color variables**: `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-primary`
- **Mobile-first** responsive: base → `sm:` → `md:` → `lg:` → `xl:`
- Use `cn()` from `@/lib/utils` for conditional classes
- **Never** hardcode colors: `bg-white`, `text-black`, `bg-gray-100`

### shadcn/ui

- Style: **new-york**
- Add components via: `npx shadcn@latest add [component-name]`
- Extend existing components, never rebuild from scratch
- Pass `className` prop through with `cn()` for customization

### Supabase Client Types

| Client | File | Use Case |
|--------|------|----------|
| Server | `lib/supabase/server.ts` | Server Components, Server Actions |
| Browser | `lib/supabase/client.ts` | Client Components |
| Middleware | `lib/supabase/middleware.ts` | middleware.ts session refresh |
| Admin | `lib/supabase/admin.ts` | Service role operations (checkUserExists) |

### ExcelJS

- Install: `npm install exceljs`
- Helper: `src/lib/excel.ts`
- API Route: `src/app/api/feedbacks/export/route.ts`
- File naming: `피드백_{category}_{YYYY-MM-DD}.xlsx`

---

## Workflow Standards

### Task Execution Flow

```
1. Check ROADMAP.md for next task
2. Create task file: tasks/XXX-description.md (use 000-sample.md as template)
3. Implement according to task spec
4. For BE/API tasks: Run Playwright MCP E2E tests
5. Update task file: mark steps as completed
6. Update ROADMAP.md: mark task as completed
7. Run: npm run check-all (lint + typecheck + format)
8. Commit changes
```

### Task File Format

- Location: `tasks/XXX-description.md`
- Template: `tasks/000-sample.md`
- Required sections: Status, Spec, Impact Scope (FE/BE/DB), Related Features, Related Files, Acceptance Criteria, Implementation Steps
- BE/API tasks **must** include "Test Checklist" section with Playwright scenarios

### Quality Gates

- `npm run check-all` must pass before any commit
- `npm run build` must succeed
- No TypeScript errors
- No unnecessary `console.log`

---

## Key File Interaction Standards

### Synchronized Updates Required

| When You Change | Also Update |
|----------------|-------------|
| ROADMAP.md task status | Corresponding `tasks/XXX.md` status |
| `tasks/XXX.md` completion | ROADMAP.md task status |
| Zod schema (`lib/schemas/`) | Both Server Action validation AND Client form resolver |
| DB schema (`supabase/migrations/`) | TypeScript types (`lib/types/`), RLS policies, indexes |
| Environment variable | `.env.local` + `.env.example` + `src/lib/env.ts` |
| Server Action signature | All consuming Client Components |
| `users` table structure | Auth trigger, RLS policies, type definitions |
| Feature in PRD | ROADMAP task reference, related component |

### Component-Action Mapping

| Component | Server Action |
|-----------|--------------|
| `login-form.tsx` | `app/actions/auth.ts` (signIn, signUp, checkUserExists) |
| `app-header.tsx` (LogoutButton) | `app/actions/auth.ts` (signOut) |
| `feedback-form.tsx` | `app/actions/feedback.ts` (createFeedback) |
| `feedback-edit-form.tsx` | `app/actions/feedback.ts` (updateFeedback, deleteFeedback) |
| `feedbacks/page.tsx` | `app/actions/feedback.ts` (getFeedbacks) |
| `feedbacks/[id]/edit/page.tsx` | `app/actions/feedback.ts` (getFeedbackById) |
| `excel-download-button.tsx` | `app/api/feedbacks/export/route.ts` (fetch) |

---

## AI Decision-making Standards

### New Component Decision Tree

```
Need new component?
├── Does it need useState/useEffect/event handlers?
│   ├── YES → Client Component ('use client')
│   └── NO → Server Component (default)
├── Where to place it?
│   ├── shadcn/ui primitive → components/ui/
│   ├── Page structure → components/layout/
│   ├── Feedback domain → components/feedback/
│   ├── Cross-domain form → components/ (root level)
│   └── Context provider → components/providers/
├── Does it need data?
│   ├── Server data → Fetch in Server Component, pass as props
│   └── Client state → useState/useForm in Client Component
```

### Ambiguity Resolution Priority

1. **PRD.md** → Feature requirements and user flows
2. **ROADMAP.md** → Task scope and implementation order
3. **docs/guides/*.md** → Coding conventions and patterns
4. **tasks/XXX.md** → Specific task acceptance criteria

### Style Decision

- Always check `docs/guides/styling-guide.md` before writing CSS classes
- Use shadcn/ui component variants before custom styling
- Use `cn()` for all conditional class composition

---

## Prohibited Actions

### Architecture

- **NEVER** use Pages Router (`pages/` directory)
- **NEVER** place Server Actions in `src/lib/actions/` — use `src/app/actions/`
- **NEVER** use `getServerSideProps` or `getStaticProps`
- **NEVER** access params/searchParams synchronously in Next.js 15

### Security / Anonymity

- **NEVER** return `author_id` in API responses to the client
- **NEVER** return `author_name` to non-admin users
- **NEVER** skip server-side Zod validation (client validation is NOT sufficient)
- **NEVER** expose service role key to the client

### Styling

- **NEVER** use inline styles (`style={{}}`)
- **NEVER** hardcode colors (`bg-white`, `text-black`, `bg-gray-100`)
- **NEVER** use `!important` override
- **NEVER** mix CSS Modules with Tailwind classes
- **NEVER** use desktop-first responsive (`hidden lg:block md:hidden`)

### Naming / Structure

- **NEVER** use snake_case for file names (`user_profile.tsx`)
- **NEVER** use relative imports when `@/` alias is available
- **NEVER** exceed 300 lines in a single file
- **NEVER** create deep nesting beyond 4 levels (`components/pages/auth/forms/login/`)
- **NEVER** use meaningless folder names (`misc/`, `common/`, `shared/`)

### Workflow

- **NEVER** implement a task without first creating/updating its task file in `tasks/`
- **NEVER** skip `npm run check-all` before committing
- **NEVER** modify `docs/PRD.md` without explicit user instruction
