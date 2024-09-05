import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { FetchUser } from "./service/user";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/user:userId", async (c) => {
  const userId = c.req.param("userId");
  if (!userId) {
    return c.text("User ID is required", 400);
  }
  const user = await FetchUser(userId);
  return c.json(user);
});

const port = 3001;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
