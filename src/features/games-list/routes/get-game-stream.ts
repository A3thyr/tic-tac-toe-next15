import { getIdleGames } from "@/entities/game/server";
import { getCurrentUser } from "@/entities/user/server";
import { sleep } from "@/shared/lib/sleep";
import { sseStream } from "@/shared/lib/sse/server";
import { NextRequest } from "next/server";

const POLL_INTERVAL_MS = 250;

export async function getGamesListStreamRoute(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user)
    return new Response("Game not found", {
      status: 404,
    });

  const {
    // addCloseListener,
    close,
    response,
    write,
  } = sseStream(req);

  const idleGames = await getIdleGames();

  write(idleGames);

  try {
    let prevSerializedGames = JSON.stringify(idleGames);

    (async () => {
      while (!req.signal.aborted) {
        await sleep(POLL_INTERVAL_MS);

        if (req.signal.aborted) break;

        const nextIdleGames = await getIdleGames();
        const nextSerializedGames = JSON.stringify(nextIdleGames);

        if (nextSerializedGames === prevSerializedGames) continue;

        prevSerializedGames = nextSerializedGames;
        write(nextIdleGames);
      }
    })().catch((error) => {
      console.error("Failed while polling games stream", error);
      close();
    });

    // addCloseListener(() => {});
  } catch (error) {
    console.error("Failed to subscribe to game events", error);
    close();
    return new Response("Event stream unavailable", { status: 503 });
  }

  return response;
}
