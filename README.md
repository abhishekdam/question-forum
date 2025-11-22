# Question Forum - Full Stack Q&A Platform

A modern, mobile-responsive forum application for sharing questions and answers. Built with React, Express, TypeScript, and Supabase.

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Technology Stack](#-technology-stack)
- [API Endpoints](#-api-endpoints)
- [Development Guide](#-development-guide)
- [Environment Setup](#-environment-setup)
- [Deployment](#-deployment)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for database)
- Git

### Frontend Setup

```bash
cd frontend
npm install
npm run dev              # Start on http://localhost:8080
```

### Backend Setup

```bash
cd backend
npm install
npm run dev             # Start on http://localhost:4000
```

### Full Stack Development

```bash
# Terminal 1: Start Backend
cd backend && npm run dev

# Terminal 2: Start Frontend
cd frontend && npm run dev

# Visit http://localhost:8080
```

---

## 📁 Project Structure

```
question-forum/
├── frontend/                      # React TypeScript frontend
│   ├── src/
│   │   ├── api/axios.ts          # HTTP client & API endpoints
│   │   ├── components/
│   │   │   ├── forum/            # Forum-specific components
│   │   │   │   ├── CreatePostDialog.tsx    # Post creation modal
│   │   │   │   ├── PostCard.tsx           # Post list item
│   │   │   │   ├── ReplyForm.tsx          # Reply form
│   │   │   │   ├── ReplyCard.tsx          # Reply display
│   │   │   │   ├── SearchBar.tsx          # Search input
│   │   │   │   └── SortSelect.tsx         # Sort dropdown
│   │   │   ├── NavLink.tsx                # Router link wrapper
│   │   │   └── ui/                        # shadcn/ui components
│   │   ├── hooks/
│   │   │   └── usePosts.ts       # Forum state management
│   │   ├── pages/
│   │   │   ├── Index.tsx         # Home page (post list)
│   │   │   ├── PostDetail.tsx    # Single post view
│   │   │   └── NotFound.tsx      # 404 page
│   │   ├── App.tsx               # Root component & routing
│   │   ├── main.tsx              # Entry point
│   │   └── index.css             # Design system & styles
│   ├── index.html                # HTML template
│   ├── vite.config.ts            # Vite build config
│   ├── tailwind.config.ts        # Tailwind CSS config
│   ├── postcss.config.cjs        # PostCSS config
│   ├── tsconfig.json             # TypeScript config
│   └── package.json              # Dependencies
│
└── backend/                       # Express TypeScript backend
    ├── src/
    │   ├── index.ts              # Server & API endpoints
    │   ├── supabaseClient.ts     # Database client
    │   └── env.d.ts              # TypeScript declarations
    ├── sql/                      # Database migrations
    ├── tsconfig.json             # TypeScript config
    ├── .env.example              # Environment template
    └── package.json              # Dependencies
```

---

## 🛠️ Technology Stack

### Frontend

| Technology   | Version | Purpose        |
| ------------ | ------- | -------------- |
| React        | 18.3    | UI framework   |
| TypeScript   | 5.8     | Type safety    |
| Vite         | 5.4     | Build tool     |
| Tailwind CSS | 3.4     | Styling        |
| React Router | 6       | Client routing |
| Axios        | Latest  | HTTP client    |
| shadcn/ui    | Latest  | UI components  |

### Backend

| Technology | Version | Purpose              |
| ---------- | ------- | -------------------- |
| Express    | 4.18    | Web server           |
| TypeScript | 5.0     | Type safety          |
| Supabase   | 2.0     | Database & Auth      |
| CORS       | Latest  | Cross-origin support |

### Database

- **Provider**: Supabase (PostgreSQL)
- **Tables**: posts, replies
- **Authentication**: Supabase Auth

---

## 📡 API Endpoints

### Base URL: `http://localhost:4000`

#### Posts

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| GET    | `/posts`              | Fetch all posts      |
| POST   | `/posts`              | Create new post      |
| PATCH  | `/posts/:id/upvote`   | Increment vote count |
| PATCH  | `/posts/:id/answered` | Mark as answered     |

#### Replies

| Method | Endpoint                 | Description              |
| ------ | ------------------------ | ------------------------ |
| GET    | `/posts/:postId/replies` | Fetch replies for a post |
| POST   | `/posts/:postId/replies` | Create new reply         |

### Request/Response Examples

#### Create Post

```bash
POST /posts
Content-Type: application/json

{
  "title": "How to use React?",
  "content": "I'm new to React and need help...",
  "author_name": "John Doe"
}
```

#### Create Reply

```bash
POST /posts/{postId}/replies
Content-Type: application/json

{
  "content": "Here's how you can do it...",
  "author_name": "Jane Smith"
}
```

---

## 💻 Development Guide

### Code Organization

#### Frontend Components

**Forum Components** (`/src/components/forum/`)

- Self-contained, focused components
- Each handles specific functionality
- Props passed for data & callbacks
- Use shadcn/ui for base components

**Pages** (`/src/pages/`)

- Route-level components
- Call `usePosts` hook for state
- Orchestrate component layout

**Hooks** (`/src/hooks/`)

- `usePosts.ts`: Forum state management
- Provides data and CRUD operations
- Handles API communication

#### Backend

**API Routes** (`/src/index.ts`)

- RESTful endpoints
- Error handling with proper status codes
- Request validation
- CORS enabled

**Database** (`/src/supabaseClient.ts`)

- Supabase client initialization
- Connection pooling
- Environment-based configuration

### Component Data Flow

```
App.tsx (Root)
  ├── usePosts() [State Management]
  │   ├── fetchAllPosts()
  │   ├── createPost()
  │   ├── addReply()
  │   └── updatePost()
  │
  ├── Index.tsx [Home Page]
  │   ├── SearchBar.tsx
  │   ├── SortSelect.tsx
  │   └── PostCard.tsx (map)
  │
  └── PostDetail.tsx [Post Page]
      ├── PostCard.tsx (display)
      ├── ReplyCard.tsx (map)
      └── ReplyForm.tsx
```

### Styling System

#### Colors

**Light Mode Variables** (defined in `/src/index.css`)

- `--background`: Page background
- `--foreground`: Text color
- `--primary`: Primary actions
- `--secondary`: Secondary actions
- `--destructive`: Danger actions
- `--accent`: Highlights

**Dark Mode**

- Same variables, different values
- Automatically applied with `dark:` class

#### Responsive Breakpoints

```
xs: 375px   (mobile)
sm: 640px   (small device)
md: 768px   (tablet)
lg: 1024px  (desktop)
xl: 1280px  (large desktop)
2xl: 1536px (ultra-wide)
```

### Common Tasks

#### Add a New Component

1. Create file in `/src/components/forum/`
2. Define TypeScript interface for props
3. Add JSDoc comments
4. Export as default
5. Import and use in pages

#### Add a New API Endpoint

1. Add route handler in `/backend/src/index.ts`
2. Add corresponding API function in `/frontend/src/api/axios.ts`
3. Call from `usePosts` hook
4. Use in component

#### Modify Styling

1. Update CSS variables in `/src/index.css`
2. Or add Tailwind classes to components
3. Use responsive modifiers: `md:`, `lg:`, etc.

---

## 🔧 Environment Setup

### Backend Environment Variables

Create `/backend/.env`:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_key

# Server Configuration
PORT=4000
NODE_ENV=development

# Frontend Configuration
VITE_API_URL=http://localhost:4000
VITE_SUPABASE_URL=https://your-project.supabase.co
```

**Never commit `.env` file.** Use `.env.example` as template.

### Frontend Environment Variables

No `.env` needed for frontend (uses backend API).

All frontend variables are defined in `/vite.config.ts`.

---

## 🚢 Deployment

### Frontend (Vercel/Netlify)

1. Build for production:

   ```bash
   cd frontend
   npm run build
   ```

2. Deploy `frontend/dist/` folder

3. Set environment variables in platform

### Backend (Heroku/Railway)

1. Build for production:

   ```bash
   cd backend
   npm run build
   ```

2. Deploy with `Procfile`:

   ```
   web: node dist/index.js
   ```

3. Set environment variables (SUPABASE_URL, SUPABASE_KEY, PORT)

---

## 📚 Code Documentation

All source files include comprehensive comments:

- **File Headers**: Explain file purpose and exports
- **Functions**: Document parameters, return types, behavior
- **Components**: Document props interface and JSX structure
- **Configuration**: Detailed explanation of all settings

Examples:

- See `/frontend/src/api/axios.ts` for API client documentation
- See `/frontend/src/components/forum/CreatePostDialog.tsx` for component example
- See `/frontend/tailwind.config.ts` for configuration documentation

---

## 🐛 Troubleshooting

### Frontend won't start

```bash
# Clear cache and reinstall
rm -rf frontend/node_modules
npm install
npm run dev
```

### Backend API not responding

```bash
# Check if backend is running
lsof -i :4000

# Verify environment variables
cat backend/.env

# Check Supabase connection
npm run dev (from backend folder)
```

### Port already in use

```bash
# Change port in backend/tsconfig.json or backend/src/index.ts
# Change port in frontend/vite.config.ts
```

### Database connection issues

- Verify `SUPABASE_URL` and `SUPABASE_KEY` in `.env`
- Check Supabase project is active
- Ensure network access is allowed

---

## 📝 Git Workflow

### Branch Naming

- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes

### Commit Message Format

```
feat: add new component
fix: resolve styling issue
docs: update README
refactor: simplify API client
test: add unit tests
```

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes with clear commit messages
3. Test thoroughly before pushing
4. Create pull request to `develop`
5. Merge to `main` after review

---

## 📄 License

MIT License - See LICENSE file for details

---

## 📧 Support

For issues, questions, or suggestions:

- Create GitHub Issue
- Check existing documentation
- Review code comments in source files

---

**Last Updated**: November 2025  
**Status**: Production Ready ✅  
**Documentation**: Complete with 1000+ lines of inline code comments
