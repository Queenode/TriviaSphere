import React, { useState, useEffect } from 'react';
import { Phone, Users, HelpCircle } from 'lucide-react';
import { useSound } from '@/hooks/useSound';
import { Lifelines } from '@/app/play/page';

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
  gameState: 'start' | 'playing' | 'gameover' | 'won' | 'milestone';
  onStart: () => void;
  message: string;
  usedLifelines: Lifelines;
  setUsedLifelines: React.Dispatch<React.SetStateAction<Lifelines>>;
  isRevealing: boolean;
  setIsRevealing: (val: boolean) => void;
}

export default function UIOverlay({ 
  currentQuestion, 
  onAnswerSubmit, 
  gameState, 
  onStart, 
  message,
  usedLifelines,
  setUsedLifelines,
  isRevealing,
  setIsRevealing
}: UIOverlayProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  
  // Lifeline modals
  const [audiencePoll, setAudiencePoll] = useState<number[] | null>(null);
  const [friendAdvice, setFriendAdvice] = useState<string | null>(null);

  const { play: playSuspense, stop: stopSuspense } = useSound('/sounds/suspense.mp3', false, 0.3);
  const { play: playCorrect } = useSound('/sounds/correct.mp3', false, 0.3);
  const { play: playWrong } = useSound('/sounds/wrong.mp3', false, 0.3);

  // Reset local state when question changes and read question aloud
  useEffect(() => {
    setSelectedAnswer(null);
    setIsRevealing(false);
    setHiddenOptions([]);
    setAudiencePoll(null);
    setFriendAdvice(null);

    // Text to speech host voice
    if (currentQuestion && gameState === 'playing' && typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
      utterance.pitch = 0.5; // Deeper voice
      utterance.rate = 0.9; // Slightly slower for suspense
      
      const voices = window.speechSynthesis.getVoices();
      const maleVoice = voices.find(v => v.name.toLowerCase().includes('male') || v.name.includes('UK'));
      if (maleVoice) utterance.voice = maleVoice;
      
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if (typeof window !== 'undefined') window.speechSynthesis.cancel();
    }
  }, [currentQuestion, gameState, setIsRevealing]);

  const handleSelect = (index: number) => {
    if (selectedAnswer !== null || isRevealing) return;
    setSelectedAnswer(index);
    playSuspense();
    if (typeof window !== 'undefined') window.speechSynthesis.cancel(); // Stop talking when locked in
    
    // Simulate suspense
    setTimeout(() => {
      setIsRevealing(true);
      stopSuspense();
      
      const speakResult = (text: string) => {
        if (typeof window !== 'undefined') {
          const u = new SpeechSynthesisUtterance(text);
          u.pitch = 0.5;
          u.rate = 0.9;
          const voices = window.speechSynthesis.getVoices();
          const maleVoice = voices.find(v => v.name.toLowerCase().includes('male') || v.name.includes('UK'));
          if (maleVoice) u.voice = maleVoice;
          window.speechSynthesis.speak(u);
        }
      };

      if (currentQuestion && index === currentQuestion.correctAnswer) {
        playCorrect();
        speakResult("Correct!");
      } else {
        playWrong();
        speakResult("I am sorry, but that is incorrect.");
      }

      setTimeout(() => {
        onAnswerSubmit(index);
      }, 3000); // 3 second delay to show right/wrong and let sound play
    }, 2000); // 2 seconds of "Is that your final answer?"
  };

  const useFiftyFifty = () => {
    if (usedLifelines.fiftyFifty || !currentQuestion) return;
    const wrongIndices = [0, 1, 2, 3].filter(i => i !== currentQuestion.correctAnswer);
    // Shuffle and pick 2
    const toHide = wrongIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
    setHiddenOptions(toHide);
    setUsedLifelines(prev => ({ ...prev, fiftyFifty: true }));
  };

  const useAudience = () => {
    if (usedLifelines.audience || !currentQuestion) return;
    
    // Generate fake poll favoring the correct answer
    const poll = [0, 0, 0, 0];
    let remaining = 100;
    
    // Correct gets between 40-70%
    const correctPercent = Math.floor(Math.random() * 30) + 40;
    poll[currentQuestion.correctAnswer] = correctPercent;
    remaining -= correctPercent;

    // Distribute rest
    const wrongIndices = [0, 1, 2, 3].filter(i => i !== currentQuestion.correctAnswer);
    wrongIndices.forEach((index, i) => {
      if (i === 2) {
        poll[index] = remaining; // Last one gets the rest
      } else {
        const share = Math.floor(Math.random() * remaining);
        poll[index] = share;
        remaining -= share;
      }
    });

    setAudiencePoll(poll);
    setUsedLifelines(prev => ({ ...prev, audience: true }));
  };

  const usePhone = () => {
    if (usedLifelines.phone || !currentQuestion) return;
    const letters = ['A', 'B', 'C', 'D'];
    const correctLetter = letters[currentQuestion.correctAnswer];
    setFriendAdvice(`"Hello! I'm pretty sure the answer is ${correctLetter}, but I could be wrong!"`);
    setUsedLifelines(prev => ({ ...prev, phone: true }));
  };

  if (gameState === 'gameover' || gameState === 'won') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-4 bg-black/80 backdrop-blur-sm">
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

  if (gameState === 'milestone') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-500">
        <div className="bg-gradient-to-b from-blue-900/90 to-black/90 p-12 rounded-3xl border-4 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.5)] flex flex-col items-center transform scale-110">
          <h2 className="text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">
            MILESTONE REACHED!
          </h2>
          <p className="text-3xl text-white font-bold text-center animate-pulse">
            Safe Haven Secured! 🎉
          </p>
          <p className="text-xl text-blue-200 mt-6 text-center">
            Minting your Soulbound Badge...
          </p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <>
    {/* Lifelines - positioned above the Rewards card on the right */}
    <div className="absolute right-4 top-4 z-20 flex flex-row gap-3">
      <button 
        disabled={usedLifelines.fiftyFifty}
        onClick={useFiftyFifty}
        title="50:50 — Remove two wrong answers"
        className={`p-3 border rounded-full transition ${usedLifelines.fiftyFifty ? 'bg-gray-800 border-gray-600 text-gray-600' : 'bg-blue-900/50 border-blue-500 hover:bg-blue-800/80 text-white'}`}
      >
        <span className="font-bold">50:50</span>
      </button>
      <button 
        disabled={usedLifelines.phone}
        onClick={usePhone}
        title="Phone a Friend — Get a hint from a friend"
        className={`p-3 border rounded-full transition ${usedLifelines.phone ? 'bg-gray-800 border-gray-600 text-gray-600' : 'bg-blue-900/50 border-blue-500 hover:bg-blue-800/80 text-white'}`}
      >
        <Phone size={24} />
      </button>
      <button 
        disabled={usedLifelines.audience}
        onClick={useAudience}
        title="Ask the Audience — See what the audience thinks"
        className={`p-3 border rounded-full transition ${usedLifelines.audience ? 'bg-gray-800 border-gray-600 text-gray-600' : 'bg-blue-900/50 border-blue-500 hover:bg-blue-800/80 text-white'}`}
      >
        <Users size={24} />
      </button>
    </div>

    <div className="absolute inset-x-0 bottom-0 top-auto z-20 flex flex-col items-center p-4 md:p-8 pb-12">
      
      {/* Modals for Lifelines */}
      {audiencePoll && (
        <div className="absolute bottom-full mb-8 bg-blue-900/90 border-2 border-blue-400 p-6 rounded-xl flex items-end gap-4 h-48">
          {audiencePoll.map((percent, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <span className="text-white text-sm font-bold">{percent}%</span>
              <div className="w-12 bg-blue-500 rounded-t-md transition-all duration-1000" style={{ height: `${percent}%` }}></div>
              <span className="text-orange-400 font-bold">{String.fromCharCode(65 + idx)}</span>
            </div>
          ))}
          <button onClick={() => setAudiencePoll(null)} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 font-bold">X</button>
        </div>
      )}

      {friendAdvice && (
        <div className="absolute bottom-full mb-8 bg-blue-900/90 border-2 border-blue-400 p-6 rounded-xl max-w-md text-center">
          <p className="text-xl text-white italic">{friendAdvice}</p>
          <button onClick={() => setFriendAdvice(null)} className="mt-4 px-4 py-1 border border-white text-white rounded-full text-sm">Close</button>
        </div>
      )}

      {/* Question Box */}
      <div className="w-full max-w-4xl bg-gradient-to-b from-blue-900/80 to-black/90 border-2 border-blue-500/50 rounded-xl p-6 md:p-8 text-center mb-4 shadow-[0_0_30px_rgba(59,130,246,0.3)] backdrop-blur-md">
        <h2 className="text-xl md:text-2xl text-white font-semibold">
          {currentQuestion.question}
        </h2>
      </div>

      {/* Answers Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.options.map((option, index) => {
          if (hiddenOptions.includes(index)) {
            return <div key={index} className="py-4 px-6 opacity-0">Hidden</div>;
          }

          let btnClass = "border-blue-500/50 bg-blue-900/40 hover:bg-blue-800/60 text-white";
          
          if (selectedAnswer === index) {
            btnClass = "border-yellow-400 bg-yellow-500/40 text-white"; // Selected state
          }
          
          if (isRevealing) {
            if (index === currentQuestion.correctAnswer) {
              btnClass = "border-green-400 bg-green-500/60 text-white shadow-[0_0_20px_rgba(74,222,128,0.5)] z-20 scale-105"; // Correct
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
    </>
  );
}
