import { type NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { createClient } from "@/lib/supabase/server"; // instantiate the Supabase server client
import { cleanSession, getProfileAndSessions } from "@/lib/sessions";
import { sendEmail } from "@/utils/emailUtils";

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
    .select("timezone, native_language_id, target_language_id, first_name, last_name")
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
    .select(
      `*, 
        user_one_name:public_profiles!sessions_user_one_id_fkey(first_name,last_name)`
    );

  console.log("Insert response:", insertResponse);
  const { data: newData, error: insertError } = insertResponse || {};

  if (!newData || !newData.length) {
    console.error("No session data returned after insert.");
    return NextResponse.json({ error: "Failed to create session", status: 500 });
  }

  const cleanedSession = cleanSession(newData[0], profile.timezone);
  console.log("Cleaned session to return:", cleanedSession);

  if (insertError) {
    console.error("Error creating session:", insertError);
    return NextResponse.json({ error: "Failed to create session", status: 500 });
  }

  sendEmail(
    user.email!,
    `${profile.first_name} ${profile.last_name || ""}`,
    "New Session Created",
    `<div>Your session scheduled at ${zonedStart.toFormat(
      "ff ZZZZ"
    )} has been created successfully.</div>`
  ).catch((emailError) => {
    console.error("Error sending email:", emailError);
  });

  return NextResponse.json({ session: { ...cleanedSession } }, { status: insertResponse.status });
}

// cancel a session
/* { action: "deleted" | "user_two_removed" | "user_one_removed", session?: UpdatedSession } */
export async function DELETE(req: NextRequest) {
  const { sessionData, profileData } = await req.json();
  if (!sessionData || !sessionData.id || !profileData || !profileData.id) {
    return NextResponse.json({ error: "Required data missing", status: 400 });
  }

  console.log("sessionData received for deletion:", sessionData);
  const supabase = await createClient();
  /* need to get user, check they are a valid user */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("No user found:");
    return NextResponse.json({ error: "Unauthorized", status: 401 });
  }

  const currentUserData = {
    email: user.email,
    timezone: profileData.timezone,
    name: "",
  };

  if (sessionData.user_one_id === user.id && !sessionData.user_two_id) {
    const deleteResponse = await supabase.from("sessions").delete().eq("id", sessionData.id);

    currentUserData.name = `${sessionData.user_one_name.first_name} ${sessionData.user_one_name.last_name || ""}`;

    const { error: deleteError } = deleteResponse || {};

    if (deleteError) {
      console.error("Error deleting session:", deleteError);
      return NextResponse.json({ error: "Failed to delete session", status: 500 });
    }

    const start_time = `${sessionData.date}T${sessionData.startTime}`;

    sendEmail(
      currentUserData.email!,
      currentUserData.name,
      "Session Cancelled",
      `<div>Your session scheduled at ${DateTime.fromISO(start_time, {
        zone: currentUserData.timezone,
      }).toFormat("ff ZZZZ")} has been cancelled successfully.</div>`
    ).catch((emailError) => {
      console.error("Error sending email:", emailError);
    });

    return NextResponse.json({ status: deleteResponse.status, action: "deleted" });
  } else if (sessionData.user_two_id === user.id) {
    const updateResponse = await supabase
      .from("sessions")
      .update({ user_two_id: null })
      .eq("id", sessionData.id)
      .select(
        `*, 
        user_one_data:profiles!sessions_user_one_id_fkey(email, timezone, first_name, last_name)`
      );

    const { data: updatedData, error: updateError } = updateResponse || {};

    console.log("updateResponse data:", updateResponse);

    if (updateError) {
      console.error("Error updating session:", updateError);
      return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
    }

    if (!updatedData || !updatedData.length) {
      console.error("No session data returned after update.");
      return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
    }
    currentUserData.name = `${sessionData.user_two_name.first_name} ${sessionData.user_two_name.last_name || ""}`;
    const start_time = `${sessionData.date}T${sessionData.startTime}`;

    sendEmail(
      currentUserData.email!,
      currentUserData.name,
      "Session Cancelled - We Understand",
      `<div>
        <p>We understand plans change. We've removed you from the session scheduled at ${DateTime.fromISO(
          start_time,
          {
            zone: currentUserData.timezone,
          }
        ).toFormat("ff ZZZZ")}.</p>
        <p>Don't worry, your partner has been notified and the session remains available for new matches.</p>
      </div>`
    ).catch((emailError) => {
      console.error("Error sending email:", emailError);
    });

    const newData = updatedData[0];

    sendEmail(
      newData.user_one_data.email,
      `${newData.user_one_data.first_name} ${newData.user_one_data.last_name || ""}`,
      // TODO: need to add date/time for all of these sendEmail calls, to prevent threading issues.
      "Your Session Partner Cancelled",
      `<div>
        <p>Unfortunately, your match for the session scheduled at ${DateTime.fromISO(start_time, {
          zone: newData.user_one_data.timezone,
        }).toFormat("ff ZZZZ")} has cancelled.</p>
        <p>Don't worry, your session is still active and available for others to book.</p>
      </div>`
    ).catch((emailError) => {
      console.error("Error sending email:", emailError);
    });

    return NextResponse.json({
      status: updateResponse.status,
      action: "user_two_removed",
      newSession: cleanSession(updatedData[0], profileData.timezone),
    });
  } else {
    /* since user_one cancelling, promoting user_two_id to user_one_id, and swapping the language
    ids. */
    const updateResponse = await supabase
      .from("sessions")
      .update({
        user_two_id: null,
        user_one_id: sessionData.user_two_id,
        language_one_id: sessionData.language_two_id,
        language_two_id: sessionData.language_one_id,
      })
      .eq("id", sessionData.id)
      .select(
        `*, 
        user_one_data:profiles!sessions_user_one_id_fkey(email, timezone, first_name, last_name),
        user_one_name:public_profiles!sessions_user_one_id_fkey(first_name,last_name), 
        user_two_name:public_profiles!sessions_user_two_id_fkey(first_name,last_name)`
      );

    const { data: updatedData, error: updateError } = updateResponse || {};

    console.log("updateResponse data:", updateResponse);

    if (updateError) {
      console.error("Error updating session:", updateError);
      return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
    }
    if (!updatedData || !updatedData.length) {
      console.error("No session data returned after update.");
      return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
    }

    currentUserData.name = `${sessionData.user_one_name.first_name} ${sessionData.user_one_name.last_name || ""}`;
    const start_time = `${sessionData.date}T${sessionData.startTime}`;

    sendEmail(
      currentUserData.email!,
      currentUserData.name,
      "Session Cancelled - We Understand",
      `<div>
        <p>We understand plans change. We've removed you from the session scheduled at ${DateTime.fromISO(
          start_time,
          {
            zone: currentUserData.timezone,
          }
        ).toFormat("ff ZZZZ")}.</p>
        <p>Don't worry, your partner has been notified and the session remains available for new matches.</p>
      </div>`
    ).catch((emailError) => {
      console.error("Error sending email:", emailError);
    });

    const newData = updatedData[0];

    sendEmail(
      newData.user_one_data.email,
      `${newData.user_one_data.first_name} ${newData.user_one_data.last_name || ""}`,
      // TODO: need to add date/time for all of these sendEmail calls, to prevent threading issues.
      "Your Session Partner Cancelled",
      `<div>
        <p>Unfortunately, your match for the session scheduled at ${DateTime.fromISO(start_time, {
          zone: newData.user_one_data.timezone,
        }).toFormat("ff ZZZZ")} has cancelled.</p>
        <p>Don't worry, your session is still active and available for others to book.</p>
      </div>`
    ).catch((emailError) => {
      console.error("Error sending email:", emailError);
    });

    return NextResponse.json({
      status: updateResponse.status,
      action: "user_one_removed",
      newSession: cleanSession(updatedData[0], profileData.timezone), // timezone will be handled client-side
    });
  }
}

