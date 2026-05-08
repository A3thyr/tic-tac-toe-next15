import { prisma } from "@/shared/lib/db";
import { Game, Prisma, User } from "@prisma/client";
import { z } from "zod";
import { GameEntity, GameIdleEntity, GameOverEntity } from "../domain";
import { removePassword } from "@/shared/lib/password";

async function gamesList(where?: Prisma.GameWhereInput): Promise<GameEntity[]> {
  const games = prisma.game.findMany({
    where,
    include: {
      winner: true,
      players: true,
    },
  });

  return (await games).map(dbGameToGameEntity);
}

const fieldSchema = z.array(z.union([z.string(), z.null()]));

function dbGameToGameEntity(
  game: Game & {
    players: User[];
    winner?: User | null;
  },
): GameEntity {
  const players = game.players.map(removePassword);
  switch (game.status) {
    case "idle": {
      const [creator] = players;
      if (!creator) throw new Error("Creator should be in the game idle");
      return {
        id: game.id,
        creator: creator,
        status: game.status,
      } satisfies GameIdleEntity;
    }
    case "inProgress":
    case "gameOverDraw":
      return {
        id: game.id,
        players: players,
        status: game.status,
        field: fieldSchema.parse(game.field),
      };
    case "gameOver": {
      if (!game.winner) throw new Error("Winner should be in gameOver");
      return {
        id: game.id,
        players: players,
        status: game.status,
        field: fieldSchema.parse(game.field),
        winner: removePassword(game.winner),
      } satisfies GameOverEntity;
    }
  }
}

export const gameRepository = {
  gamesList,
};
