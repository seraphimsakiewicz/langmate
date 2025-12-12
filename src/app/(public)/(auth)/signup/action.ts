"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const getURL = () => {
  let url = process?.env?.NEXT_PUBLIC_VERCEL_URL ?? "http://localhost:3000/"; // Automatically set by Vercel.
  // Make sure to include `https://` when not localhost.
  url = url.startsWith("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
};

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp({
    ...data,
    options: {
      emailRedirectTo: getURL(),
    },
  });

  if (error) {
    console.log("Signup error:", error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/signup/confirm");
}
