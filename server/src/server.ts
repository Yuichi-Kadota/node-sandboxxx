import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { saveUser, fetchAllUsers, fetchUser } from "./repository/user";
import { userSchema } from "./dto/user";

const app = new Hono();

app.get("/", (c) => {
  console.log("");
  return c.text("Hello Hono!");
});

app.get("/user/:userId", async (c) => {
  const userId = c.req.param("userId");
  if (!userId) {
    return c.json({ error: "", message: "missing userId" }, 400);
  }

  const result = await fetchUser(userId);
  console.log({ result });
  return result.match(
    (user) => c.json(user),
    (error) => c.json({ error }, 404)
  );
});

app.get("/users", async (c) => {
  const result = await fetchAllUsers();
  return result.match(
    (users) => c.json(users),
    (error) => c.json({ error }, 500)
  );
});

app.post("/user", async (c) => {
  const body = await c.req.json();

  const parseResult = userSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ error: parseResult.error.errors }, 400);
  }

  const insertRes = await saveUser(parseResult.data);
  return insertRes.match(
    (user) => c.json(user),
    (error) => c.json({ error }, 500)
  );
});

/**
 * Server Init Process
 */
const port = 3001;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
