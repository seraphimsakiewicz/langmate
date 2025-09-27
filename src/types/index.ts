export type Language = "en" | "es";

export type FindMatchData = {
  nativeLanguage: Language;
  targetLanguage: Language;
};

export type UserData = {
  id: string;
} & FindMatchData;

export type SessionInfo = {
  startTime: string;
  sessionId: string;
  roomUrl: string;
};

export interface SessionData extends Array<UserData | SessionInfo> {
  0: UserData;
  1: UserData;
  2: SessionInfo;
}
