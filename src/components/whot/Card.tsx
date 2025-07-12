import React from 'react';
import { Card as CardType } from '../../games/whot/types';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  className?: string;
  size?: 'small' |'large';
}

const Card: React.FC<CardProps> = ({ 
  card, 
  onClick, 
  disabled = false, 
  selected = false,
  size = 'small',
  className = ''
}) => {
  const getShapeSymbol = (shape: string) => {
    switch (shape) {
      case 'circle': return '●';
      case 'triangle': return '▲';
      case 'square': return '■';
      case 'cross': return '✚';
      case 'star': return '★';
      case 'WHOT': return '🎴';
      default: return '?';
    }
  };

  const getShapeColor = (shape: string) => {
    switch (shape) {
      case 'circle': return 'text-red-500';
      case 'triangle': return 'text-green-500';
      case 'square': return 'text-blue-500';
      case 'cross': return 'text-purple-500';
      case 'star': return 'text-yellow-500';
      case 'WHOT': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const getCardBackground = () => {
    if (card.isWhot) {
      return 'bg-gradient-to-br from-orange-400 to-red-500';
    }
    return 'bg-white';
  };

  return (
    <div
      className={`
        relative rounded-lg shadow-lg border-2 cursor-pointer
        transition-all duration-200 transform hover:scale-105 hover:-translate-y-1
        ${getCardBackground()}
        ${selected ? 'border-blue-500 shadow-xl scale-110' : 'border-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${onClick ? 'hover:shadow-xl' : ''}
        ${size === 'small' ? 'w-16 h-24' : 'w-[200px] h-[300px]'}
        ${className}
      `}
      onClick={disabled ? undefined : onClick}
    >
      {/* Card content - simplified with only center shape */}
      <div className="absolute inset-0 flex flex-col justify-between p-2">
        {/* Top left - just the number */}
        <div className="flex flex-col items-start">
          <span className={`${size === 'small' ? 'text-xs' : 'text-2xl'} font-bold ${getShapeColor(card.shape)}`}>
            {card.number}
          </span>
        </div>

        {/* Center - main shape */}
        <div className="flex justify-center items-center">
          <span className={`${size === 'small' ? 'text-3xl' : 'text-5xl'} ${getShapeColor(card.shape)}`}>
            {getShapeSymbol(card.shape)}
          </span>
        </div>

        {/* Bottom right - just the number (rotated) */}
        <div className="flex flex-col items-end">
          <span className={`${size === 'small' ? 'text-xs' : 'text-2xl'} font-bold ${getShapeColor(card.shape)} rotate-360`}>
            {card.number}
          </span>
        </div>
      </div>

      {/* WHOT indicator */}
      {card.isWhot && (
        <div className="absolute top-1 right-1 bg-orange-500 text-white text-xs px-1 rounded-full">
          WHOT
        </div>
      )}
    </div>
  );
};

export default Card; 