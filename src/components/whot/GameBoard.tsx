import React from 'react';
import { Card as CardType } from '../../games/whot/types';
import Card from './Card';

interface GameBoardProps {
  topCard?: CardType;
  drawPileCount: number;
  currentShape?: string;
  currentPlayer: string;
  gameStatus: string;
  className?: string;
}

const GameBoard: React.FC<GameBoardProps> = ({
  topCard,
  drawPileCount,
  currentShape,
  currentPlayer,
  gameStatus,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center space-y-6 ${className}`}>
      {/* Game Status */}
      <div className="text-center space-y-2">
        <div className="text-lg text-game">{gameStatus}</div>
        <div className="text-sm text-game">
          Current Player: <span className="font-semibold">{currentPlayer}</span>
        </div>
        {currentShape && (
          <div className="text-sm text-game">
            Current Shape: <span className="font-semibold capitalize">{currentShape}</span>
          </div>
        )}
      </div>

      {/* Game Area */}
      <div className="flex items-center justify-center space-x-8">
        {/* Discard Pile */}
        <div className="flex flex-col items-center space-y-2">
          {topCard ? (
            <Card card={topCard} size="large" />
          ) : (
            <div className="w-16 h-24 bg-gray-200 rounded-lg border-2 border-dashed border-gray-400 flex items-center justify-center">
              <span className="text-gray-500 text-xs">No Card</span>
            </div>
          )}
          <span className="text-sm text-gray-600">Played Card</span>
        </div>
      </div>
    </div>
  );
};

export default GameBoard; 