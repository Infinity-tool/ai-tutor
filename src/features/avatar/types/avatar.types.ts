export interface HeyGenSessionResponse {
  session_id: string;
  sdp: RTCSessionDescriptionInit;
  ice_servers: RTCIceServer[];
  token: string;
  expires_at: number; // unix ms
}

export interface AvatarState {
  status: "idle" | "connecting" | "connected" | "speaking" | "error" | "disconnected";
  session_id: string | null;
  error: string | null;
}

export interface SpeakOptions {
  text: string;
  task_type?: "repeat" | "talk";
}
