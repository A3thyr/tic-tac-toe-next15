import { prisma } from "@/shared/lib/db";
import { Button } from "@/shared/ui/button";
import { Card, CardTitle } from "@/shared/ui/card";

export default async function Home() {
  const games = await prisma.game.findMany();

  console.log(games);

  return (
    <div className="w-full h-svh flex items-center justify-center">
      <Button>Yo</Button>
      {games.map((card) => (
        <Card key={card.id}>
          <CardTitle>{card.name}</CardTitle>
        </Card>
      ))}
    </div>
  );
}
