"use client";

import { GameEntity } from "@/entities/game";

export function GameField({
  game,
  onCellClick,
}: {
  game: GameEntity;
  onCellClick?: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-3">
      {game.field.map((s, index) => (
        <button
          key={index}
          onClick={() => onCellClick?.(index)}
          className="flex h-10 w-10 items-center justify-center border border-primary"
        >
          {s ?? ""}
        </button>
      ))}
    </div>
  );
}
