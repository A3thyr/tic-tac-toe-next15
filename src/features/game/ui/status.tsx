import { GameEntity, getGameCurrentSymbol } from "@/entities/game";
import { getPlayerSymbol } from "@/entities/game/domain";

export function GameStatus({ game }: { game: GameEntity }) {
  switch (game.status) {
    case "idle": {
      return <div className="text-lg">Ожидание игрока</div>;
    }
    case "inProgress": {
      const currentSymbol = getGameCurrentSymbol(game);
      return <div className="text-lg">Ход: {currentSymbol}</div>;
    }
    case "gameOver": {
      const winnerSymbol = getPlayerSymbol(game.winner, game);
      return <div className="text-lg">Победитель: {winnerSymbol}</div>;
    }
    case "gameOverDraw":
      return <div className="text-lg">Ничья</div>;
  }
}
