import React, { useEffect, useRef, useState } from 'react';
import { Circle, Square } from 'lucide-react';

export default function Recorder({ onTranscript, onSpeakingChange }) {
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [permissionError, setPermissionError] = useState('');

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        // Basic browser SpeechRecognition fallback (Chrome only)
        try {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (SpeechRecognition) {
            const rec = new SpeechRecognition();
            rec.lang = 'en-US';
            rec.onresult = (event) => {
              const text = event.results[0][0].transcript;
              onTranscript?.(text, url);
            };
            rec.onerror = () => onTranscript?.('', url);
            rec.start();
          } else {
            onTranscript?.('', url);
          }
        } catch {
          onTranscript?.('', url);
        }
      };

      recorder.start();
      setIsRecording(true);
      onSpeakingChange?.(true);
    } catch (err) {
      console.error(err);
      setPermissionError('Microphone permission is required to record.');
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    if (mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    setIsRecording(false);
    onSpeakingChange?.(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {permissionError && (
        <p className="text-sm text-rose-600 max-w-sm text-center">{permissionError}</p>
      )}
      {!isRecording ? (
        <button
          onClick={startRecording}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-purple-600 text-white shadow-lg shadow-purple-600/30 hover:bg-purple-700 transition"
        >
          <Circle size={18} /> Start talking
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition"
        >
          <Square size={18} /> Stop
        </button>
      )}
    </div>
  );
}
