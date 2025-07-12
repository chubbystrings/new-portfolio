import React, { useState, useEffect, useRef } from 'react';

interface GameTimerProps {
  isRunning: boolean;
  onReset?: () => void;
}

/**
 * Game timer component that tracks elapsed time during a game.
 * Displays time in MM:SS format and automatically starts/stops based on game state.
 */
const GameTimer: React.FC<GameTimerProps> = ({ isRunning, onReset }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<any | null>(null);

  useEffect(() => {
    if (isRunning) {
      // Start the timer
      intervalRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      // Stop the timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // Reset timer when game resets
  useEffect(() => {
    if (!isRunning && elapsedTime > 0) {
      // Game ended, keep the final time displayed
    }
  }, [isRunning, elapsedTime]);

  // Reset timer when starting a new game
  const prevIsRunningRef = useRef(isRunning);
  
  useEffect(() => {
    // If game just started (was not running, now is running), reset timer
    if (isRunning && !prevIsRunningRef.current && elapsedTime > 0) {
      setElapsedTime(0);
    }
    prevIsRunningRef.current = isRunning;
  }, [isRunning, elapsedTime]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setElapsedTime(0);
    onReset?.();
  };

  return (
    <div className="flex items-center justify-center gap-3 p-3 bg-light rounded-lg border border-gray-200 absolute top-[15px] left-0">
      <div className="flex items-center gap-2">
        <svg 
          className="w-5 h-5 text-game" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <span className="text-lg font-mono font-semibold text-game">
          {formatTime(elapsedTime)}
        </span>
      </div>
      
      {!isRunning && elapsedTime > 0 && (
        <button
          onClick={handleReset}
          className="px-3 py-1 text-sm bg-game text-white rounded hover:bg-game-dark transition-colors"
          title="Reset timer"
        >
          Reset
        </button>
      )}
    </div>
  );
};

export default GameTimer; 