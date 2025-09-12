"use client";
import Call from "@/components/agora/call";
import { Button } from "@/components/ui/button";

export default function Page({ params }: { params: { channelName: string } }) {
  return (
    <div className="fixed inset-0 flex flex-col bg-gray-900">
      {/* Top Navigation Header */}
      <div className="h-20 flex items-center justify-between p-4 bg-gray-800 bg-opacity-90">
        {/* Left: User Profile Card */}
        <div className="flex items-center space-x-3 bg-white rounded-lg px-4 py-2">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div>
            <div className="font-semibold text-gray-900">Partner Name</div>
            <div className="text-sm text-gray-600">Language Partner</div>
          </div>
        </div>

        {/* Center: Langmate Branding */}
        <h1 className="text-2xl font-bold text-white">Langmate</h1>

        {/* Right: Timer and Controls */}
        <div className="flex items-center space-x-4">
          <div className="bg-white rounded-lg px-4 py-2">
            <div className="text-sm text-gray-600">
              {/* TODO: fix the UI, to make it look better with the 2 timers. */}
              {/* {renderDisplay()} */}
            </div>
          </div>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            /*     onClick={async () => {
              localStorage.removeItem(sessionId as string);
              router.push("/");
            }} */
          >
            Leave
          </Button>
        </div>
      </div>
      <Call appId={process.env.NEXT_AGORA_APP_ID!} channelName={params.channelName}></Call>
    </div>
  );
}
