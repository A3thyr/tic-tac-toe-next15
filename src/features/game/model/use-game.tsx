import { GameEntity } from "@/entities/game";
import { doStep, PlayerEntity } from "@/entities/game/domain";
import { GameId } from "@/kernel/ids";
import { routes } from "@/kernel/routes";
import { useEventsSource } from "@/shared/lib/sse/client";
import { useEffect, useOptimistic, useState, useTransition } from "react";
import { gameStepAction } from "../actions/game-step";

export function useGame(
  gameId: GameId,
  player: PlayerEntity,
  defaultGame: GameEntity,
) {
  const { isPending, dataStream } = useEventsSource<GameEntity>(
    routes.gameStream(gameId),
  );
  const [currentGame, setCurrentGame] = useState<GameEntity>(defaultGame);

  const [isPendingTransition, startTransition] = useTransition();

  useEffect(() => {
    if (dataStream) {
      setCurrentGame(dataStream);
    }
  }, [dataStream]);

  const [optimisticGame, dispatchOptimistic] = useOptimistic(
    currentGame,
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
      const result = await gameStepAction({ gameId, index });
      if (result.type === "right") {
        setCurrentGame(result.value);
      }
    });
  };

  return {
    game: optimisticGame,
    step,
    isPending: isPending,
    isStepPending: isPendingTransition,
  };
}
