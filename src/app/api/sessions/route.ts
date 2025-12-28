import { type NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { createClient } from "@/lib/supabase/server"; // instantiate the Supabase server client
import { cleanSession, getProfileAndSessions } from "@/lib/sessions";

// get sessions and profile for the user
export async function GET() {
  const supabase = await createClient();
  const { sessions, profile, error, status } = await getProfileAndSessions(supabase);

  if (!profile) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: status ?? 401 });
  }

  return NextResponse.json({ sessions, profile }, { status: status ?? 200 });
}

// create a new session
export async function POST(req: NextRequest) {
  const { localStartTime } = await req.json();
  if (!localStartTime) {
    return NextResponse.json({ error: "localStartTime is required", status: 400 });
  }
  const supabase = await createClient();
  /* need to get user, check they are a valid user */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("No user found:");
    return NextResponse.json({ error: "Unauthorized", status: 401 });
  }
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("timezone, native_language_id, target_language_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    console.error("Error fetching user profile:", profileError);
    return NextResponse.json({ error: "Failed to fetch user profile", status: 500 });
  }

  const zonedStart = DateTime.fromISO(localStartTime, { zone: profile.timezone });
  if (!zonedStart.isValid) {
    return NextResponse.json({ error: "Invalid start time", status: 400 });
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

  if (!newData || !newData.length) {
    console.error("No session data returned after insert.");
    return NextResponse.json({ error: "Failed to create session", status: 500 });
  }

  const cleanedSessions = newData?.map((session) => cleanSession(session, profile.timezone));
  console.log("Cleaned sessions to return:", cleanedSessions);

  if (insertError) {
    console.error("Error creating session:", insertError);
    return NextResponse.json({ error: "Failed to create session", status: 500 });
  }

  return NextResponse.json(
    { session: { ...cleanedSessions[0] } },
    { status: insertResponse.status }
  );
}

// delete a session
export async function DELETE(req: NextRequest) {
  const { sessionId } = await req.json();
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required", status: 400 });
  }
  const supabase = await createClient();
  /* need to get user, check they are a valid user */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("No user found:");
    return NextResponse.json({ error: "Unauthorized", status: 401 });
  }

  const deleteResponse = await supabase
    .from("sessions")
    .delete()
    .eq("id", sessionId)
    .or(`user_one_id.eq.${user.id},user_two_id.eq.${user.id}`);

  const { error: deleteError } = deleteResponse || {};

  if (deleteError) {
    console.error("Error deleting session:", deleteError);
    return NextResponse.json({ error: "Failed to delete session", status: 500 });
  }

  console.log(`Session ${sessionId} deleted successfully. Deleted by user ${user.id}`);

  return NextResponse.json({ status: deleteResponse.status });
}

// add user to session
export async function PATCH(req: NextRequest) {
  const { sessionId } = await req.json();
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }
  // get user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("No user found:");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updateResponse = await supabase
    .from("sessions")
    .update({ user_two_id: user.id })
    .eq("id", sessionId)
    .is("user_two_id", null)
    .neq("user_one_id", user.id)
    .select();

  const { data: updatedData, error: updateError } = updateResponse || {};

  console.log("updateResponse data:", updateResponse);

  if (updateError) {
    console.error("Error updating session:", updateError);
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
  console.log("Updated session data:", updatedData);

  if (!updatedData || !updatedData.length) {
    console.error("No session data returned after update.");
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }

  console.log("Update response data:", updatedData);
  return NextResponse.json({ session: updatedData[0] }, { status: 200 });
}
