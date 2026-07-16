"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fetches and plays Ember's voice for `text` whenever it changes, as long
 * as `enabled` is true — the first half of voice chat (hearing her; talking
 * to her comes later). Manages its own in-memory Audio instance, so nothing
 * needs to be rendered for this to work.
 */
export function useEmberSpeech(
  text: string,
  enabled: boolean
): { speaking: boolean; blocked: boolean; retry: () => void } {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);

  const [key, setKey] = useState({ text, enabled });
  const [speaking, setSpeaking] = useState(false);
  const [blocked, setBlocked] = useState(false);

  if (key.text !== text || key.enabled !== enabled) {
    setKey({ text, enabled });
    setSpeaking(false);
    setBlocked(false);
  }

  function releaseUrl() {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  }

  useEffect(() => {
    audioRef.current?.pause();
    if (!text || !enabled) return;

    let cancelled = false;

    fetch("/api/ember/speech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ember's voice isn't available right now.");
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        releaseUrl();
        const url = URL.createObjectURL(blob);
        urlRef.current = url;

        const audio = new Audio(url);
        audioRef.current = audio;
        audio.addEventListener("play", () => setSpeaking(true));
        audio.addEventListener("ended", () => setSpeaking(false));
        audio.addEventListener("pause", () => setSpeaking(false));
        audio.addEventListener("error", () => setSpeaking(false));
        return audio.play();
      })
      .catch(() => {
        if (!cancelled) setBlocked(true);
      });

    return () => {
      cancelled = true;
    };
  }, [text, enabled]);

  // Release the last object URL and stop playback on unmount.
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      releaseUrl();
    };
  }, []);

  function retry() {
    setBlocked(false);
    audioRef.current?.play().catch(() => setBlocked(true));
  }

  return { speaking, blocked, retry };
}
