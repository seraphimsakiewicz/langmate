import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server"; // instantiate the Supabase server client

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") || null;
  if (!id) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
  }
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("No user found:");
    return NextResponse.json({ error: "Unauthorized", status: 401 });
  }

  // Fetch session from Supabase
  const sessionRes = await supabase
    .from("sessions")
    .select(
      `
  start_time,
  user_one_id,
  user_two_id, 
  user_one_name:public_profiles!sessions_user_one_id_fkey(first_name,last_name), 
  user_two_name:public_profiles!sessions_user_two_id_fkey(first_name,last_name)
`
    )
    .eq("id", id)
    .single();

  if (sessionRes.error || !sessionRes.data) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  type NameObject = {
    first_name: string;
    last_name: string;
  };

  const session = sessionRes.data;
  const isUserOne = user.id === session.user_one_id;
  const userName = (isUserOne
    ? session.user_one_name
    : session.user_two_name) as unknown as NameObject;
  const partnerName = (isUserOne
    ? session.user_two_name
    : session.user_one_name) as unknown as NameObject;
  // Check if session is in the past (can't create room for expired session)
  const sessionStart = new Date(session.start_time).getTime();
  const now = Date.now();
  if (sessionStart + 40 * 60 * 1000 < now) {
    // 40 min after start
    return NextResponse.json({ error: "Session has expired" }, { status: 400 });
  }

  // Calculate expiration (40 min after start)
  const exp = Math.floor(new Date(session.start_time).getTime() / 1000) + 40 * 60;
  const nbf = Math.floor(new Date(session.start_time).getTime() / 1000) - 10 * 60;

  // Call Daily API
  const roomRes = await fetch("https://api.daily.co/v1/rooms", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `swaptalk-${id}`,
      properties: {
        nbf,
        exp,
        enable_prejoin_ui: true,
        enable_people_ui: true,
        enable_pip_ui: true,
        enable_emoji_reactions: true,
        enable_network_ui: true,
        enable_noise_cancellation_ui: true,
        enable_chat: true,
        enable_advanced_chat: true,
      },
    }),
  });
  const data = await roomRes.json();
  console.log("data", data);
  if (roomRes.status !== 200 && data && data?.info.includes("which is in the past")) {
    console.error("Session has expired", data);
    return NextResponse.json({ error: "Session has expired" }, { status: 400 });
  }

  if (data.error && !data.info.includes("already exists")) {
    console.error("Error creating Daily room:", data);
    return NextResponse.json({ error: "Failed to create video room" }, { status: 500 });
  }

  return NextResponse.json(
    {
      roomUrl: `https://englishchats.daily.co/swaptalk-${id}`,
      startTime: session.start_time,
      userName: `${userName.first_name} ${userName.last_name}`,
      partnerName: `${partnerName.first_name} ${partnerName.last_name}`,
    },
    { status: 200 }
  );
}
