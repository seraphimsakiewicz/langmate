"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ResetPasswordState = {
  message?: string | null;
};

export async function resetPassword(_prevState: ResetPasswordState, formData: FormData) {
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (typeof password !== "string" || typeof confirmPassword !== "string") {
    return { message: "Please enter a new password." };
  }

  if (password.length < 6) {
    return { message: "Password must be at least 6 characters." };
  }

  if (password !== confirmPassword) {
    return { message: "Passwords do not match." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "Reset link expired. Please request a new one." };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("Reset password error:", error);
    return { message: "Unable to reset password. Please try again." };
  }

  redirect("/calendar");
}
