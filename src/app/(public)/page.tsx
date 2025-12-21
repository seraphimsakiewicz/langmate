import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function LandingPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center text-center max-w-2xl">
        <img src="/swaptalk-logo.svg" alt="Swaptalk logo" className="h-40 w-40" />
        <h1 className="text-6xl font-bold text-primary mb-6">Swaptalk</h1>
        <h2 className="text-5xl font-bold text-primary tracking-tight mb-8">
          Practice languages with real people.
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Build fluency together. Log in or sign up to start your next conversation.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" className="min-w-40" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button className="min-w-40" asChild>
            <Link href="/signup">Join for free</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
