import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, MicOff, Trash2, AlertCircle, RefreshCcw } from "lucide-react";

interface VoiceRecorderProps {
  onTranscript: (transcript: string) => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type RecorderStatus = "idle" | "starting" | "listening" | "error";

export function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  // Initialize recognition object
  const initRecognition = useCallback(() => {
    if (recognitionRef.current) return recognitionRef.current;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("VoiceRecorder: Started");
      setStatus("listening");
      setErrorMessage("");
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        console.log("VoiceRecorder: Result", finalTranscript);
        setTranscript((prev) => prev + (prev ? " " : "") + finalTranscript);
        onTranscript(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("VoiceRecorder: Error", event.error);

      if (event.error === 'not-allowed') {
        setStatus("error");
        setErrorMessage("Microphone access denied. Please allow it in browser settings.");
      } else if (event.error === 'network') {
        setStatus("error");
        setErrorMessage("Network error occurred.");
      } else if (event.error === 'no-speech') {
        // Just go back to idle if no speech
        setStatus("idle");
      } else {
        setStatus("error");
        setErrorMessage(`Error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      console.log("VoiceRecorder: Ended");
      setStatus("idle");
    };

    recognitionRef.current = recognition;
    return recognition;
  }, [onTranscript]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) { }
      }
    };
  }, []);

  const startRecording = () => {
    const recognition = initRecognition();
    if (!recognition) return;

    try {
      setStatus("starting");
      recognition.start();
    } catch (err) {
      console.error("VoiceRecorder: Start failed", err);
      // If it's already running, stop it and try again
      try {
        recognition.stop();
        setTimeout(() => recognition.start(), 200);
      } catch (e) {
        setStatus("error");
        setErrorMessage("Failed to start recorder. Please refresh.");
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const reset = () => {
    stopRecording();
    setTranscript("");
    setErrorMessage("");
    setStatus("idle");
  };

  const isSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  if (!isSupported) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-800">
        <div className="flex items-center gap-2 mb-2 font-bold">
          <AlertCircle className="w-5 h-5" />
          Voice Input Not Supported
        </div>
        <p className="text-sm">
          Please use <strong>Google Chrome</strong> or <strong>Safari</strong> for voice features.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-semibold text-slate-900">
          🎤 Voice Diagnosis
        </label>
        <button
          onClick={reset}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          <RefreshCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      <div className="space-y-4">
        <button
          onClick={status === "listening" ? stopRecording : startRecording}
          disabled={status === "starting"}
          className={`w-full py-4 font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-3 ${status === "listening"
              ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
              : status === "starting"
                ? "bg-slate-200 text-slate-500 cursor-wait"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            }`}
        >
          {status === "listening" ? (
            <>
              <MicOff className="w-5 h-5" />
              Stop Listening
            </>
          ) : status === "starting" ? (
            <>
              <RefreshCcw className="w-5 h-5 animate-spin" />
              Initializing...
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              Start Voice Input
            </>
          )}
        </button>

        {status === "listening" && (
          <div className="flex items-center justify-center gap-2 text-red-600 bg-red-50 py-2 rounded-lg border border-red-100 italic">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="text-sm font-medium">Listening... Describe your problem</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-bold">Microphone Error</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {transcript && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                Transcribed Log
              </span>
              <button
                onClick={() => setTranscript("")}
                className="text-slate-300 hover:text-red-500 transition-colors"
                title="Clear"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed italic">
              "{transcript}"
            </p>
            <p className="text-[10px] text-green-600 mt-2 font-medium">
              ✓ Successfully added to description
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
