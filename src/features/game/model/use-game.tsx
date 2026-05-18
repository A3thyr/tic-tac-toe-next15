import { GameEntity } from "@/entities/game";
import { GameId } from "@/kernel/ids";
import { useEventsSource } from "@/shared/lib/sse/client";

export function useGame(gameId: GameId) {
  const { isPending, dataStream } = useEventsSource<GameEntity>(
    `/game/${gameId}/stream`,
  );

  return {
    game: dataStream,
    isPending,
  };
}
