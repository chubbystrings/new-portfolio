import React from 'react';
import { CardShape } from '../../games/whot/types';

interface ShapeSelectorProps {
  onShapeSelect: (shape: CardShape) => void;
  isVisible: boolean;
  className?: string;
  isInitialDeclaration?: boolean;
}

const ShapeSelector: React.FC<ShapeSelectorProps> = ({
  onShapeSelect,
  isVisible,
  className = '',
  isInitialDeclaration = false
}) => {
  const shapes: { shape: CardShape; symbol: string; color: string; label: string }[] = [
    { shape: 'circle', symbol: '●', color: 'text-red-500', label: 'Circle' },
    { shape: 'triangle', symbol: '▲', color: 'text-green-500', label: 'Triangle' },
    { shape: 'square', symbol: '■', color: 'text-blue-500', label: 'Square' },
    { shape: 'cross', symbol: '✚', color: 'text-purple-500', label: 'Cross' },
    { shape: 'star', symbol: '★', color: 'text-yellow-500', label: 'Star' },
  ];

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
          {isInitialDeclaration ? 'Choose Starting Shape' : 'Choose a New Shape'}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {shapes.map(({ shape, symbol, color, label }) => (
            <button
              key={shape}
              onClick={() => onShapeSelect(shape)}
              className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
            >
              <span className={`text-3xl mb-2 ${color}`}>{symbol}</span>
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShapeSelector; 