import { SecondNav } from "@/components/layout/second-nav";
import { Header } from "@/components/layout/header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!profile) redirect("/signup/profile");
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex flex-col overflow-auto min-h-0">
        <div className="sticky top-0 z-20 bg-white">
          <SecondNav />
        </div>
        <main className="flex-1 min-h-0">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
