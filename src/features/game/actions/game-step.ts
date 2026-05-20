"use server";

import { stepGame } from "@/entities/game/server";
import { getCurrentUser } from "@/entities/user/server";
import { GameId } from "@/kernel/ids";
import { left } from "@/shared/lib/either";
import { gameEvents } from "../services/game-events";

export const gameStepAction = async ({
  index,
  gameId,
}: {
  gameId: GameId;
  index: number;
}) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return left("not-found");

  const res = await stepGame(gameId, currentUser, index);

  if (res.type === "right") {
    gameEvents.emit(res.value);

    return res;
  }

  return res;
};
