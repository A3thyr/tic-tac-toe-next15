import Link from "next/link";

export function BottomLink({
  linkText,
  text,
  url,
}: {
  text: string;
  linkText: string;
  url: string;
}) {
  return (
    <p className="text-primary/50 text-sm">
      {text}{" "}
      <Link href={url} className="font-medium text-primary hover:underline">
        {linkText}
      </Link>
    </p>
  );
}
