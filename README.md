# Simaran Assessment

This is a simple user management API built with Node.js, TypeScript, Express, and PostgreSQL.

## Features

- Add a new user
- Edit an existing user
- Remove a user
- Get users with filters

## Technologies

- Node.js
- TypeScript
- Express.js
- PostgreSQL

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Pederior/simaran-assessment.git
   ```

2. Go to the project folder:

   ```bash
   cd simaran-assessment
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file and add your PostgreSQL connection string:

   ```env
   DATABASE_URL=your_database_url
   PORT=3000
   ```

5. Start the server:

   ```bash
   npx tsx src/server.ts
   ```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/add` | Add a user |
| PUT | `/edit` | Edit a user |
| DELETE | `/remove` | Remove a user |
| GET | `/get` | Get users |

## Notes

The project uses raw SQL queries to communicate with PostgreSQL.

Make sure your database is configured before running the server.