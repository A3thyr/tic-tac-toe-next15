import { GameEntity } from "@/entities/game";
import { doStep, PlayerEntity } from "@/entities/game/domain";
import { GameId } from "@/kernel/ids";
import { routes } from "@/kernel/routes";
import { useEventsSource } from "@/shared/lib/sse/client";
import { useOptimistic, useTransition } from "react";
import { gameStepAction } from "../actions/game-step";

export function useGame(gameId: GameId, player: PlayerEntity) {
  const { isPending, dataStream } = useEventsSource<GameEntity>(
    routes.gameStream(gameId),
  );

  const [isPendingTransition, startTransition] = useTransition();

  const [optimisticGame, dispatchOptimistic] = useOptimistic(
    dataStream,
    (game, index: number) => {
      if (!game || game.status !== "inProgress") {
        return game;
      }

      const result = doStep({ game, index, player });

      if (result.type === "right") return result.value;

      return game;
    },
  );

  const step = (index: number) => {
    startTransition(async () => {
      dispatchOptimistic(index);
      await gameStepAction({ gameId, index });
    });
  };

  return {
    game: optimisticGame,
    step,
    isPending: isPending,
    isStepPending: isPendingTransition,
  };
}
