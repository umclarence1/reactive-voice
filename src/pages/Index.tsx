import React, { useState } from 'react';
import { Volume2, Play, Square } from 'lucide-react';

// Declare ResponsiveVoice global
declare global {
  interface Window {
    responsiveVoice: {
      speak: (text: string, voice?: string, options?: any) => void;
      cancel: () => void;
      isPlaying: () => boolean;
    };
  }
}

const Index = () => {
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

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

    window.responsiveVoice.speak(text, "UK English Female", {
      onend: () => setIsPlaying(false),
      onerror: () => {
        setIsPlaying(false);
        alert("There was an error playing the speech.");
      }
    });
  };

  const handleStop = () => {
    if (window.responsiveVoice) {
      window.responsiveVoice.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl p-8 rounded-2xl shadow-lg border border-gray-700 bg-gray-800/90 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Volume2 className="h-8 w-8 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Text to Speech
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Type text and hear it spoken aloud
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="text-input" className="text-sm font-medium text-gray-200">
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

          <div className="flex gap-4 justify-center">
            {!isPlaying ? (
              <button
                onClick={handleSpeak}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-md text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-300 min-w-32"
              >
                <Play className="h-5 w-5" />
                Speak
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-md text-white font-semibold bg-red-600 hover:bg-red-700 transition-all duration-300 min-w-32"
              >
                <Square className="h-5 w-5" />
                Stop
              </button>
            )}
          </div>

          <div className="text-center text-sm text-gray-400">
            <p>Using UK English Female voice • Powered by ResponsiveVoice</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
