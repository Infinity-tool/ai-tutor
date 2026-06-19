/**
 * HeyGen Streaming API Service
 *
 * ALL calls are server-side only. Never import this in client components.
 * Called from: src/app/api/avatar/stream/route.ts
 */

const HEYGEN_API_BASE = "https://api.heygen.com";

export interface HeyGenSessionData {
  session_id: string;
  sdp: RTCSessionDescriptionInit;
  ice_servers: RTCIceServer[];
  expires_at: number;
}

export interface HeyGenSpeakPayload {
  session_id: string;
  text: string;
  task_type?: "repeat" | "talk";
}

/**
 * Create a new HeyGen streaming session.
 * Returns WebRTC SDP offer + ICE servers for the client to connect.
 */
export async function createStreamingSession(
  avatarId: string
): Promise<HeyGenSessionData> {
  const res = await fetch(`${HEYGEN_API_BASE}/v1/streaming.new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": process.env.HEYGEN_API_KEY!,
    },
    body: JSON.stringify({
      avatar_name: avatarId,
      quality: "medium",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HeyGen createSession failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  const d = json.data;

  return {
    session_id: d.session_id,
    sdp: { type: "offer", sdp: d.sdp },
    ice_servers: d.ice_servers ?? [],
    expires_at: Date.now() + 55 * 60 * 1000, // 55 min (expires at 60)
  };
}

/**
 * Send SDP answer back to HeyGen to complete WebRTC handshake.
 */
export async function sendSdpAnswer(
  sessionId: string,
  sdp: RTCSessionDescriptionInit
): Promise<void> {
  const res = await fetch(`${HEYGEN_API_BASE}/v1/streaming.sdp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": process.env.HEYGEN_API_KEY!,
    },
    body: JSON.stringify({ session_id: sessionId, sdp: sdp.sdp }),
  });

  if (!res.ok) {
    throw new Error(`HeyGen sendSdpAnswer failed (${res.status})`);
  }
}

/**
 * Send an ICE candidate to HeyGen.
 */
export async function sendIceCandidate(
  sessionId: string,
  candidate: RTCIceCandidateInit
): Promise<void> {
  await fetch(`${HEYGEN_API_BASE}/v1/streaming.ice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": process.env.HEYGEN_API_KEY!,
    },
    body: JSON.stringify({ session_id: sessionId, candidate }),
  });
}

/**
 * Make the avatar speak the given text.
 */
export async function sendTextToAvatar(
  payload: HeyGenSpeakPayload
): Promise<void> {
  const res = await fetch(`${HEYGEN_API_BASE}/v1/streaming.task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": process.env.HEYGEN_API_KEY!,
    },
    body: JSON.stringify({
      session_id: payload.session_id,
      text: payload.text,
      task_type: payload.task_type ?? "talk",
    }),
  });

  if (!res.ok) {
    throw new Error(`HeyGen speak failed (${res.status})`);
  }
}

/**
 * Close/stop a streaming session and release resources.
 */
export async function closeSession(sessionId: string): Promise<void> {
  await fetch(`${HEYGEN_API_BASE}/v1/streaming.stop`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": process.env.HEYGEN_API_KEY!,
    },
    body: JSON.stringify({ session_id: sessionId }),
  });
}
