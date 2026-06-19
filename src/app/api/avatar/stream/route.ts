/**
 * POST /api/avatar/stream  → Create HeyGen session, return SDP offer + ICE servers
 * DELETE /api/avatar/stream → Close session
 * POST /api/avatar/stream/sdp → Send SDP answer (WebRTC handshake)
 * POST /api/avatar/stream/ice → Send ICE candidate
 * POST /api/avatar/stream/speak → Make avatar speak text
 *
 * SECURITY: HEYGEN_API_KEY never leaves the server.
 */
import { NextRequest } from "next/server";
import { ok, err, serverError } from "@/shared/lib/api-helpers";
import {
  createStreamingSession,
  sendSdpAnswer,
  sendIceCandidate,
  sendTextToAvatar,
  closeSession,
} from "@/features/avatar/services/heygen.service";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.HEYGEN_API_KEY) {
      return err("HeyGen API key is not configured.", 500);
    }

    const body = await req.json();
    const action = body.action as string;

    switch (action) {
      case "create": {
        const avatarId = body.avatar_id ?? process.env.HEYGEN_AVATAR_ID;
        if (!avatarId) return err("avatar_id is required", 400);
        const session = await createStreamingSession(avatarId);
        return ok(session);
      }

      case "sdp": {
        if (!body.session_id || !body.sdp) {
          return err("session_id and sdp are required", 400);
        }
        await sendSdpAnswer(body.session_id, body.sdp);
        return ok({ ok: true });
      }

      case "ice": {
        if (!body.session_id || !body.candidate) {
          return err("session_id and candidate are required", 400);
        }
        await sendIceCandidate(body.session_id, body.candidate);
        return ok({ ok: true });
      }

      case "speak": {
        if (!body.session_id || !body.text) {
          return err("session_id and text are required", 400);
        }
        await sendTextToAvatar({
          session_id: body.session_id,
          text: body.text,
          task_type: body.task_type,
        });
        return ok({ ok: true });
      }

      default:
        return err(`Unknown action: ${action}`, 400);
    }
  } catch (error) {
    return serverError("avatar/stream", error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.session_id) return err("session_id is required", 400);
    await closeSession(body.session_id);
    return ok({ ok: true });
  } catch (error) {
    return serverError("avatar/stream DELETE", error);
  }
}
