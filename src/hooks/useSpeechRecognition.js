import { useCallback, useEffect, useRef, useState } from "react";
import { sendSpeechTranscript } from "../lib/api";

const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

/**
 * Wraps the browser's SpeechRecognition API (speech-to-text) and, on every
 * finalized chunk, forwards the transcript to the backend via
 * lib/api.js#sendSpeechTranscript (which itself falls back gracefully if
 * the backend isn't reachable yet — same pattern as the rest of lib/api.js).
 *
 * Usage:
 *   const {
 *     isSupported, isListening, transcript, interimTranscript,
 *     start, stop, reset, error,
 *   } = useSpeechRecognition({ sessionId, continuous: true });
 */
export default function useSpeechRecognition({
  sessionId,
  continuous = true,
  interimResults = true,
  lang = "en-US",
  onFinalChunk, // optional callback(text) fired whenever a chunk finalizes
} = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const transcriptRef = useRef(""); // mirrors `transcript` for closures

  const isSupported = Boolean(SpeechRecognitionAPI);

  useEffect(() => {
    if (!isSupported) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = lang;

    recognition.onresult = (event) => {
      let finalChunk = "";
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) {
          finalChunk += text + " ";
        } else {
          interim += text;
        }
      }

      if (finalChunk) {
        const updated = (transcriptRef.current + " " + finalChunk).trim();
        transcriptRef.current = updated;
        setTranscript(updated);
        setInterimTranscript("");

        // Send the finalized chunk to the backend (speech-to-text sync).
        sendSpeechTranscript({ sessionId, transcript: finalChunk.trim(), isFinal: true });
        onFinalChunk?.(finalChunk.trim());
      } else {
        setInterimTranscript(interim);
      }
    };

    recognition.onerror = (event) => {
      setError(event.error || "speech-recognition-error");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.stop();
      } catch {
        /* no-op */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupported, continuous, interimResults, lang]);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    setError(null);
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      // start() throws if already started — safe to ignore.
    }
  }, []);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsListening(false);
  }, []);

  const reset = useCallback(() => {
    transcriptRef.current = "";
    setTranscript("");
    setInterimTranscript("");
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    start,
    stop,
    reset,
    error,
  };
}
