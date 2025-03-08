
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognition = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef('');
  const listeningTimeoutRef = useRef<number | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      
      // Configure for better accuracy
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'en-US';
      recognition.current.maxAlternatives = 3;
      
      recognition.current.onresult = (event) => {
        let interim = '';
        let final = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            // Get the most likely transcript from alternatives
            const transcript = event.results[i][0].transcript;
            
            // Clean up transcript (remove duplicate words that often occur in speech recognition)
            const cleanedTranscript = cleanTranscript(transcript);
            final += ' ' + cleanedTranscript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        
        // Update the final transcript
        if (final) {
          finalTranscriptRef.current = (finalTranscriptRef.current + final).trim();
          setInputValue(finalTranscriptRef.current);
        }
        
        // Update interim results
        setInterimTranscript(interim);
        
        // Reset the auto-stop timeout when we get new results
        resetListeningTimeout();
      };
      
      recognition.current.onend = () => {
        // If we're still listening (not manually stopped), restart recognition
        if (isListening) {
          recognition.current?.start();
        }
      };
      
      recognition.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast.error("Speech recognition failed. Please try again or use text input.");
      };
    } else {
      toast.error("Your browser doesn't support speech recognition. Please use text input instead.");
    }
    
    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
      
      if (listeningTimeoutRef.current) {
        window.clearTimeout(listeningTimeoutRef.current);
      }
    };
  }, [isListening]);

  // Clean transcript to remove common speech recognition errors
  const cleanTranscript = (transcript: string) => {
    // Remove duplicate adjacent words (e.g., "hi hi how are you" -> "hi how are you")
    const words = transcript.trim().split(' ');
    const uniqueWords = words.filter((word, index) => {
      if (index === 0) return true;
      return word.toLowerCase() !== words[index - 1].toLowerCase();
    });
    
    return uniqueWords.join(' ');
  };

  // Set a timeout to automatically stop listening if no speech is detected
  const resetListeningTimeout = () => {
    if (listeningTimeoutRef.current) {
      window.clearTimeout(listeningTimeoutRef.current);
    }
    
    listeningTimeoutRef.current = window.setTimeout(() => {
      if (isListening && recognition.current) {
        recognition.current.stop();
        setIsListening(false);
        
        // Use the collected transcript as input
        if (finalTranscriptRef.current) {
          setInputValue(finalTranscriptRef.current);
        }
      }
    }, 5000); // Auto-stop after 5 seconds of silence
  };

  const toggleListening = () => {
    if (disabled) return;
    
    if (!recognition.current) {
      toast.error("Speech recognition is not available in your browser.");
      return;
    }
    
    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
      
      // Use the final transcript as input value
      if (finalTranscriptRef.current) {
        setInputValue(finalTranscriptRef.current);
      }
      
      if (listeningTimeoutRef.current) {
        window.clearTimeout(listeningTimeoutRef.current);
        listeningTimeoutRef.current = null;
      }
    } else {
      // Reset the transcripts when starting a new recording
      setInputValue('');
      setInterimTranscript('');
      finalTranscriptRef.current = '';
      
      recognition.current.start();
      setIsListening(true);
      resetListeningTimeout();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (disabled || !inputValue.trim()) return;
    
    onSendMessage(inputValue.trim());
    setInputValue('');
    setInterimTranscript('');
    finalTranscriptRef.current = '';
    
    // Stop listening after sending a message
    if (isListening && recognition.current) {
      recognition.current.stop();
      setIsListening(false);
      
      if (listeningTimeoutRef.current) {
        window.clearTimeout(listeningTimeoutRef.current);
        listeningTimeoutRef.current = null;
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <Button
        type="button"
        variant={isListening ? "default" : "outline"}
        size="icon"
        onClick={toggleListening}
        className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
        disabled={disabled}
        title={isListening ? "Stop listening" : "Start voice input"}
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
      
      <Input
        placeholder={
          disabled ? "AI is thinking..." : 
          isListening ? `Listening... ${interimTranscript}` : 
          "Type your message..."
        }
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="flex-1"
        disabled={disabled}
      />
      
      <Button
        type="submit"
        size="icon"
        disabled={disabled || !inputValue.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;
