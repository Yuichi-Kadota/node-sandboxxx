import { ok, err, ResultAsync } from "neverthrow";
import prisma from "../infra/prisma";
import { handlePrismaError } from "../infra/error";
import { NotFoundError } from "../lib/error";

export const fetchUser = async (id: string) => {
  return ResultAsync.fromPromise(
    prisma.user.findUnique({ where: { id } }),
    (e) => {
      return handlePrismaError(e);
    }
  ).andThen((user) => {
    return user ? ok(user) : err(new NotFoundError());
  });
};

export const fetchAllUsers = async () => {
  return ResultAsync.fromPromise(prisma.user.findMany(), (e) => {
    return handlePrismaError(e);
  });
};

export const saveUser = async (data: { name: string; email: string }) => {
  return ResultAsync.fromPromise(prisma.user.create({ data }), (e) => {
    return handlePrismaError(e);
  });
};
