import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SessionLayout({ children }: { children: React.ReactNode }) {
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
  } else {
    redirect("/signup");
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-hidden">
          <div className="flex flex-col h-screen bg-background">
            <div className="flex-1 overflow-hidden">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
