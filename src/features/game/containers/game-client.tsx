"use client";

import { GameEntity } from "@/entities/game";
import { useGame } from "../model/use-game";
import { GameField } from "../ui/field";
import { GameLayout } from "../ui/layout";
import { GamePlayers } from "../ui/players";
import { GameStatus } from "../ui/status";

export function GameClient({ defaultGame }: { defaultGame: GameEntity }) {
  const { game = defaultGame, step } = useGame(defaultGame.id);

  return (
    <GameLayout
      players={<GamePlayers game={game} />}
      status={<GameStatus game={game} />}
      field={<GameField game={game} onCellClick={step} />}
    />
  );
}
