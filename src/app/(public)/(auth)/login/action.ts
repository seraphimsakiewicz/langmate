"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type LoginFormState = {
  errorCode?: string | null;
  message?: string | null;
};

export async function login(_prevState: LoginFormState, formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log("Login error:", error);

    if (error.code === "invalid_credentials") {
      return {
        errorCode: error.code,
        message: "Account not found.",
      };
    }

    return {
      errorCode: "unknown",
      message: "Unable to sign in. Please try again.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/calendar");
}
