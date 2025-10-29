import { type NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { createClient } from "@/lib/supabase/server"; // instantiate the Supabase server client

export async function POST(req: NextRequest) {
  const { localStartTime } = await req.json();
  if (!localStartTime) {
    return NextResponse.json({ error: "localStartTime is required" }, { status: 400 });
  }
  const supabase = await createClient();
  /* need to get user, check they are a valid user */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("No user found:");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("timezone, native_language_id, target_language_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    console.error("Error fetching user profile:", profileError);
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
  }

  const zonedStart = DateTime.fromISO(localStartTime, { zone: profile.timezone });
  if (!zonedStart.isValid) {
    return NextResponse.json({ error: "Invalid start time" }, { status: 400 });
  }
  const utcStartTime = zonedStart.toUTC().toISO(); // persist this

  const { data: newData, error: insertError } = await supabase
    .from("sessions")
    .insert({
      user_one_id: user.id,
      start_time: utcStartTime,
      language_one_id: profile.native_language_id,
      language_two_id: profile.target_language_id,
    })
    .single();

  if (insertError) {
    console.error("Error creating session:", insertError);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }

  return NextResponse.json({ session: newData }, { status: 201 });
}
