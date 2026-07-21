import React, { useState, useEffect } from 'react';
import { Phone, Users, HelpCircle } from 'lucide-react';
import { useSound } from '@/hooks/useSound';
interface Question {
  id: number;
  level: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface UIOverlayProps {
  currentQuestion: Question | null;
  onAnswerSubmit: (index: number) => void;
  gameState: 'start' | 'playing' | 'gameover' | 'won';
  onStart: () => void;
  message: string;
}

export default function UIOverlay({ currentQuestion, onAnswerSubmit, gameState, onStart, message }: UIOverlayProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);

  const { play: playSuspense, stop: stopSuspense } = useSound('/sounds/suspense.mp3');
  const { play: playCorrect } = useSound('/sounds/correct.mp3');
  const { play: playWrong } = useSound('/sounds/wrong.mp3');

  // Reset local state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setIsRevealing(false);
  }, [currentQuestion]);

  const handleSelect = (index: number) => {
    if (selectedAnswer !== null || isRevealing) return;
    setSelectedAnswer(index);
    playSuspense();
    
    // Simulate suspense
    setTimeout(() => {
      setIsRevealing(true);
      stopSuspense();
      
      if (currentQuestion && index === currentQuestion.correctAnswer) {
        playCorrect();
      } else {
        playWrong();
      }

      setTimeout(() => {
        onAnswerSubmit(index);
      }, 2000); // 2 second delay to show right/wrong
    }, 1500); // 1.5 seconds of "Is that your final answer?"
  };

  if (gameState === 'gameover' || gameState === 'won') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 bg-black/80 backdrop-blur-sm">
        <h2 className={`text-5xl font-bold mb-4 ${gameState === 'won' ? 'text-green-400' : 'text-red-500'}`}>
          {gameState === 'won' ? 'YOU WON!' : 'GAME OVER'}
        </h2>
        <p className="text-2xl text-white mb-8 text-center max-w-xl">{message}</p>
        <button 
          onClick={onStart}
          className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
        >
          PLAY AGAIN
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="absolute inset-x-0 bottom-0 top-auto z-10 flex flex-col items-center p-4 md:p-8 pb-12">
      
      {/* Lifelines */}
      <div className="flex gap-4 mb-6">
        <button className="p-3 bg-blue-900/50 border border-blue-500 rounded-full hover:bg-blue-800/80 transition text-white">
          <HelpCircle size={24} />
        </button>
        <button className="p-3 bg-blue-900/50 border border-blue-500 rounded-full hover:bg-blue-800/80 transition text-white">
          <Phone size={24} />
        </button>
        <button className="p-3 bg-blue-900/50 border border-blue-500 rounded-full hover:bg-blue-800/80 transition text-white">
          <Users size={24} />
        </button>
      </div>

      {/* Question Box */}
      <div className="w-full max-w-4xl bg-gradient-to-b from-blue-900/80 to-black/90 border-2 border-blue-500/50 rounded-xl p-6 md:p-8 text-center mb-4 shadow-[0_0_30px_rgba(59,130,246,0.3)] backdrop-blur-md">
        <h2 className="text-xl md:text-2xl text-white font-semibold">
          {currentQuestion.question}
        </h2>
      </div>

      {/* Answers Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.options.map((option, index) => {
          let btnClass = "border-blue-500/50 bg-blue-900/40 hover:bg-blue-800/60 text-white";
          
          if (selectedAnswer === index) {
            btnClass = "border-yellow-400 bg-yellow-500/40 text-white"; // Selected state
          }
          
          if (isRevealing) {
            if (index === currentQuestion.correctAnswer) {
              btnClass = "border-green-400 bg-green-500/60 text-white shadow-[0_0_20px_rgba(74,222,128,0.5)]"; // Correct
            } else if (selectedAnswer === index) {
              btnClass = "border-red-500 bg-red-600/60 text-white"; // Wrong
            } else {
              btnClass = "border-gray-600 bg-gray-800/40 text-gray-400 opacity-50"; // Not selected, wrong
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={selectedAnswer !== null}
              className={`relative border-2 rounded-full py-4 px-6 text-left transition-all duration-300 backdrop-blur-sm group ${btnClass}`}
            >
              <span className="text-orange-400 font-bold mr-4 group-hover:text-orange-300">
                {String.fromCharCode(65 + index)}:
              </span>
              <span className="text-lg md:text-xl font-medium">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
