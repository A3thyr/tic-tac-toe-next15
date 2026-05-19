import { getGameById, surrenderGame } from "@/entities/game/server";
import { GameId } from "@/kernel/ids";
import { sseStream } from "@/shared/lib/sse/server";
import { NextRequest } from "next/server";
import { gameEvents } from "../services/game-events";
import { getCurrentUser } from "@/entities/user/server";

export async function getGameStream(
  req: NextRequest,
  { params }: { params: Promise<{ id: GameId }> },
) {
  const { id } = await params;
  const user = await getCurrentUser();

  const game = await getGameById(id);

  if (!game || !user)
    return new Response("Game not found", {
      status: 404,
    });

  const { addCloseListener, close, response, write } = sseStream(req);

  write(game);

  const unwatch = await gameEvents.addGameListener(game.id, (event) => {
    write(event.data);
  });

  try {
    addCloseListener(async () => {
      const result = await surrenderGame(game.id, user);

      if (result.type === "right") {
        gameEvents.emit(result.value);
      }
      unwatch();
    });
  } catch (error) {
    console.error("Failed to subscribe to game events", error);
    close();
    return new Response("Event stream unavailable", { status: 503 });
  }

  return response;
}
