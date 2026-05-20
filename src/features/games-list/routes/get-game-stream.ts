import { getIdleGames } from "@/entities/game/server";
import { getCurrentUser } from "@/entities/user/server";
import { sseStream } from "@/shared/lib/sse/server";
import { NextRequest } from "next/server";
import { gameEvents } from "../../../entities/game/services/game-events";

export async function getGamesListStreamRoute(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user)
    return new Response("Game not found", {
      status: 404,
    });

  const { addCloseListener, close, response, write } = sseStream(req);

  write(await getIdleGames());

  try {
    addCloseListener(
      await gameEvents.addGamesCreatedListener(async () => {
        write(await getIdleGames());
      }),
    );
  } catch (error) {
    console.error("Failed to subscribe to game events", error);
    close();
    return new Response("Event stream unavailable", { status: 503 });
  }

  return response;
}
