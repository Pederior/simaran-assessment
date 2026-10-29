import pool from "./config/database.js";

export interface User {
  id: number;
  name: string;
  birthDate: string;
  isAdmin: boolean;
  departments: string[];
  balance: string; 
}

export interface UserInput {
  name: string;
  birthDate: string;
  isAdmin: boolean;
  departments: string[];
  balance: string;
}

const fields = ["id", "name", "birthDate", "isAdmin", "departments", "balance"] as const;

export function isValidUserInput(value: unknown): value is UserInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const data = value as Record<string, unknown>;

  return (
    typeof data.name === "string" &&
    data.name.trim().length > 0 &&
    data.name.trim().length < 255 &&
    typeof data.birthDate === "string" &&
    !Number.isNaN(Date.parse(data.birthDate)) &&
    typeof data.isAdmin === "boolean" &&
    Array.isArray(data.departments) &&
    data.departments.every((department) => typeof department === "string") &&
    (typeof data.balance === "string" || typeof data.balance === "number") &&
    /^-?\d+$/.test(String(data.balance))
  );
}

export async function addUser(input: UserInput): Promise<User> {
  const result = await pool.query<User>(
    `INSERT INTO users (name, "birthDate", "isAdmin", departments, balance)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, "birthDate", "isAdmin", departments, balance`,
    [
      input.name.trim(),
      input.birthDate,
      input.isAdmin,
      input.departments,
      String(input.balance),
    ],
  );
  return result.rows[0];
}

export async function editUser(id: number, input: UserInput): Promise<User | null> {
  const result = await pool.query<User>(
    `UPDATE users
     SET name = $1, "birthDate" = $2, "isAdmin" = $3, departments = $4, balance = $5
     WHERE id = $6
     RETURNING id, name, "birthDate", "isAdmin", departments, balance`,
    [
      input.name.trim(),
      input.birthDate,
      input.isAdmin,
      input.departments,
      String(input.balance),
      id,
    ],
  );
  return result.rows[0] ?? null;
}

export async function removeUser(id: number): Promise<boolean> {
  const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}

export async function getUsers(filters: Record<string, unknown>): Promise<User[]> {
  const conditions: string[] = [];
  const values: unknown[] = [];

  const allowed = ["id", "name", "birthDate", "isAdmin", "balance"] as const;
  for (const key of allowed) {
    const value = filters[key];
    if (value === undefined || value === "") continue;
    values.push(value);
    conditions.push(key === "birthDate"
      ? `"birthDate"::date = $${values.length}::date`
      : key === "isAdmin"
        ? `"isAdmin" = $${values.length}::boolean`
        : key === "balance"
          ? `balance = $${values.length}::bigint`
          : key === "name"
            ? `name ILIKE $${values.length}`
            : `id = $${values.length}::integer`);
    if (key === "name") values[values.length - 1] = `%${String(value)}%`;
  }

  const query = `SELECT id, name, "birthDate", "isAdmin", departments, balance
                 FROM users ${conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""}
                 ORDER BY id`;
  const result = await pool.query<User>(query, values);
  return result.rows;
}
