import express, { Request, Response } from "express";
import { testConnection } from "./config/database.js";
import { addUser, editUser, getUsers, isValidUserInput, removeUser } from "./users.js";

const app = express();
app.use(express.json());

function validId(value: unknown): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

app.post("/add", async (req: Request, res: Response) => {
  if (!isValidUserInput(req.body)) {
    return res.status(400).json({ message: "Invalid user data. All fields except id are required." });
  }
  try {
    const user = await addUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to add user" });
  }
});

app.put("/edit", async (req: Request, res: Response) => {
  const id = validId(req.body?.id);
  if (!id) return res.status(400).json({ message: "A valid id is required" });
  if (!isValidUserInput(req.body)) {
    return res.status(400).json({ message: "Invalid user data. All user fields are required." });
  }
  try {
    const user = await editUser(id, req.body);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to edit user" });
  }
});

app.delete("/remove", async (req: Request, res: Response) => {
  const id = validId(req.body?.id ?? req.query.id);
  if (!id) return res.status(400).json({ message: "A valid id is required" });
  try {
    const removed = await removeUser(id);
    if (!removed) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "User removed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to remove user" });
  }
});

app.get("/get", async (req: Request, res: Response) => {
  const { id, name, birthDate, isAdmin, balance } = req.query;

  if (id !== undefined && !validId(id)) {
    return res.status(400).json({ message: "Invalid id filter" });
  }
  if (isAdmin !== undefined && !["true", "false"].includes(String(isAdmin))) {
    return res.status(400).json({ message: "isAdmin must be true or false" });
  }
  if (balance !== undefined && !/^-?\d+$/.test(String(balance))) {
    return res.status(400).json({ message: "Invalid balance filter" });
  }
  if (birthDate !== undefined && Number.isNaN(Date.parse(String(birthDate)))) {
    return res.status(400).json({ message: "Invalid birthDate filter" });
  }

  try {
    const users = await getUsers({ id, name, birthDate, isAdmin, balance });
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
});

app.get("/", (_req, res) => res.json({ message: "User API is running" }));

const PORT = Number(process.env.PORT) || 3000;

async function start(): Promise<void> {
  try {
    await testConnection();
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (error) {
    console.error("Could not start server:", error);
    process.exit(1);
  }
}

void start();
