import React from 'react';
import { Player } from '../../games/whot';

interface GameControlsProps {
  onDrawCard: () => void;
  onPlayCard: () => void;
  canDraw: boolean;
  canPlay: boolean;
  selectedCardIndex?: number;
  className?: string;
  drawPileCount: number;
  aiActions?: string;
  playerActions?: string;
}

const GameControls: React.FC<GameControlsProps> = ({
  onDrawCard,
  onPlayCard,
  canDraw,
  canPlay,
  selectedCardIndex,
  className = '',
  drawPileCount,
  aiActions,
  playerActions
}) => {
  return (
    <div className={`flex items-center gap-2 w-full space-x-4 min-h-[50px] box-border ${className}`}>
      {(
        <div className="text-sm text-game flex-1 text-center">
          {
            aiActions
          }
        </div>
      )}

      <div className="flex items-center flex-1 justify-center space-x-4">

        <button
          onClick={onDrawCard}
          disabled={!canDraw}
          className="btn-class"
        >
          Draw Card ({drawPileCount})
        </button>

        <button
          onClick={onPlayCard}
          disabled={!canPlay || selectedCardIndex === undefined}
          className="btn-class success"
        >
          Play Card
        </button>
      </div>


      {(
        <div className="text-sm text-game flex-1 text-center">
          {
            playerActions
          }
        </div>
      )}
    </div>
  );
};

export default GameControls; 