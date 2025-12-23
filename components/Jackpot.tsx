
import React, { useState, useEffect } from 'react';
import { ARTISTS_LIST } from '../constants';

interface JackpotProps {
  onSelect: (artist: string) => void;
  current: string;
}

const Jackpot: React.FC<JackpotProps> = ({ onSelect, current }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayArtist, setDisplayArtist] = useState(current);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randomArtist = ARTISTS_LIST[Math.floor(Math.random() * ARTISTS_LIST.length)];
      setDisplayArtist(randomArtist);
      counter++;
      if (counter > 20) {
        clearInterval(interval);
        const finalPick = ARTISTS_LIST[Math.floor(Math.random() * ARTISTS_LIST.length)];
        setDisplayArtist(finalPick);
        onSelect(finalPick);
        setIsSpinning(false);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 mt-6">
      <h3 className="text-sm font-semibold opacity-70 uppercase tracking-widest">🎰 Style Jackpot</h3>
      <div className="h-16 flex items-center justify-center overflow-hidden bg-white/5 w-full rounded-xl border-2 border-yellow-500/50">
        <span className={`text-xl font-bold transition-all duration-75 ${isSpinning ? 'scale-110 opacity-50 blur-sm' : 'scale-100 opacity-100'}`}>
          {displayArtist}
        </span>
      </div>
      <button
        onClick={spin}
        disabled={isSpinning}
        className={`w-full py-3 px-6 rounded-full font-bold transition-all shadow-lg ${isSpinning ? 'bg-gray-500' : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:scale-105 active:scale-95'}`}
      >
        {isSpinning ? 'SPINNING...' : 'SPIN FOR STYLE'}
      </button>
    </div>
  );
};

export default Jackpot;
