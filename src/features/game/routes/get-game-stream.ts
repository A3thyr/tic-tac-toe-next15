import { getGameById } from "@/entities/game/server";
import { GameId } from "@/kernel/ids";
import { sseStream } from "@/shared/lib/sse/server";
import { NextRequest } from "next/server";
import { gameEvents } from "../services/game-events";

export async function getGameStream(
  req: NextRequest,
  { params }: { params: Promise<{ id: GameId }> },
) {
  const { id } = await params;

  const game = await getGameById(id);

  if (!game)
    return new Response("Game not found", {
      status: 404,
    });

  const { addCloseListener, close, response, write } = sseStream(req);

  write(game);

  try {
    addCloseListener(
      await gameEvents.addGameListener(game.id, (event) => {
        write(event.data);
      }),
    );
  } catch (error) {
    console.error("Failed to subscribe to game events", error);
    close();
    return new Response("Event stream unavailable", { status: 503 });
  }

  return response;
}
