import { GameId, UserId } from "@/kernel/ids";
import { left, right } from "@/shared/lib/either";

export type GameEntity =
  | GameIdleEntity
  | GameInProgressEntity
  | GameOverEntity
  | GameOverDrawEntity;

export type GameIdleEntity = {
  id: GameId;
  creator: PlayerEntity;
  field: Field;
  status: "idle";
};

export type GameInProgressEntity = {
  id: GameId;
  players: PlayerEntity[];
  field: Field;
  status: "inProgress";
};

export type GameOverEntity = {
  id: GameId;
  players: PlayerEntity[];
  field: Field;
  status: "gameOver";
  winner: PlayerEntity;
};

export type GameOverDrawEntity = {
  id: GameId;
  players: PlayerEntity[];
  field: Field;
  status: "gameOverDraw";
};

export type PlayerEntity = {
  id: UserId;
  login: string;
  rating: number;
};

export type Field = Cell[];
export type Cell = string | null;
export type GameSymbolS = string;

export const GameSymbol = {
  X: "X",
  O: "O",
};

export const getGameCurrentSymbol = (
  game: GameInProgressEntity | GameOverEntity | GameOverDrawEntity,
) => {
  const symbols = game.field.filter((e) => e !== null).length;

  return symbols % 2 === 0 ? GameSymbol.X : GameSymbol.O;
};

export const getNextSymbol = (gameSymbol: GameSymbolS) => {
  if (gameSymbol === GameSymbol.X) {
    return GameSymbol.O;
  }

  return GameSymbol.X;
};

export const getPlayerSymbol = (
  player: PlayerEntity,
  game: GameInProgressEntity | GameOverEntity,
) => {
  const index = game.players.findIndex((p) => p.id === player.id);

  return { 0: GameSymbol.X, 1: GameSymbol.O }[index];
};

export const doStep = (
  game: GameInProgressEntity,
  index: number,
  player: PlayerEntity,
) => {
  const currentSymbol = getGameCurrentSymbol(game);

  // const nextSymbol = getNextSymbol(currentSymbol);

  if (currentSymbol !== getPlayerSymbol(player, game))
    return left("player-symbol-is-not-correct");

  if (game.field[index]) return left("game-cell-already-filled");

  const newField = game.field.map((cell, i) =>
    i === index ? currentSymbol : cell,
  );

  const winner = calculateWinner(newField);

  if (winner)
    return right({
      ...game,
      field: newField,
      winner: player,
      status: "gameOver",
    } satisfies GameOverEntity);

  if (isDraw(newField))
    return right({
      ...game,
      field: newField,
      status: "gameOverDraw",
    } satisfies GameOverDrawEntity);

  return right({
    ...game,
    field: newField,
  });
};

function isDraw(fields: Field) {
  const winner = calculateWinner(fields);

  if (!winner) return fields.every((s) => s !== null);

  return false;
}

function calculateWinner(fields: Field) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
      return fields[a];
    }
  }
  return null;
}
