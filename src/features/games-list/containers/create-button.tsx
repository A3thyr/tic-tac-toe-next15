"use client";

import { mapLeft, right } from "@/shared/lib/either";
import { useActionState } from "@/shared/lib/react";
import { Button } from "@/shared/ui/button";
import { createGameAction } from "../actions/create-game";
import { startTransition } from "react";

export function CreateButton() {
  const [data, dispatch, isPending] = useActionState(
    createGameAction,
    right(undefined),
  );

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        disabled={isPending}
        onClick={() => startTransition(dispatch)}
        error={mapLeft(
          data,
          (e) =>
            ({
              ["already-has-created-game"]:
                "У вас уже есть созданная игра, завершите её, прежде чем создать новую",
              ["user-not-found"]: "Не удалось найти пользователя",
            })[e],
        )}
      >
        Создать игру
      </Button>
    </div>
  );
}
