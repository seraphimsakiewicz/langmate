import { type NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { createClient } from "@/lib/supabase/server"; // instantiate the Supabase server client

// todo fix any type
const sessionsCleaner = (session: any, timeZone: string) => {
  const newSession = { ...session };
  delete newSession.created_at;
  delete newSession.updated_at;
  const start = DateTime.fromISO(session.start_time, { zone: 'utc' }).setZone(timeZone)
  const end = start.plus({ minutes: 30 });
  delete newSession.start_time;
  newSession.startTime = start.toFormat("HH:mm");
  newSession.endTime = end.toFormat("HH:mm");
  newSession.date = start.toISODate();
  newSession.participant = session.user_two_id ? "Partner" : "Pending partner";
  return newSession;
};

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

  const insertResponse = await supabase
    .from("sessions")
    .insert({
      user_one_id: user.id,
      start_time: utcStartTime,
      language_one_id: profile.native_language_id,
      language_two_id: profile.target_language_id,
    })
    .select();

  console.log("Insert response:", insertResponse);
  const { data: newData, error: insertError } = insertResponse || {};

  if (!newData || newData.length === 0) {
    console.error("No session data returned after insert.");
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }

  const cleanedSessions = newData?.map((session) => sessionsCleaner(session, profile.timezone));
  console.log("Cleaned sessions to return:", cleanedSessions);

  if (insertError) {
    console.error("Error creating session:", insertError);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }

  return NextResponse.json(
    { session: { ...cleanedSessions[0] } },
    { status: insertResponse.status }
  );
}
