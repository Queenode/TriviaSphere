"use client";

import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { login, authenticated, user, logout } = usePrivy();
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-black to-indigo-900/30 z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] z-0" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.8)] mb-6">
          TRIVIASPHERE
        </h1>
        <p className="text-xl md:text-2xl text-blue-200 mb-12 max-w-2xl">
          The ultimate Web3 trivia experience. Answer 15 questions, climb the ladder, and earn on-chain Soulbound Badges to prove your knowledge.
        </p>

        <div className="mb-16">
          {!authenticated ? (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={login}
                className="px-10 py-5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white rounded-full font-bold text-2xl shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all hover:scale-105"
              >
                CONNECT TO PLAY
              </button>
              <Link
                href="/play"
                className="text-sm text-gray-400 hover:text-white underline mt-2"
              >
                (Dev: Bypass Login)
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <p className="text-xl text-blue-300 font-bold bg-blue-900/40 px-6 py-2 rounded-full border border-blue-500/30 backdrop-blur-sm">
                Connected: {user?.wallet?.address?.slice(0, 6) || "Player"}...
              </p>
              <div className="flex gap-4">
                <Link
                  href="/play"
                  className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full font-bold text-2xl shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all hover:scale-105"
                >
                  ENTER TRIVIASPHERE
                </Link>
                <button
                  onClick={logout}
                  className="px-6 py-5 bg-transparent border-2 border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 rounded-full font-bold transition-all"
                >
                  LOGOUT
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          <div className="p-6 bg-blue-950/40 border border-blue-500/30 rounded-2xl backdrop-blur-sm">
            <div className="text-3xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-blue-300 mb-2">15 Questions</h3>
            <p className="text-gray-400">Progressively harder questions. One wrong answer, and you lose it all.</p>
          </div>
          <div className="p-6 bg-blue-950/40 border border-blue-500/30 rounded-2xl backdrop-blur-sm">
            <div className="text-3xl mb-4">⛓️</div>
            <h3 className="text-xl font-bold text-blue-300 mb-2">On-Chain Badges</h3>
            <p className="text-gray-400">Mint exclusive Soulbound Tokens at safe havens (Level 5, 10, and 15).</p>
          </div>
          <div className="p-6 bg-blue-950/40 border border-blue-500/30 rounded-2xl backdrop-blur-sm">
            <div className="text-3xl mb-4">🆘</div>
            <h3 className="text-xl font-bold text-blue-300 mb-2">Lifelines</h3>
            <p className="text-gray-400">Use 50/50, Phone a Friend, and Ask the Audience when you get stuck.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
