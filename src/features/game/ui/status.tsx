import { GameEntity, getGameCurrentStep } from "@/entities/game";

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
    case "inProgress": {
      const currentSymbol = getGameCurrentStep(game);
      return <div className="text-lg">Ход: {currentSymbol}</div>;
    }
    case "gameOver": {
      const currentSymbol = getGameCurrentStep(game);
      return <div className="text-lg">Победитель: {currentSymbol}</div>;
    }
    case "gameOverDraw":
      return <div className="text-lg">Ничья</div>;
  }
}
