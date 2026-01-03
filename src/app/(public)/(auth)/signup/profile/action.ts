"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { FormVals } from "@/components/auth/profile-form";

export async function createProfile(formData: FormVals) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("No user found:");
    redirect("/error");
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email,
    first_name: formData.firstName,
    last_name: formData.lastName,
    timezone: formData.timezone,
    fluent_language_id: formData.fluentLanguage,
    target_language_id: formData.targetLanguage,
    target_level: formData.targetLevel,
  });

  if (error) {
    console.error("Error inserting data:", error);
    redirect("/error");
  }

  redirect("/calendar");
}
