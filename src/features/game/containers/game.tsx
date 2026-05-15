import { GameId } from "@/kernel/ids";
import { GameLayout } from "../ui/layout";
import { GamePlayers } from "../ui/players";
import { GameEntity } from "@/entities/game";

export function Game({ gameId }: { gameId: GameId }) {
  const game: GameEntity = {
    id: "1",
    creator: {
      id: "1",
      login: "someone",
      rating: 1000,
    },
    status: "idle",
  };
  return <GameLayout players={<GamePlayers game={game} />} />;
}
