import { sessionService } from "@/entities/user/server";
import { Button } from "@/shared/ui/button";
import { redirect } from "next/navigation";
import React from "react";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await sessionService.verifySession();

  return (
    <div className="flex grow flex-col">
      <header className="border-b-primary/50 flex flex-row items-center justify-between gap-4 border-b px-10 py-4">
        <div className="text-lg">Tic Tac Toe</div>
        <div className="flex items-center gap-4">
          <div className="text-lg">{session.login}</div>
          <form
            action={async () => {
              "use server";

              await sessionService.deleteSession();
              redirect("/sign-in");
            }}
          >
            <Button>Sign out</Button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
