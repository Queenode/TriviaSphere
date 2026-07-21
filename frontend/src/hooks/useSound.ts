import { useRef, useEffect, useCallback } from 'react';

export function useSound(url: string, loop: boolean = false, volume: number = 1.0) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(url);
      audioRef.current.loop = loop;
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [url, loop, volume]);

  const play = useCallback(() => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => {
          console.warn(`Audio play failed for ${url}`, e);
        });
      }
    }
  }, [url]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { play, stop };
}
