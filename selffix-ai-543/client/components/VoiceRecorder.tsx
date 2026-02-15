import { useState, useRef } from "react";
import { Mic, MicOff, Check } from "lucide-react";

interface VoiceRecorderProps {
  onTranscript: (transcript: string) => void;
}

export function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    // Check browser support
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech Recognition API is not supported in your browser. Please use Chrome, Edge, or Safari."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let interimTranscript = "";

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          setTranscript(
            (prev) => prev + (prev ? " " : "") + transcriptSegment
          );
          onTranscript(transcriptSegment);
        } else {
          interimTranscript += transcriptSegment;
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error !== "no-speech") {
        alert(`Error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const clearTranscript = () => {
    setTranscript("");
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-semibold text-slate-900">
          🎤 Record Voice Description (Optional)
        </label>
        {transcript && (
          <button
            onClick={clearTranscript}
            className="text-xs text-slate-500 hover:text-slate-700"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex gap-3 mb-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Mic className="w-5 h-5" />
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 animate-pulse"
          >
            <MicOff className="w-5 h-5" />
            Stop Recording
          </button>
        )}
      </div>

      {isRecording && (
        <div className="flex items-center gap-2 mb-4 text-red-600">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
          <span className="text-sm font-medium">Recording...</span>
        </div>
      )}

      {transcript && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-blue-700">Transcript:</span>{" "}
            {transcript}
          </p>
        </div>
      )}
    </div>
  );
}
