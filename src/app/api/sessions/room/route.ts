import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server"; // instantiate the Supabase server client

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") || null;
  if (!id) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
  }
  const supabase = await createClient();
  // Fetch session from Supabase
  const sessionRes = await supabase.from("sessions").select("start_time").eq("id", id).single();

  if (sessionRes.error || !sessionRes.data) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const session = sessionRes.data;

  // Check if session is in the past (can't create room for expired session)
  const sessionStart = new Date(session.start_time).getTime();
  const now = Date.now();
  if (sessionStart + 40 * 60 * 1000 < now) {
    // 40 min after start
    return NextResponse.json({ error: "Session has expired" }, { status: 400 });
  }

  // Calculate expiration (40 min after start)
  const exp = Math.floor(new Date(session.start_time).getTime() / 1000) + 40 * 60;

  // Call Daily API
  const roomRes = await fetch("https://api.daily.co/v1/rooms", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `langmate-${id}`,
      // TODO add NBF(not before) property to prevent too early joining, would be -10 minutes from start
      properties: {
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
      roomUrl: `https://englishchats.daily.co/langmate-${id}`,
      startTime: session.start_time,
    },
    { status: 200 }
  );
}
