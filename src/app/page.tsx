import { Header } from "@/components/layout/header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/calendar");
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto flex flex-col items-center justify-center py-24">
        <div className="max-w-xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Practice languages with real people.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Swap roles, run timed sessions, and build fluency together. Log in or sign up to
            reserve your next conversation.
          </p>
        </div>
      </main>
    </div>
  );
}
