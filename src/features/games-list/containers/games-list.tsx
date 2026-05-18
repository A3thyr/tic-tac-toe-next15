import { getIdleGames } from "@/entities/game/server";
import { routes } from "@/kernel/routes";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { GameCard } from "../ui/game-card";
import { Layout } from "../ui/layout";
import { CreateButton } from "./create-button";

export async function GamesList() {
  const games = await getIdleGames();

  return (
    <Layout actions={<CreateButton />}>
      {games.map((game) => (
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
