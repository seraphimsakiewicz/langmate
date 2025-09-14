"use client";

import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
  PreJoin,
  LocalUserChoices,
  VideoConference,
} from "@livekit/components-react";
import {
  Room,
  Track,
  VideoCaptureOptions,
  TrackPublishDefaults,
  VideoPresets,
  VideoCodec,
} from "livekit-client";
import "@livekit/components-styles";
import { useCallback, useEffect, useMemo, useState } from "react";

type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

export default function Page() {
  // TODO: get user input for room and name
  const room = "quickstart-room";
  const name = "quickstart-user";
  const [roomInstance, setRoomInstance] = useState<Room | undefined>(undefined);
  const [preJoinChoices, setPreJoinChoices] = useState<LocalUserChoices | undefined>(undefined);
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails | undefined>(
    undefined
  );

  const preJoinDefaults = useMemo(() => {
    return {
      username: "",
      videoEnabled: true,
      audioEnabled: true,
    };
  }, []);

  const handlePreJoinSubmit = useCallback(async (values: LocalUserChoices) => {
    setPreJoinChoices(values);
    const resp = await fetch(`/api/livekit-token?room=${room}&username=${name}`);
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
          <PreJoin
            defaults={preJoinDefaults}
            onSubmit={handlePreJoinSubmit}
            onError={handlePreJoinError}
          />
        </div>
      ) : (
        <div data-lk-theme="default" style={{ height: "100dvh" }}>
          <RoomContext.Provider value={roomInstance}>
            <VideoConference />
            {/* Your custom component with basic video conferencing functionality. */}
            {/* <MyVideoConference /> */}
            {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
            {/* <RoomAudioRenderer /> */}
            {/* Controls for the user to start/stop audio, video, and screen share tracks */}
            {/* <ControlBar /> */}
          </RoomContext.Provider>
        </div>
      )}
    </main>
  );
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user joins without a published
  // camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: true },
    ],
    { onlySubscribed: false }
  );
  return (
    <GridLayout tracks={tracks} style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}>
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}
