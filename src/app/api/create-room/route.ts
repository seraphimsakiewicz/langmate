// step 1: add daily api key to env --DONE
// step 2: create api route (in this file)
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "POSTED" });
}
// step 3: call the server endpoint from the client when a match is confirmed(probably in the /page.tsx)
// step 4: use the returned URL from the server inside the /[sessionId] page.tsx
// step 5: set an expiry for each room.
