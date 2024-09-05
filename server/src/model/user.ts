import { PrismaClient } from "@prisma/client";
import { ok, err } from "neverthrow";

const prisma = new PrismaClient();

export const fetchUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    return err("User not found");
  }
  return ok(user);
};

export const fetchAllUsers = async () => {
  const users = await prisma.user.findMany();
  return ok(users);
};

export const createUser = async (data: { name: string; email: string }) => {
  const user = await prisma.user.create({
    data,
  });
  return ok(user);
};
