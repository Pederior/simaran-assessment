# Simaran Interview — User API

## Setup
1. Copy `.env.example` to `.env` and set `DATABASE_URL` to the connection string provided for your PostgreSQL instance.
2. Create the table by running `schema.sql` against that database.
3. Install dependencies in your existing TypeScript/Node project:
   `npm install express pg dotenv`
   `npm install -D typescript tsx @types/node @types/express @types/pg`
4. Start using your project's configured TypeScript runner (for example `npx tsx src/server.ts`).

## API
- `POST /add`: JSON fields `name`, `birthDate`, `isAdmin`, `departments`, `balance`; no `id`.
- `PUT /edit`: same fields plus `id`.
- `DELETE /remove`: JSON `{ "id": 1 }` (or query `?id=1`).
- `GET /get`: optional query filters `id`, `name`, `birthDate`, `isAdmin`, `balance`.

The implementation uses parameterized raw SQL. `balance` is represented as a string in API output because PostgreSQL BIGINT may exceed JavaScript's safe integer range.