// add user to session
export async function PATCH(req: NextRequest) {
  const { sessionId, profileData } = await req.json();
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
    .neq("user_one_id", user.id).select(`*, 
     user_one_data:profiles!sessions_user_one_id_fkey(first_name,last_name,email,timezone), 
     user_two_data:profiles!sessions_user_two_id_fkey(first_name,last_name,email,timezone)
    `);

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

  const getUser = (num: string) => {
    return updatedData[0][`user_${num}_data`];
  };

  const getUsersName = (num: string) => {
    const userData = getUser(num);
    return `${userData.first_name} ${userData.last_name || ""}`;
  };

  ["one", "two"].forEach((num) => {
    const emailTo = getUser(num).email;
    const nameTo = getUsersName(num);
    const usersTimezone = getUser(num).timezone;

    const sessionStartTime = DateTime.fromISO(updatedData[0].start_time, {
      zone: usersTimezone,
    }).toFormat("ff ZZZZ");

    let matchName = getUsersName("two");
    let subject = `${matchName} booked a session with you starting at ${sessionStartTime} !`;
    let emailBody = `<div>You've been matched for your session scheduled at ${sessionStartTime} with ${matchName}.</div>`;

    if (num === "two") {
      matchName = getUsersName("one");
      subject = `You've booked a session with ${matchName} starting at ${sessionStartTime} !`;
      emailBody = `<div>You've booked a session scheduled at ${sessionStartTime} with ${matchName}.</div>`;
    }

    sendEmail(emailTo, nameTo, subject, emailBody).catch((emailError) => {
      console.error(`Error sending email to user_${num}:`, emailError);
    });
  });

  console.log("Update response data:", updatedData);
  return NextResponse.json(
    { session: cleanSession(updatedData[0], profileData.timezone) },
    { status: 200 }
  );
}
