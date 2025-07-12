import React from 'react';
import { useSound } from '../../hooks/useSound';

interface SoundSettingsProps {
  className?: string;
  showAdvanced?: boolean;
}

const SoundSettings: React.FC<SoundSettingsProps> = ({ 
  className = '',
  showAdvanced = false 
}) => {
  const {
    config,
    isInitialized,
    loadingStatus,
    setVolume,
    toggleMute,
    toggleEnabled,
    setMuted,
    setEnabled
  } = useSound();

  if (!isInitialized) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        <span className="text-sm text-gray-600">
          Loading sounds... ({loadingStatus.loaded}/{loadingStatus.total})
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      {/* Main Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Enable/Disable Toggle */}
          <button
            onClick={toggleEnabled}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              config.enabled
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            <span className="text-lg">
              {config.enabled ? '🔊' : '🔇'}
            </span>
            <span className="text-sm font-medium">
              {config.enabled ? 'Sound On' : 'Sound Off'}
            </span>
          </button>

          {/* Mute Toggle */}
          {config.enabled && (
            <button
              onClick={toggleMute}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                config.muted
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              <span className="text-lg">
                {config.muted ? '🔇' : '🔊'}
              </span>
              <span className="text-sm font-medium">
                {config.muted ? 'Muted' : 'Unmuted'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Volume Slider */}
      {config.enabled && !config.muted && (
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700 min-w-[60px]">
            Volume:
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={config.volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-sm text-gray-600 min-w-[40px]">
            {Math.round(config.volume * 100)}%
          </span>
        </div>
      )}

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Advanced Settings
          </h4>
          
          {/* Loading Status */}
          <div className="text-xs text-gray-500 mb-2">
            Sounds loaded: {loadingStatus.loaded}/{loadingStatus.total}
          </div>

          {/* Test Sounds */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {/* Add test sound functionality */}}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Test Sound
            </button>
          </div>
        </div>
      )}

      {/* Custom CSS for slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default SoundSettings; 