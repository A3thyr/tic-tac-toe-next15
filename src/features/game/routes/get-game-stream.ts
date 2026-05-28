import { getGameById, surrenderGame } from "@/entities/game/server";
import { GameId } from "@/kernel/ids";
import { sseStream } from "@/shared/lib/sse/server";
import { NextRequest } from "next/server";
import { getCurrentUser } from "@/entities/user/server";
import { sleep } from "@/shared/lib/sleep";

const POLL_INTERVAL_MS = 250;

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

  try {
    let prevSerializedGame = JSON.stringify(game);

    (async () => {
      while (!req.signal.aborted) {
        await sleep(POLL_INTERVAL_MS);

        if (req.signal.aborted) break;

        const nextGame = await getGameById(game.id);
        if (!nextGame) continue;

        const nextSerializedGame = JSON.stringify(nextGame);

        if (nextSerializedGame === prevSerializedGame) continue;

        prevSerializedGame = nextSerializedGame;
        write(nextGame);
      }
    })().catch((error) => {
      console.error("Failed while polling game stream", error);
      close();
    });

    addCloseListener(() => {
      surrenderGame(game.id, user);
    });
  } catch (error) {
    console.error("Failed to subscribe to game events", error);
    close();
    return new Response("Event stream unavailable", { status: 503 });
  }

  return response;
}
