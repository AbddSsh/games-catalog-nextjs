import Link from "next/link";
import { Button } from "@/shared/ui";
import { ROUTES } from "@/shared/router";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-6xl font-bold text-accent-purple">404</h1>
      <h2 className="mb-2 text-2xl font-semibold text-text-primary">
        Page Not Found
      </h2>
      <p className="mb-8 text-text-secondary">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button asChild variant="accent">
        <Link href={ROUTES.HOME}>Back to Home</Link>
      </Button>
    </div>
  );
}
