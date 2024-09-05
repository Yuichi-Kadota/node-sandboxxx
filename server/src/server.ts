import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createUser, fetchAllUsers, fetchUser } from "./model/user";
import { zValidator } from "@hono/zod-validator";
import { userSchema } from "./dto/user";

const app = new Hono();

app.get("/", (c) => {
  console.log("");
  return c.text("Hello Hono!");
});

app.get("/user/:userId", async (c) => {
  const userId = c.req.param("userId");
  if (!userId) {
    return c.text("User ID is required", 400);
  }

  const result = await fetchUser(userId);
  if (result.isOk()) {
    return c.json(result.value);
  } else {
    return c.text(result.error, 404);
  }
});

app.get("/users", async (c) => {
  const result = await fetchAllUsers();
  if (result.isOk()) {
    return c.json(result.value);
  }
});

app.post("/user", zValidator("json", userSchema), async (c) => {
  const data = c.req.valid("json");
  await createUser(data);
  return c.text("User created", 201);
});

const port = 3001;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
