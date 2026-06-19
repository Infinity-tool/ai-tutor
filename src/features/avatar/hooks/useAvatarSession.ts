"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { AvatarState } from "../types/avatar.types";

interface UseAvatarSessionReturn {
  state: AvatarState;
  peerConnection: RTCPeerConnection | null;
  remoteStream: MediaStream | null;
  createSession: () => Promise<void>;
  speak: (text: string) => Promise<void>;
  disconnect: () => Promise<void>;
}

export function useAvatarSession(): UseAvatarSessionReturn {
  const [state, setState] = useState<AvatarState>({
    status: "idle",
    session_id: null,
    error: null,
  });
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Call the server-side API */
  const avatarFetch = useCallback(
    async (body: Record<string, unknown>): Promise<unknown> => {
      const res = await fetch("/api/avatar/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Avatar API error");
      return json.data;
    },
    []
  );

  const disconnect = useCallback(async () => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    if (sessionIdRef.current) {
      try {
        await fetch("/api/avatar/stream", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionIdRef.current }),
        });
      } catch {
        // Best effort cleanup
      }
      sessionIdRef.current = null;
    }

    pcRef.current?.close();
    pcRef.current = null;
    setRemoteStream(null);
    setState({ status: "idle", session_id: null, error: null });
  }, []);

  const createSession = useCallback(async () => {
    setState({ status: "connecting", session_id: null, error: null });

    try {
      // 1. Get SDP offer + ICE servers from server
      const session = (await avatarFetch({ action: "create" })) as {
        session_id: string;
        sdp: RTCSessionDescriptionInit;
        ice_servers: RTCIceServer[];
        expires_at: number;
      };

      sessionIdRef.current = session.session_id;

      // 2. Set up RTCPeerConnection
      const pc = new RTCPeerConnection({ iceServers: session.ice_servers });
      pcRef.current = pc;

      // Collect ICE candidates and send to server
      pc.onicecandidate = async (e) => {
        if (e.candidate && sessionIdRef.current) {
          await avatarFetch({
            action: "ice",
            session_id: sessionIdRef.current,
            candidate: e.candidate.toJSON(),
          }).catch(console.error);
        }
      };

      // Receive remote media stream
      pc.ontrack = (e) => {
        if (e.streams?.[0]) {
          setRemoteStream(e.streams[0]);
          setState((prev) => ({ ...prev, status: "connected" }));
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
          setState((prev) => ({ ...prev, status: "disconnected" }));
        }
      };

      // 3. Set remote SDP offer
      await pc.setRemoteDescription(new RTCSessionDescription(session.sdp));

      // 4. Create answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // 5. Send answer to server → HeyGen
      await avatarFetch({
        action: "sdp",
        session_id: session.session_id,
        sdp: { type: answer.type, sdp: answer.sdp },
      });

      setState({
        status: "connected",
        session_id: session.session_id,
        error: null,
      });

      // 6. Schedule token refresh at 55 minutes
      const msUntilRefresh = session.expires_at - Date.now() - 60_000;
      refreshTimerRef.current = setTimeout(() => {
        createSession();
      }, Math.max(msUntilRefresh, 0));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to connect avatar";
      setState({ status: "error", session_id: null, error: message });
    }
  }, [avatarFetch]);

  const speak = useCallback(
    async (text: string) => {
      if (!sessionIdRef.current) return;
      setState((prev) => ({ ...prev, status: "speaking" }));
      try {
        await avatarFetch({
          action: "speak",
          session_id: sessionIdRef.current,
          text,
        });
        setState((prev) => ({ ...prev, status: "connected" }));
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Speak failed";
        setState((prev) => ({ ...prev, status: "error", error: msg }));
      }
    },
    [avatarFetch]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      pcRef.current?.close();
    };
  }, []);

  return {
    state,
    peerConnection: pcRef.current,
    remoteStream,
    createSession,
    speak,
    disconnect,
  };
}
