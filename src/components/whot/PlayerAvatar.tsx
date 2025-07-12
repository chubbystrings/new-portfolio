import React from 'react';
import { AIAvatar, HumanAvatar } from '../../assets';

interface PlayerAvatarProps {
  isAI: boolean;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * PlayerAvatar component that displays either AI or human avatar
 * based on the player type.
 */
const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ 
  isAI, 
  className = '', 
  width = 48, 
  height = 48 
}) => {
  return isAI ? (
    <AIAvatar 
      className={className} 
      width={width} 
      height={height} 
    />
  ) : (
    <HumanAvatar 
      className={className} 
      width={width} 
      height={height} 
    />
  );
};

export default PlayerAvatar; 