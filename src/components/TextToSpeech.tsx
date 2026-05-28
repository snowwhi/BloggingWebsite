import { useState, useCallback, useRef, useEffect } from "react";
import { Volume2, VolumeX, Pause, Play, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TextToSpeechProps {
  text: string;
  contentRef?: React.RefObject<HTMLDivElement | null>;
}

const TextToSpeech = ({ text }: TextToSpeechProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  // ✅ FIX 2 — interval ref to beat the Chrome 15-second cut-off bug
  const resumeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearResumeInterval = () => {
    if (resumeIntervalRef.current) {
      clearInterval(resumeIntervalRef.current);
      resumeIntervalRef.current = null;
    }
  };

  // ✅ FIX 1 — load voices eagerly on mount so they are ready before user clicks
  useEffect(() => {
    const load = () => window.speechSynthesis.getVoices();
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.cancel();
      clearResumeInterval();
    };
  }, []);

  const doSpeak = useCallback(() => {
    if (!text) return;
    window.speechSynthesis.cancel();
    clearResumeInterval();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((v) => v.lang.startsWith("en"));
    // ✅ FIX 1 continued — never assign null, only assign if a voice exists
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onboundary = (event) => {
      setProgress((event.charIndex / text.length) * 100);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setIsLoading(false);
      setProgress(0);
      clearResumeInterval();
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setIsLoading(false);
      setProgress(0);
      clearResumeInterval();
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
    setIsLoading(false);

    // ✅ FIX 2 — Chrome desktop silently stops TTS after ~15 seconds
    // This interval nudges it every 14 seconds to keep it alive
    resumeIntervalRef.current = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearResumeInterval();
        return;
      }
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }, 14000);
  }, [text]);

  const startSpeaking = useCallback(() => {
    if (!text) return;
    setIsLoading(true);
    // Small timeout gives browser a moment to confirm user gesture
    // while keeping the gesture context alive
    setTimeout(() => doSpeak(), 50);
  }, [text, doSpeak]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setIsLoading(false);
    setProgress(0);
    clearResumeInterval();
  }, []);

  const togglePause = useCallback(() => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isPaused]);

  return (
    <div className="flex items-center gap-2">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.button
            key="loading"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={stopSpeaking}
            className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-95"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </motion.button>
        ) : !isSpeaking ? (
          <motion.button
            key="play"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={startSpeaking}
            className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-95"
          >
            <Volume2 className="h-4 w-4" />
            Listen
          </motion.button>
        ) : (
          <motion.div
            key="controls"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-1"
          >
            <button
              onClick={togglePause}
              className="rounded-full bg-secondary p-2 text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
            <button
              onClick={stopSpeaking}
              className="rounded-full bg-destructive/10 p-2 text-destructive transition-colors hover:bg-destructive/20"
            >
              <VolumeX className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {isSpeaking && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 80, opacity: 1 }}
          className="h-1.5 rounded-full bg-secondary overflow-hidden"
        >
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
      )}

      {isSpeaking && (
        <motion.div
          className="flex items-center gap-0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-0.5 rounded-full bg-primary"
              animate={{ height: isPaused ? 8 : [8, 16, 8] }}
              transition={{ duration: 0.5, repeat: isPaused ? 0 : Infinity, delay: i * 0.1 }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default TextToSpeech;