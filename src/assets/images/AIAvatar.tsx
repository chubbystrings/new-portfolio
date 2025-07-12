import React from 'react';

interface AIAvatarProps {
  className?: string;
  width?: number;
  height?: number;
}

const AIAvatar: React.FC<AIAvatarProps> = ({ 
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
      <circle cx="32" cy="32" r="30" fill="#4F46E5" stroke="#3730A3" strokeWidth="2"/>
      
      {/* AI/Robot head */}
      <rect x="20" y="18" width="24" height="28" rx="4" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1"/>
      
      {/* Eyes */}
      <circle cx="26" cy="28" r="3" fill="#1F2937"/>
      <circle cx="38" cy="28" r="3" fill="#1F2937"/>
      
      {/* Eye highlights */}
      <circle cx="25" cy="27" r="1" fill="#FFFFFF"/>
      <circle cx="37" cy="27" r="1" fill="#FFFFFF"/>
      
      {/* Mouth/Display */}
      <rect x="26" y="36" width="12" height="6" rx="1" fill="#1F2937"/>
      
      {/* Circuit pattern on display */}
      <rect x="28" y="38" width="2" height="2" fill="#10B981"/>
      <rect x="32" y="38" width="2" height="2" fill="#10B981"/>
      <rect x="34" y="38" width="2" height="2" fill="#10B981"/>
      
      {/* Antenna */}
      <line x1="32" y1="18" x2="32" y2="12" stroke="#9CA3AF" strokeWidth="2"/>
      <circle cx="32" cy="10" r="2" fill="#F59E0B"/>
      
      {/* Circuit lines on head */}
      <path d="M22 22 L26 22" stroke="#9CA3AF" strokeWidth="1"/>
      <path d="M22 24 L26 24" stroke="#9CA3AF" strokeWidth="1"/>
      <path d="M38 22 L42 22" stroke="#9CA3AF" strokeWidth="1"/>
      <path d="M38 24 L42 24" stroke="#9CA3AF" strokeWidth="1"/>
      
      {/* Tech details */}
      <circle cx="24" cy="32" r="1" fill="#6B7280"/>
      <circle cx="40" cy="32" r="1" fill="#6B7280"/>
    </svg>
  );
};

export default AIAvatar; 