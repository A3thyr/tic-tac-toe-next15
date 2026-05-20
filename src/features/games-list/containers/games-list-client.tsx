"use client";

import { GameIdleEntity } from "@/entities/game";
import { routes } from "@/kernel/routes";
import { useEventsSource } from "@/shared/lib/sse/client";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { GameCard } from "../ui/game-card";
import { Layout } from "../ui/layout";
import { CreateButton } from "./create-button";

export function GamesListClient({ games }: { games: GameIdleEntity[] }) {
  const { dataStream: gamesStream = games } = useEventsSource<GameIdleEntity[]>(
    routes.gamesStream(),
  );

  return (
    <Layout actions={<CreateButton />}>
      {gamesStream.map((game) => (
        <GameCard
          key={game.id}
          login={game.creator.login}
          rating={game.creator.rating}
          actions={
            <Link href={routes.game(game.id)}>
              <Button>Подключиться</Button>
            </Link>
          }
        />
      ))}
    </Layout>
  );
}
