"use client";

import { useCallback, useRef, useState } from "react";

export interface RealtimeExchange {
  role: "user" | "assistant";
  content: string;
}

interface RealtimeServerEvent {
  type?: string;
  transcript?: string;
}

const REALTIME_CALLS_URL = "https://api.openai.com/v1/realtime/calls";

/**
 * Manages a live WebRTC voice session with Ember (OpenAI's Realtime API) —
 * the actual talking-and-listening loop Presence mode opens into, not a
 * one-shot text-to-speech call. Mints a short-lived client secret from our
 * own server, then connects the browser directly to OpenAI so audio never
 * has to round-trip through our backend.
 */
export function useEmberRealtime() {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const transcriptRef = useRef<RealtimeExchange[]>([]);

  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [talking, setTalking] = useState(false);
  const [listening, setListening] = useState(false);
  const [liveCaption, setLiveCaption] = useState("");

  const teardown = useCallback(() => {
    dataChannelRef.current?.close();
    dataChannelRef.current = null;
    pcRef.current?.getSenders().forEach((sender) => sender.track?.stop());
    pcRef.current?.close();
    pcRef.current = null;
    micStreamRef.current?.getTracks().forEach((track) => track.stop());
    micStreamRef.current = null;
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
      remoteAudioRef.current = null;
    }
    setConnected(false);
    setConnecting(false);
    setTalking(false);
    setListening(false);
  }, []);

  const connect = useCallback(async () => {
    if (pcRef.current) return;
    setConnecting(true);
    setError(null);

    try {
      const sessionRes = await fetch("/api/ember/realtime-session", { method: "POST" });
      const sessionData = await sessionRes.json().catch(() => ({}));
      if (!sessionRes.ok || !sessionData.clientSecret) {
        throw new Error(sessionData.error ?? "Could not start a voice session.");
      }
      const clientSecret: string = sessionData.clientSecret;

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      const remoteAudio = new Audio();
      remoteAudio.autoplay = true;
      remoteAudioRef.current = remoteAudio;
      pc.ontrack = (event) => {
        remoteAudio.srcObject = event.streams[0];
      };

      const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = mic;
      mic.getTracks().forEach((track) => pc.addTrack(track, mic));

      const dataChannel = pc.createDataChannel("oai-events");
      dataChannelRef.current = dataChannel;
      dataChannel.addEventListener("message", (event) => {
        let msg: RealtimeServerEvent;
        try {
          msg = JSON.parse(event.data);
        } catch {
          return;
        }

        switch (msg.type) {
          case "input_audio_buffer.speech_started":
            setListening(true);
            break;
          case "input_audio_buffer.speech_stopped":
            setListening(false);
            break;
          case "output_audio_buffer.started":
            setTalking(true);
            break;
          case "output_audio_buffer.stopped":
          case "output_audio_buffer.cleared":
            setTalking(false);
            break;
          case "conversation.item.input_audio_transcription.completed":
            if (msg.transcript) {
              transcriptRef.current.push({ role: "user", content: msg.transcript });
              setLiveCaption(msg.transcript);
            }
            break;
          case "response.output_audio_transcript.done":
            if (msg.transcript) {
              transcriptRef.current.push({ role: "assistant", content: msg.transcript });
              setLiveCaption(msg.transcript);
            }
            break;
          default:
            break;
        }
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch(REALTIME_CALLS_URL, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${clientSecret}`,
          "Content-Type": "application/sdp",
        },
      });

      if (!sdpRes.ok) throw new Error("Could not connect to Ember's voice.");
      const answerSdp = await sdpRes.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      setConnected(true);
      setConnecting(false);
    } catch (err) {
      teardown();
      setError(err instanceof Error ? err.message : "Could not start a voice session.");
    }
  }, [teardown]);

  /** Ends the session and returns everything said, so the caller can fold
   * it into the shared conversation history. */
  const disconnect = useCallback((): RealtimeExchange[] => {
    const transcript = transcriptRef.current;
    transcriptRef.current = [];
    teardown();
    setLiveCaption("");
    setError(null);
    return transcript;
  }, [teardown]);

  /** Types into the same live conversation instead of speaking — she still
   * answers by voice. Works alongside the mic; either one adds to the same
   * conversation. */
  const sendText = useCallback((text: string) => {
    const trimmed = text.trim();
    const dataChannel = dataChannelRef.current;
    if (!trimmed || !dataChannel || dataChannel.readyState !== "open") return;

    dataChannel.send(
      JSON.stringify({
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: trimmed }],
        },
      })
    );
    dataChannel.send(JSON.stringify({ type: "response.create" }));

    transcriptRef.current.push({ role: "user", content: trimmed });
    setLiveCaption(trimmed);
  }, []);

  return { connected, connecting, error, talking, listening, liveCaption, connect, disconnect, sendText };
}
