"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { FormVals } from "@/components/auth/profile-form";

export async function createProfile(formData: FormVals) {
    try {
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            throw new Error("No user found");
        }

        const { error } = await supabase.from("profiles").upsert({
            id: user.id,
            email: user.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            timezone: formData.timezone,
            native_language_id: formData.nativeLanguage,
            target_language_id: formData.targetLanguage,
            target_level: formData.targetLevel,
        });

        if (error) {
            console.error("Error inserting data:", error);
            throw new Error("Error inserting data");
        }

        redirect("/calendar");

    } catch (error) {
        console.log("Profile creation error:", error);
        redirect("/error");
    }


}