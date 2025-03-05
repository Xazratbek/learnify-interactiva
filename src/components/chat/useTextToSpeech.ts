
import { useState, useRef, useEffect } from 'react';

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const synth = useRef(window.speechSynthesis);

  useEffect(() => {
    return () => {
      // Cancel any ongoing speech when component unmounts
      synth.current.cancel();
    };
  }, []);

  const speak = (text: string) => {
    if (isMuted) return;
    
    // Cancel any ongoing speech
    synth.current.cancel();
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    
    // Use a voice that sounds good (optional)
    const voices = synth.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || voice.name.includes('Female') || voice.name.includes('UK')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    // Speak the text
    synth.current.speak(utterance);
  };

  const toggleMute = () => {
    if (isSpeaking && !isMuted) {
      synth.current.cancel();
      setIsSpeaking(false);
    }
    setIsMuted(!isMuted);
  };

  return {
    isSpeaking,
    isMuted,
    speak,
    toggleMute
  };
}
