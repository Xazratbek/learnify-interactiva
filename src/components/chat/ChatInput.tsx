
import React, { useState, useRef } from 'react';
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

  // Initialize speech recognition
  React.useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      
      // Configure for better accuracy
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'en-US';
      recognition.current.maxAlternatives = 1;
      
      recognition.current.onresult = (event) => {
        let interim = '';
        let final = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        
        // Update the final transcript
        if (final) {
          finalTranscriptRef.current += ' ' + final;
          finalTranscriptRef.current = finalTranscriptRef.current.trim();
          setInputValue(finalTranscriptRef.current);
        }
        
        // Update interim results
        setInterimTranscript(interim);
      };
      
      recognition.current.onend = () => {
        // If we're still listening, restart recognition
        // This helps with longer dictations
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
    };
  }, [isListening]);

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
    } else {
      // Reset the transcripts when starting a new recording
      setInputValue('');
      setInterimTranscript('');
      finalTranscriptRef.current = '';
      
      recognition.current.start();
      setIsListening(true);
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
