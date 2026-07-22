"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import questionsData from '@/data/questions.json';
import UIOverlay from '@/components/game/UIOverlay';
import PrizeLadder from '@/components/game/PrizeLadder';
import { useSound } from '@/hooks/useSound';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

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
  const [shuffledQuestions, setShuffledQuestions] = useState(questionsData);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  
  const [usedLifelines, setUsedLifelines] = useState<Lifelines>({
    fiftyFifty: false,
    phone: false,
    audience: false
  });

  const { play: playTheme, stop: stopTheme } = useSound('/sounds/theme.mp3', true, 0.05);
  const { play: playWin } = useSound('/sounds/win.mp3', false, 0.5);

  useEffect(() => {
    setShuffledQuestions([...questionsData].sort(() => Math.random() - 0.5));
  }, []);

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

  const currentQuestion = shuffledQuestions[currentLevel - 1] || null;

  const startGame = () => {
    setGameState('playing');
    setCurrentLevel(1);
    setMessage('');
    setUsedLifelines({ fiftyFifty: false, phone: false, audience: false });
    setIsRevealing(false);
    setShowConfetti(false);
    setShuffledQuestions([...questionsData].sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (index: number) => {
    if (!currentQuestion) return;

    if (index === currentQuestion.correctAnswer) {
      if (currentLevel === 15) {
        setGameState('won');
        setMessage('CONGRATULATIONS! You are a TriviaSphere Millionaire! Mint your Golden Badge now!');
        setShowConfetti(true);
        playWin();
        triggerMint(15);
      } else {
        // Proceed to next level
        setCurrentLevel(prev => prev + 1);
        
        // Check for safe haven milestones
        if (currentLevel === 5) {
          setShowConfetti(true);
          playWin();
          setTimeout(() => setShowConfetti(false), 5000);
          triggerMint(5);
        } else if (currentLevel === 10) {
          setShowConfetti(true);
          playWin();
          setTimeout(() => setShowConfetti(false), 5000);
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
    <main className="w-full h-screen relative bg-black overflow-hidden">
      {showConfetti && <Confetti width={width} height={height} recycle={gameState === 'won'} numberOfPieces={300} />}
      
      {/* 3D Background */}
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
