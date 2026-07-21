"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import questionsData from '@/data/questions.json';
import UIOverlay from '@/components/game/UIOverlay';
import PrizeLadder from '@/components/game/PrizeLadder';
import { useSound } from '@/hooks/useSound';

// Dynamically import Scene so it only renders on client
const Scene = dynamic(() => import('@/components/game/Scene'), { ssr: false });

type GameState = 'start' | 'playing' | 'gameover' | 'won';

export type Lifelines = {
  fiftyFifty: boolean;
  phone: boolean;
  audience: boolean;
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('playing');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [message, setMessage] = useState('');
  const [isRevealing, setIsRevealing] = useState(false);
  
  const [usedLifelines, setUsedLifelines] = useState<Lifelines>({
    fiftyFifty: false,
    phone: false,
    audience: false
  });

  const { play: playTheme, stop: stopTheme } = useSound('/sounds/theme.mp3', true);
  const { play: playWin } = useSound('/sounds/win.mp3');

  useEffect(() => {
    if (gameState === 'playing') {
      playTheme();
    } else {
      stopTheme();
      if (gameState === 'won') {
        playWin();
      }
    }
  }, [gameState, playTheme, stopTheme, playWin]);

  const currentQuestion = questionsData.find(q => q.level === currentLevel) || null;

  const startGame = () => {
    setGameState('playing');
    setCurrentLevel(1);
    setMessage('');
    setUsedLifelines({ fiftyFifty: false, phone: false, audience: false });
    setIsRevealing(false);
  };

  const handleAnswer = (index: number) => {
    if (!currentQuestion) return;

    if (index === currentQuestion.correctAnswer) {
      if (currentLevel === 15) {
        setGameState('won');
        setMessage('CONGRATULATIONS! You are a TriviaSphere Millionaire! Mint your Golden Badge now!');
        triggerMint(15);
      } else {
        // Proceed to next level
        setCurrentLevel(prev => prev + 1);
        
        // Check for safe haven milestones
        if (currentLevel === 5) {
          triggerMint(5);
        } else if (currentLevel === 10) {
          triggerMint(10);
        }
      }
    } else {
      setGameState('gameover');
      setMessage(`Incorrect! The right answer was ${currentQuestion.options[currentQuestion.correctAnswer]}.`);
    }
  };

  const triggerMint = (level: number) => {
    // In a full Web3 integration, this would pop up the wallet to mint the badge
    console.log(`Triggering mint for level ${level} milestone badge!`);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans">
      <Scene isRevealing={isRevealing} />
      
      <UIOverlay 
        currentQuestion={currentQuestion}
        onAnswerSubmit={handleAnswer}
        gameState={gameState}
        onStart={startGame}
        message={message}
        usedLifelines={usedLifelines}
        setUsedLifelines={setUsedLifelines}
        isRevealing={isRevealing}
        setIsRevealing={setIsRevealing}
      />

      {gameState === 'playing' && (
        <PrizeLadder currentLevel={currentLevel} />
      )}
    </main>
  );
}
