import React, { useState, useEffect } from "react";
import { Volume2, Play, Square, Settings, Pause } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";

// Declare ResponsiveVoice global
declare global {
  interface Window {
    responsiveVoice: {
      speak: (text: string, voice?: string, options?: any) => void;
      cancel: () => void;
      isPlaying: () => boolean;
      pause: () => void;
      resume: () => void;
      getVoices: () => any[];
      setDefaultVoice: (voice: string) => void;
      setDefaultRate: (rate: number) => void;
    };
  }
}

const Index = () => {
  const [text, setText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("UK English Female");
  const [voices, setVoices] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  // Voice settings
  const [rate, setRate] = useState([1]);
  const [pitch, setPitch] = useState([1]);
  const [volume, setVolume] = useState([1]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      if (window.responsiveVoice && window.responsiveVoice.getVoices) {
        const availableVoices = window.responsiveVoice.getVoices();
        setVoices(availableVoices.map((voice: any) => voice.name));
      }
    };

    loadVoices();
    const timer = setTimeout(loadVoices, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSpeak = () => {
    if (!text.trim()) {
      alert("Please enter some text to pronounce.");
      return;
    }

    if (!window.responsiveVoice) {
      alert("Speech service not available. Please refresh the page.");
      return;
    }

    setIsPlaying(true);
    setIsPaused(false);

    window.responsiveVoice.speak(text, selectedVoice, {
      rate: rate[0],
      pitch: pitch[0],
      volume: volume[0],
      onend: () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
      onerror: () => {
        setIsPlaying(false);
        setIsPaused(false);
        alert("There was an error playing the speech.");
      },
    });
  };

  const handleStop = () => {
    if (window.responsiveVoice) {
      window.responsiveVoice.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const handlePause = () => {
    if (window.responsiveVoice && window.responsiveVoice.pause) {
      window.responsiveVoice.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleResume = () => {
    if (window.responsiveVoice && window.responsiveVoice.resume) {
      window.responsiveVoice.resume();
      setIsPaused(false);
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl p-8 rounded-2xl shadow-lg border border-gray-700 bg-gray-800/90 backdrop-blur-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Volume2 className="h-8 w-8 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Text to Speech
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Advanced text-to-speech with voice selection and settings
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setShowSettings(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              !showSettings
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <Volume2 className="h-4 w-4" />
            Quick Speech
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              showSettings
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>

        {/* Voice Selection */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-200 mb-2 block">
            Select Voice:
          </label>
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger className="w-full bg-gray-900 border-gray-600 text-gray-100">
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-600">
              {voices.length > 0 ? (
                voices.map((voice) => (
                  <SelectItem
                    key={voice}
                    value={voice}
                    className="text-gray-100 focus:bg-gray-700"
                  >
                    {voice}
                  </SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="UK English Female">
                    UK English Female
                  </SelectItem>
                  <SelectItem value="UK English Male">
                    UK English Male
                  </SelectItem>
                  <SelectItem value="US English Female">
                    US English Female
                  </SelectItem>
                  <SelectItem value="US English Male">
                    US English Male
                  </SelectItem>
                  <SelectItem value="Australian Female">
                    Australian Female
                  </SelectItem>
                  <SelectItem value="French Female">French Female</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-6 p-6 rounded-lg bg-gray-900/50 border border-gray-600">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">
              Voice Settings
            </h3>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-200 mb-2 block">
                  Speed: {rate[0].toFixed(1)}x
                </label>
                <Slider
                  value={rate}
                  onValueChange={setRate}
                  max={1.5}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-200 mb-2 block">
                  Pitch: {pitch[0].toFixed(1)}
                </label>
                <Slider
                  value={pitch}
                  onValueChange={setPitch}
                  max={2}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-200 mb-2 block">
                  Volume: {Math.round(volume[0] * 100)}%
                </label>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Quick Speech Mode */}
        {!showSettings && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="text-input"
                className="text-sm font-medium text-gray-200"
              >
                Enter text to pronounce:
              </label>
              <textarea
                id="text-input"
                placeholder="Type your text here... For example: Hello, how are you today?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full min-h-32 p-3 rounded-md text-lg resize-none border-2 border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-400/40 bg-gray-900 text-gray-100 transition-colors"
              />
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              {!isPlaying && !isPaused ? (
                <button
                  onClick={handleSpeak}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-md text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-300 min-w-32"
                >
                  <Play className="h-5 w-5" />
                  Speak
                </button>
              ) : isPaused ? (
                <button
                  onClick={handleResume}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-md text-white font-semibold bg-green-600 hover:bg-green-700 transition-all duration-300 min-w-32"
                >
                  <Play className="h-5 w-5" />
                  Resume
                </button>
              ) : (
                <>
                  <button
                    onClick={handlePause}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-md text-white font-semibold bg-yellow-600 hover:bg-yellow-700 transition-all duration-300"
                  >
                    <Pause className="h-5 w-5" />
                    Pause
                  </button>
                  <button
                    onClick={handleStop}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-md text-white font-semibold bg-red-600 hover:bg-red-700 transition-all duration-300"
                  >
                    <Square className="h-5 w-5" />
                    Stop
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-400 mt-8">
          <p>Using {selectedVoice}</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
