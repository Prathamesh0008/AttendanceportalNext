'use client';

import { Coffee, Sandwich, Moon, Wind, Activity } from 'lucide-react';

const BreakManager = ({ 
  activeBreak,
  setActiveBreak,
  setTotalBreakTime,
  setAlerts,
  empName,
  startBreak
}) => {
  const startBreakHandler = (type, minutes) => {
    if (!startBreak) {
      alert('Please start your shift first');
      return;
    }
    startBreak(type, minutes);
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
        <Activity className="w-5 h-5 mr-2 text-amber-400" />
        Take a Break
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => startBreakHandler('Tea', 15)}
          className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 hover:from-amber-800/40 hover:to-amber-700/30 border border-amber-800/30 p-5 rounded-xl flex flex-col items-center justify-center space-y-2 transition-all hover:scale-105 hover:border-amber-700/50 group"
        >
          <Coffee className="w-10 h-10 text-amber-400 group-hover:text-amber-300" />
          <span className="font-semibold text-amber-300">Tea Break</span>
          <span className="text-sm bg-amber-900/50 text-amber-300 px-3 py-1 rounded-full border border-amber-800/50">15 min</span>
        </button>

        <button
          onClick={() => startBreakHandler('Lunch', 30)}
          className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 hover:from-emerald-800/40 hover:to-emerald-700/30 border border-emerald-800/30 p-5 rounded-xl flex flex-col items-center justify-center space-y-2 transition-all hover:scale-105 hover:border-emerald-700/50 group"
        >
          <Sandwich className="w-10 h-10 text-emerald-400 group-hover:text-emerald-300" />
          <span className="font-semibold text-emerald-300">Lunch</span>
          <span className="text-sm bg-emerald-900/50 text-emerald-300 px-3 py-1 rounded-full border border-emerald-800/50">30 min</span>
        </button>

        <button
          onClick={() => startBreakHandler('Evening', 15)}
          className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 hover:from-orange-800/40 hover:to-orange-700/30 border border-orange-800/30 p-5 rounded-xl flex flex-col items-center justify-center space-y-2 transition-all hover:scale-105 hover:border-orange-700/50 group"
        >
          <Moon className="w-10 h-10 text-orange-400 group-hover:text-orange-300" />
          <span className="font-semibold text-orange-300">Evening</span>
          <span className="text-sm bg-orange-900/50 text-orange-300 px-3 py-1 rounded-full border border-orange-800/50">15 min</span>
        </button>

        <button
          onClick={() => startBreakHandler('Breather', 5)}
          className="bg-gradient-to-br from-sky-900/30 to-sky-800/20 hover:from-sky-800/40 hover:to-sky-700/30 border border-sky-800/30 p-5 rounded-xl flex flex-col items-center justify-center space-y-2 transition-all hover:scale-105 hover:border-sky-700/50 group"
        >
          <Wind className="w-10 h-10 text-sky-400 group-hover:text-sky-300" />
          <span className="font-semibold text-sky-300">Breather</span>
          <span className="text-sm bg-sky-900/50 text-sky-300 px-3 py-1 rounded-full border border-sky-800/50">5 min</span>
        </button>
      </div>
    </div>
  );
};

export default BreakManager;