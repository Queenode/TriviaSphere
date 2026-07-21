"use client";

import React from 'react';

const LADDER = [
  { level: 15, amount: "1,000,000 XP", safe: true, badge: "🥇 Gold" },
  { level: 14, amount: "500,000 XP", safe: false },
  { level: 13, amount: "250,000 XP", safe: false },
  { level: 12, amount: "125,000 XP", safe: false },
  { level: 11, amount: "64,000 XP", safe: false },
  { level: 10, amount: "32,000 XP", safe: true, badge: "🥈 Silver" },
  { level: 9, amount: "16,000 XP", safe: false },
  { level: 8, amount: "8,000 XP", safe: false },
  { level: 7, amount: "4,000 XP", safe: false },
  { level: 6, amount: "2,000 XP", safe: false },
  { level: 5, amount: "1,000 XP", safe: true, badge: "🥉 Bronze" },
  { level: 4, amount: "500 XP", safe: false },
  { level: 3, amount: "300 XP", safe: false },
  { level: 2, amount: "200 XP", safe: false },
  { level: 1, amount: "100 XP", safe: false },
];

export default function PrizeLadder({ currentLevel }: { currentLevel: number }) {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 backdrop-blur-md border border-gray-800 p-4 rounded-xl hidden md:block">
      <h3 className="text-blue-400 font-bold mb-4 text-center tracking-widest text-sm">REWARDS</h3>
      <div className="flex flex-col gap-1">
        {LADDER.map((step) => {
          const isActive = step.level === currentLevel;
          const isPassed = step.level < currentLevel;

          return (
            <div
              key={step.level}
              className={`
                flex items-center justify-between px-4 py-1 rounded gap-6
                ${isActive ? 'bg-orange-600 text-white font-bold scale-110 shadow-[0_0_10px_rgba(234,88,12,0.8)] z-10 relative' : ''}
                ${isPassed ? 'text-gray-400' : ''}
                ${!isActive && !isPassed ? (step.safe ? 'text-white font-bold' : 'text-orange-400') : ''}
                transition-all duration-300
              `}
            >
              <span className="w-6 text-sm">{step.level}</span>
              <div className="flex items-center justify-end flex-1 text-right gap-2">
                {step.badge && (
                  <span className={`text-xs ${isActive ? 'text-white' : 'text-gray-300'}`}>
                    {step.badge}
                  </span>
                )}
                <span>
                  {step.amount}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
