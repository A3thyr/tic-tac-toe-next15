import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card";

export function GameLayout({
  players,
  status,
  actions,
  field,
}: {
  players?: React.ReactNode;
  status?: React.ReactNode;
  field?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>Tic Tac Toe 3x3</CardHeader>
      <CardContent className="flex flex-col gap-4">
        {players}
        {status}
        {field}
      </CardContent>
      <CardFooter>{actions}</CardFooter>
    </Card>
  );
}
