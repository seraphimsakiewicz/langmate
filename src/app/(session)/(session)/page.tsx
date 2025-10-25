"use client";

import { RoomContext, PreJoin, LocalUserChoices, VideoConference } from "@livekit/components-react";
import { Room, VideoCaptureOptions, TrackPublishDefaults, VideoPresets } from "livekit-client";
import "@livekit/components-styles";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

export default function Page() {
  // TODO: get user input for room and name
  const room = "quickstart-room"; // define based on the session id from supabase.
  const name = "quickstart-user"; // define based on the current user from supabase.
  /*    const {
    data: { user },
  } = await supabase.auth.getUser(); */
  const [roomInstance, setRoomInstance] = useState<Room | undefined>(undefined);
  const [preJoinChoices, setPreJoinChoices] = useState<LocalUserChoices | undefined>(undefined);
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails | undefined>(
    undefined
  );

  const router = useRouter();

  const preJoinDefaults = useMemo(() => {
    return {
      username: "",
      videoEnabled: true,
      audioEnabled: true,
    };
  }, []);

  const handlePreJoinSubmit = useCallback(async (values: LocalUserChoices) => {
    setPreJoinChoices(values);
    const resp = await fetch(`/api/livekit-token?room=${room}&username=${name}`); // call database and get correct room url
    const data = await resp.json();
    setConnectionDetails(data);

    console.log("connectionDetails", data);

    const videoCaptureDefaults: VideoCaptureOptions = {
      deviceId: values.videoDeviceId ?? undefined,
      resolution: VideoPresets.h720,
    };

    const publishDefaults: TrackPublishDefaults = {
      dtx: false,
      videoSimulcastLayers: [VideoPresets.h1080, VideoPresets.h720],
      videoCodec: "vp9",
    };

    const newRoom = {
      videoCaptureDefaults: videoCaptureDefaults,
      publishDefaults: publishDefaults,
      audioCaptureDefaults: {
        deviceId: values.audioDeviceId ?? undefined,
      },
    };

    const roomInstance = new Room(newRoom);

    setRoomInstance(roomInstance);

    roomInstance.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL || "", data.token, {
      autoSubscribe: true,
    });

    roomInstance.on("connected", () => {});

    roomInstance.on("disconnected", () => {
      router.push("/calendar");
    });

    if (values.videoEnabled) {
      roomInstance.localParticipant.setCameraEnabled(true).catch((error) => {
        console.log("ERROR", error);
      });
    }
    if (values.audioEnabled) {
      roomInstance.localParticipant.setMicrophoneEnabled(true).catch((error) => {
        console.log("ERROR", error);
      });
    }
  }, []);

  const handlePreJoinError = useCallback((e: any) => console.error(e), []);

  return (
    <main data-lk-theme="default" style={{ height: "100%" }}>
      {connectionDetails === undefined || preJoinChoices === undefined ? (
        <div style={{ display: "grid", placeItems: "center", height: "100%" }}>
          <h2 className="text-black">Langmate</h2>
          <PreJoin
            defaults={preJoinDefaults}
            onSubmit={handlePreJoinSubmit}
            onError={handlePreJoinError}
          />
        </div>
      ) : (
        <div data-lk-theme="default" style={{ height: "100%" }}>
          <RoomContext.Provider value={roomInstance}>
            <VideoConference />
          </RoomContext.Provider>
        </div>
      )}
    </main>
  );
}
