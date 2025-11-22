# Backend (Express + Supabase)

This backend is a minimal TypeScript + Express scaffold that connects to Supabase using `@supabase/supabase-js`.

Quick start

1. Copy environment variables:

```bash
cp .env.example .env
# then edit .env and fill SUPABASE_URL and SUPABASE_KEY
```

2. Install dependencies and run dev server:

```bash
cd backend
npm install
npm run dev
```

3. Endpoints

- `GET /health` — health check
- `GET /posts` — fetch posts from Supabase `posts` table
- `POST /posts` — create a new post (body: `{ title, content, author }`)

Database

Use the SQL in `sql/create_posts_table.sql` in the Supabase SQL editor to create the `posts` table.

Notes

- This scaffold uses TypeScript. `ts-node-dev` runs `src/index.ts` in dev mode.
- Keep your `SUPABASE_KEY` secret. For server usage, consider using a service_role key stored securely.
