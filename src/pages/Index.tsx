import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Volume2, Play, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const handleSpeak = () => {
    if (!text.trim()) {
      toast({
        title: "Please enter some text",
        description: "Type something you want to hear pronounced.",
        variant: "destructive"
      });
      return;
    }

    if (!window.responsiveVoice) {
      toast({
        title: "Speech service not available",
        description: "Please refresh the page and try again.",
        variant: "destructive"
      });
      return;
    }

    setIsPlaying(true);
    
    window.responsiveVoice.speak(text, "UK English Female", {
      onend: () => setIsPlaying(false),
      onerror: () => {
        setIsPlaying(false);
        toast({
          title: "Speech failed",
          description: "There was an error playing the speech.",
          variant: "destructive"
        });
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 shadow-soft border-0 bg-card/80 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Volume2 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Text to Speech
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Simple pronunciation helper - Type text and hear it spoken aloud
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="text-input" className="text-sm font-medium text-foreground">
              Enter text to pronounce:
            </label>
            <Textarea
              id="text-input"
              placeholder="Type your text here... For example: Hello, how are you today?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-32 text-lg resize-none border-2 focus:border-primary transition-colors"
            />
          </div>

          <div className="flex gap-4 justify-center">
            {!isPlaying ? (
              <Button 
                onClick={handleSpeak}
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300 min-w-32"
              >
                <Play className="h-5 w-5 mr-2" />
                Speak
              </Button>
            ) : (
              <Button 
                onClick={handleStop}
                size="lg"
                variant="destructive"
                className="min-w-32"
              >
                <Square className="h-5 w-5 mr-2" />
                Stop
              </Button>
            )}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Using UK English Female voice • Powered by ResponsiveVoice</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Index;