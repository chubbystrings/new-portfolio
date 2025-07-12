import React from 'react';
import { Card as CardType } from '../../games/whot/types';
import Card from './Card';
import { motion } from 'framer-motion';
import { polaroidVariants } from '../../utils/variants';

interface PlayerHandProps {
  cards: CardType[];
  onCardClick?: (index: number) => void;
  disabled?: boolean;
  selectedCardIndex?: number;
  title?: string;
  className?: string;
  vertical?: boolean;
  showTitle?: boolean;
}

const PlayerHand: React.FC<PlayerHandProps> = ({
  cards,
  onCardClick,
  disabled = false,
  selectedCardIndex,
  title = 'Player Hand',
  className = '',
  showTitle = false
}) => {
  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {showTitle && <h3 className="text-lg font-semibold text-gray-700">{title}</h3>}
      <div className={`flex flex-row flex-wrap gap-2 justify-center max-w-4xl`}>
        {cards.map((card, index) => (
          <motion.div initial="offscreen" whileInView="onscreen" variants={polaroidVariants(index, true)} key={`${card.shape}-${card.number}-${index}`}>
            <Card
              key={`${card.shape}-${card.number}-${index}`}
              card={card}
              onClick={() => onCardClick?.(index)}
              disabled={disabled}
              selected={selectedCardIndex === index}
              className="transform hover:scale-105"
            />
          </motion.div>
        ))}
      </div>
      <div className="text-sm text-gray-500">
        {cards.length} card{cards.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default PlayerHand; 