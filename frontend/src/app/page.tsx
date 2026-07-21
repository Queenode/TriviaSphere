"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import questionsData from '@/data/questions.json';
import UIOverlay from '@/components/game/UIOverlay';
import PrizeLadder from '@/components/game/PrizeLadder';

// Dynamically import Scene so it only renders on client
const Scene = dynamic(() => import('@/components/game/Scene'), { ssr: false });

type GameState = 'start' | 'playing' | 'gameover' | 'won';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [message, setMessage] = useState('');

  const currentQuestion = questionsData.find(q => q.level === currentLevel) || null;

  const startGame = () => {
    setGameState('playing');
    setCurrentLevel(1);
    setMessage('');
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
    // Example: alert(`Milestone reached! Minting Level ${level} Badge...`);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans">
      <Scene />
      
      <UIOverlay 
        currentQuestion={currentQuestion}
        onAnswerSubmit={handleAnswer}
        gameState={gameState}
        onStart={startGame}
        message={message}
      />

      {gameState === 'playing' && (
        <PrizeLadder currentLevel={currentLevel} />
      )}
    </main>
  );
}
