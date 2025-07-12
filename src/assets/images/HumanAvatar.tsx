import React from 'react';

interface HumanAvatarProps {
  className?: string;
  width?: number;
  height?: number;
}

const HumanAvatar: React.FC<HumanAvatarProps> = ({ 
  className = '', 
  width = 64, 
  height = 64 
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="32" cy="32" r="30" fill="#10B981" stroke="#059669" strokeWidth="2"/>
      
      {/* Head */}
      <circle cx="32" cy="28" r="12" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1"/>
      
      {/* Hair */}
      <path d="M20 20 Q32 16 44 20 Q42 18 40 16 Q38 14 36 15 Q34 16 32 15 Q30 14 28 15 Q26 16 24 15 Q22 14 20 16 Q18 18 20 20" fill="#92400E"/>
      
      {/* Eyes */}
      <circle cx="28" cy="26" r="2" fill="#1F2937"/>
      <circle cx="36" cy="26" r="2" fill="#1F2937"/>
      
      {/* Eye highlights */}
      <circle cx="27" cy="25" r="0.5" fill="#FFFFFF"/>
      <circle cx="35" cy="25" r="0.5" fill="#FFFFFF"/>
      
      {/* Eyebrows */}
      <path d="M26 23 Q28 22 30 23" stroke="#92400E" strokeWidth="1.5" fill="none"/>
      <path d="M34 23 Q36 22 38 23" stroke="#92400E" strokeWidth="1.5" fill="none"/>
      
      {/* Nose */}
      <path d="M32 28 Q33 30 32 32" stroke="#F59E0B" strokeWidth="1" fill="none"/>
      
      {/* Mouth */}
      <path d="M28 34 Q32 36 36 34" stroke="#DC2626" strokeWidth="1.5" fill="none"/>
      
      {/* Body/Neck */}
      <rect x="28" y="40" width="8" height="12" rx="4" fill="#3B82F6" stroke="#2563EB" strokeWidth="1"/>
      
      {/* Shoulders */}
      <ellipse cx="32" cy="42" rx="10" ry="3" fill="#3B82F6"/>
      
      {/* Arms */}
      <rect x="18" y="42" width="4" height="8" rx="2" fill="#FBBF24" stroke="#F59E0B" strokeWidth="0.5"/>
      <rect x="42" y="42" width="4" height="8" rx="2" fill="#FBBF24" stroke="#F59E0B" strokeWidth="0.5"/>
      
      {/* Hands */}
      <circle cx="20" cy="52" r="2" fill="#FBBF24" stroke="#F59E0B" strokeWidth="0.5"/>
      <circle cx="44" cy="52" r="2" fill="#FBBF24" stroke="#F59E0B" strokeWidth="0.5"/>
      
      {/* Smile lines */}
      <path d="M26 32 Q28 33 30 32" stroke="#F59E0B" strokeWidth="0.5" fill="none" opacity="0.6"/>
      <path d="M34 32 Q36 33 38 32" stroke="#F59E0B" strokeWidth="0.5" fill="none" opacity="0.6"/>
    </svg>
  );
};

export default HumanAvatar; 