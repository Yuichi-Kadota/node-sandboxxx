import { PrismaClient, Prisma } from "@prisma/client";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

import {
  AlreadyExistError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../lib/error";

export function handlePrismaError(e: unknown) {
  console.log(e);
  if (e instanceof PrismaClientValidationError) {
    return new BadRequestError();
  }
  if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
    return new NotFoundError();
  }
  if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
    return new AlreadyExistError();
  }
  if (e instanceof PrismaClientUnknownRequestError) {
    return new BadRequestError();
  }
  if (e instanceof PrismaClientInitializationError) {
    return new InternalServerError();
  }
  return new InternalServerError();
}
