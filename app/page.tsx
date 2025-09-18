'use client';

import { useEffect, useMemo, useState } from 'react';
import AuthForm from './components/AuthForm';


type Card = {
  id: number;
  value: string;
  isMatched: boolean;
};

function generateDeck(pairCount: number): Card[] {
  const emojis = ['🍎', '🍌', '🍇', '🍊', '🍉', '🍓', '🍒', '🥝', '🍍', '🥑', '🥕', '🌶️'];
  const chosen = emojis.slice(0, pairCount);
  const deckValues = [...chosen, ...chosen]
    .map((v, i) => ({ id: i + 1, value: v, isMatched: false }))
    .sort(() => Math.random() - 0.5);
  return deckValues;
}

export default function Page() {
  const [selectedLevel, setSelectedLevel] = useState<number>(1); 
  const [pairCount, setPairCount] = useState<number>(4);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [user, setUser] = useState<string | null>(null);

  const matchedCount = useMemo(() => cards.filter(c => c.isMatched).length, [cards]);
  const finished = matchedCount === cards.length && cards.length > 0;

  useEffect(() => {
    if (finished && startTime && endTime === null) {
      setEndTime(Date.now());
      addScore(selectedLevel);
    }
  }, [finished, startTime, endTime]);

  if (!user) {
    return (
      <div className="grid place-items-center min-h-screen">
        <AuthForm onLogin={setUser} />
      </div>
    );
  }

  function addScore(level: number) {
    const points = level === 1 ? 50 : level === 2 ? 100 : 150;
    setScore(prev => prev + points);
  }

  function resetGame(newPairCount = pairCount) {
    setPairCount(newPairCount);
    setCards(generateDeck(newPairCount));
    setFlippedIndices([]);
    setIsBusy(false);
    setMoves(0);
    setStartTime(null);
    setEndTime(null);
  }

  function levelToPairs(level: number): number {
    if (level === 1) return 4;
    if (level === 2) return 8;
    return 12; 
  }

  function startGame() {
    const pairs = levelToPairs(selectedLevel);
    resetGame(pairs);
    setGameStarted(true);
  }

  function onCardClick(index: number) {
    if (isBusy) return;
    if (flippedIndices.includes(index)) return;
    if (cards[index].isMatched) return;

    if (startTime === null) setStartTime(Date.now());

    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setIsBusy(true);
      setMoves(m => m + 1);
      const [i1, i2] = nextFlipped;
      const c1 = cards[i1];
      const c2 = cards[i2];
      if (c1.value === c2.value) {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => (i === i1 || i === i2 ? { ...c, isMatched: true } : c)));
          setFlippedIndices([]);
          setIsBusy(false);
        }, 300);
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
          setIsBusy(false);
        }, 900);
      
      }
    }
  }  
  return (
    <main>
      <header className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Memory Match</h1>
        <h2 className="text-2x1 font-semibold">Player: {user}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white">
            Score: {score}
          </div>
          {gameStarted && (
            <>
              <div className="rounded-md bg-gray-900 px-3 py-2 text-sm ring-1 ring-gray-800">
                Level: {selectedLevel}
              </div>
              <button
                onClick={() => resetGame()}
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 active:bg-blue-600 disabled:opacity-50"
                disabled={isBusy}
              >
                Restart
              </button>
              <button
                onClick={() => {
                  setGameStarted(false);
                  setCards([]);
                  setFlippedIndices([]);
                  setIsBusy(false);
                  setMoves(0);
                  setStartTime(null);
                  setEndTime(null);
                }}
                className="rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white hover:bg-gray-600"
              >
                Change Level
              </button>
              <button
      onClick={() => setUser(null)}
      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-500"
    >
      Logout
    </button>
            </>
          )}
        </div>
      </header>

      <section className="mb-6 grid grid-cols-2 items-center justify-between gap-4 sm:grid-cols-3 md:grid-cols-4">
        <div className="rounded-md bg-gray-900 p-3 text-sm ring-1 ring-gray-800">
          Moves: <span className="font-semibold">{moves}</span>
        </div>
        <div className="rounded-md bg-gray-900 p-3 text-sm ring-1 ring-gray-800">
          Matched: <span className="font-semibold">{matchedCount / 2} / {pairCount}</span>
        </div>
        <div className="rounded-md bg-gray-900 p-3 text-sm ring-1 ring-gray-800 md:col-span-2 sm:col-span-1">
          {startTime ? (
            <Timer startTime={startTime} endTime={finished ? (endTime ?? Date.now()) : null} />
          ) : (
            'Time: 0s'
          )}
        </div>
      </section>

      {gameStarted && (
      <div
        className={`grid ${selectedLevel === 3 ? 'gap-2' : 'gap-3'}`}
        style={{
          gridTemplateColumns:
            selectedLevel === 3
              ? 'repeat(6, minmax(56px, 1fr))'
              : 'repeat(4, minmax(72px, 1fr))',
        }}
      >
        {cards.map((card, index) => {
          const isFlipped = flippedIndices.includes(index) || card.isMatched;
          return (
            <button
              key={card.id}
              aria-label={`card ${index + 1}`}
              onClick={() => onCardClick(index)}
              disabled={isBusy || card.isMatched}
              className={`relative aspect-square select-none rounded-xl ${selectedLevel === 3 ? 'text-2xl' : 'text-3xl'} transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isFlipped ? 'bg-gray-100 text-gray-900' : 'bg-gray-800 text-gray-100'
              }`}
            >
              <span className="pointer-events-none grid h-full place-items-center">
                {isFlipped ? card.value : '❔'}
              </span>
            </button>
          );
        })}
      </div>
      )}
      {gameStarted && finished && (
        <div className="mt-8 rounded-lg bg-green-900/30 p-4 ring-1 ring-green-900/50">
          <p className="mb-2 text-lg font-medium">You won! 🎉</p>
          <p className="text-sm text-gray-300">
            Moves: <span className="font-semibold text-white">{moves}</span>
            {startTime && endTime && (
              <>
                {' '}• Time: <Elapsed from={startTime} to={endTime} />
              </>
            )}
          </p>
        </div>
      )}

      {!gameStarted && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70">
          <div className="w-full max-w-sm rounded-2xl bg-gray-900 p-6 ring-1 ring-gray-800">
            <h2 className="mb-4 text-lg font-semibold">Choose Level</h2>
            <div className="mb-4 grid gap-2">
              {[1,2,3].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`w-full rounded-md px-4 py-2 text-center ring-1 transition ${
                    selectedLevel === lvl
                      ? 'bg-blue-600 text-white ring-blue-500'
                      : 'bg-gray-800 text-gray-100 ring-gray-700 hover:ring-gray-600'
                  }`}
                >
                  {lvl === 1 && 'Level 1'}
                  {lvl === 2 && 'Level 2'}
                  {lvl === 3 && 'Level 3'}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={startGame}
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Timer({ startTime, endTime }: { startTime: number; endTime: number | null }) {
  const [, setTick] = useState<number>(0);
  useEffect(() => {
    if (endTime) return;
    const id = setInterval(() => setTick((t) => t + 1), 500);
    return () => clearInterval(id);
  }, [endTime]);
  return (
    <span>
      Time: <Elapsed from={startTime} to={endTime ?? Date.now()} />
    </span>
  );
}

function Elapsed({ from, to }: { from: number; to: number }) {
  const seconds = Math.max(0, Math.floor((to - from) / 1000));
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return <span className="font-semibold">{m > 0 ? `${m}m ` : ''}{s}s</span>;
}

