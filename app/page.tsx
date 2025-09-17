'use client';

import { useEffect, useMemo, useState } from 'react';

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
  const [pairCount, setPairCount] = useState<number>(8);
  const [cards, setCards] = useState<Card[]>(() => generateDeck(8));
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const matchedCount = useMemo(() => cards.filter(c => c.isMatched).length, [cards]);
  const finished = matchedCount === cards.length && cards.length > 0;

  useEffect(() => {
    if (finished && startTime && endTime === null) {
      setEndTime(Date.now());
    }
  }, [finished, startTime, endTime]);

  function resetGame(newPairCount = pairCount) {
    setPairCount(newPairCount);
    setCards(generateDeck(newPairCount));
    setFlippedIndices([]);
    setIsBusy(false);
    setMoves(0);
    setStartTime(null);
    setEndTime(null);
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
      <div style={{ padding: 8, background: '#222', color: '#fff' }}>
        VERSION 2
      </div>
      <header className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Memory Match</h1>
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="rounded-md bg-gray-800 px-3 py-2 text-sm outline-none ring-1 ring-gray-700 hover:ring-gray-600"
            value={pairCount}
            onChange={(e) => resetGame(Number(e.target.value))}
          >
            {[6, 8, 10, 12].map(n => (
              <option key={n} value={n}>{n} pairs</option>
            ))}
          </select>
          <button
            onClick={() => resetGame()}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 active:bg-blue-600 disabled:opacity-50"
            disabled={isBusy}
          >
            Restart
          </button>
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

      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
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
              className={`relative aspect-square select-none rounded-xl text-3xl transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
      {finished && (
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

