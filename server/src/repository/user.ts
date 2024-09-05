import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ok, err, ResultAsync } from "neverthrow";

const prisma = new PrismaClient();

export const fetchUser = async (id: string) => {
  return ResultAsync.fromPromise(
    prisma.user.findUnique({ where: { id } }),
    (e) => {
      return e;
    }
  ).andThen((user) => {
    return user ? ok(user) : err(new Error("User not found"));
  });
};

export const fetchAllUsers = async () => {
  return ResultAsync.fromPromise(prisma.user.findMany(), (e) => {
    return e;
  });
};

export const saveUser = async (data: { name: string; email: string }) => {
  return ResultAsync.fromPromise(prisma.user.create({ data }), (e) => {
    return e;
  });
};
