"use server";

import { createGame } from "@/entities/game/server";
import { prisma } from "@/shared/lib/db";
import { left } from "@/shared/lib/either";

export const createGameAction = async () => {
  const mockUser = await prisma.user.findFirst();

  if (!mockUser) return left("user-not-found" as const);

  const gameResult = await createGame(mockUser);

  return gameResult;
};
