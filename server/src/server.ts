import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { saveUser, fetchAllUsers, fetchUser } from "./repository/user";
import { userSchema } from "./dto/user";
import { BadRequestError } from "./lib/error";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/user/:userId", async (c) => {
  const userId = c.req.param("userId");
  if (!userId) {
    const error = new BadRequestError();
    return c.json({ error }, error.status);
  }

  const result = await fetchUser(userId);
  console.log({ result });
  return result.match(
    (user) => c.json(user),
    (error) => c.json({ error }, error.status)
  );
});

app.get("/users", async (c) => {
  const result = await fetchAllUsers();
  return result.match(
    (users) => c.json(users),
    (error) => c.json({ error }, error.status)
  );
});

app.post("/user", async (c) => {
  const body = await c.req.json();

  const parseResult = userSchema.safeParse(body);
  if (!parseResult.success) {
    const error = new BadRequestError();
    return c.json({ error }, error.status);
  }

  const insertRes = await saveUser(parseResult.data);
  return insertRes.match(
    (user) => c.json(user),
    (error) => c.json({ error }, error.status)
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
