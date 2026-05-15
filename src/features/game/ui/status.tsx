import { GameEntity } from "@/entities/game";

export function GameStatus({ game }: { game: GameEntity }) {
  switch (game.status) {
    case "idle": {
      return (
        <div className="flex flex-row justify-between gap-4">
          <div className="text-lg">X - {game.creator.login}</div>
          <div className="text-lg">O - ожидание</div>
        </div>
      );
    }
    case "inProgress":
    case "gameOver":
    case "gameOverDraw":
      return <div className="">TODO</div>;
  }
}
