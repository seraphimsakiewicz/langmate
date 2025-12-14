import { ProfileForm } from "@/components/auth/profile-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signup");
  }

  const { data: languages, error } = await supabase
    .from("languages")
    .select("id, name")
    .order("name");

  if (error) {
    console.error("Error loading languages", error);
  }

  return (
    <div className="flex min-h-svh w-full overflow-y-auto items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg">
        <ProfileForm languages={languages || []} />
      </div>
    </div>
  );
}
