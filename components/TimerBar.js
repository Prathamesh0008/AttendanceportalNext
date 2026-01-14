// TimerBar.js
'use client';
import { useState, useEffect } from 'react';

const TimerBar = ({ totalSeconds, breakType, onComplete, onExceed }) => {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isExceeded, setIsExceeded] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        const newTime = prev - 1;
        
        if (newTime <= -1 && !isExceeded) {
          setIsExceeded(true);
          onExceed?.(Math.abs(newTime));
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onComplete, onExceed, isExceeded]);

  const progress = Math.min(100, ((totalSeconds - secondsLeft) / totalSeconds) * 100);
  const minutes = Math.floor(Math.abs(secondsLeft) / 60);
  const seconds = Math.abs(secondsLeft) % 60;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-300">{breakType} Break</span>
        <div className={`text-sm font-mono font-bold ${isExceeded ? 'text-red-400' : 'text-emerald-400'}`}>
          {isExceeded ? '⏰ EXCEEDED' : '⏱️ Remaining'}: {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>
      
      <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isExceeded 
              ? 'bg-gradient-to-r from-red-500 to-red-600' 
              : progress > 80 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500'
          }`}
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
    </div>
  );
};

export default TimerBar;