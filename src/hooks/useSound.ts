import { useEffect, useState, useCallback } from 'react';
import { soundService, SoundConfig } from '../services/SoundService';

/**
 * React hook for using the sound service
 * Provides easy access to sound functionality in React components
 */
export const useSound = () => {
  const [config, setConfig] = useState<SoundConfig>(soundService.getConfig());
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(soundService.getLoadingStatus());

  // Initialize sound service on mount
  useEffect(() => {
    const initializeSound = async () => {
      try {
        // Load saved configuration
        soundService.loadConfig();
        
        // Initialize the service
        await soundService.initialize();
        
        setIsInitialized(true);
        setConfig(soundService.getConfig());
        setLoadingStatus(soundService.getLoadingStatus());
      } catch (error) {
        console.error('Failed to initialize sound service:', error);
      }
    };

    initializeSound();
  }, []);

  // Play sound effect
  const play = useCallback((soundId: string, options?: { volume?: number; loop?: boolean }) => {
    soundService.play(soundId, options);
  }, []);

  // Play custom sound
  const playCustom = useCallback((url: string, options?: { volume?: number; loop?: boolean }) => {
    soundService.playCustom(url, options);
  }, []);

  // Stop all sounds
  const stopAll = useCallback(() => {
    soundService.stopAll();
  }, []);

  // Stop specific sound
  const stop = useCallback((soundId: string) => {
    soundService.stop(soundId);
  }, []);

  // Set volume
  const setVolume = useCallback((volume: number) => {
    soundService.setVolume(volume);
    setConfig(soundService.getConfig());
    soundService.saveConfig();
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const newMuted = !soundService.isMuted();
    soundService.setMuted(newMuted);
    setConfig(soundService.getConfig());
    soundService.saveConfig();
  }, []);

  // Set mute state
  const setMuted = useCallback((muted: boolean) => {
    soundService.setMuted(muted);
    setConfig(soundService.getConfig());
    soundService.saveConfig();
  }, []);

  // Toggle enabled state
  const toggleEnabled = useCallback(() => {
    const newEnabled = !soundService.isEnabled();
    soundService.setEnabled(newEnabled);
    setConfig(soundService.getConfig());
    soundService.saveConfig();
  }, []);

  // Set enabled state
  const setEnabled = useCallback((enabled: boolean) => {
    soundService.setEnabled(enabled);
    setConfig(soundService.getConfig());
    soundService.saveConfig();
  }, []);

  // Get available sounds
  const getAvailableSounds = useCallback(() => {
    return soundService.getAvailableSounds();
  }, []);

  // Check if sound is loaded
  const isSoundLoaded = useCallback((soundId: string) => {
    return soundService.isSoundLoaded(soundId);
  }, []);

  return {
    // State
    config,
    isInitialized,
    loadingStatus,
    
    // Methods
    play,
    playCustom,
    stopAll,
    stop,
    setVolume,
    toggleMute,
    setMuted,
    toggleEnabled,
    setEnabled,
    getAvailableSounds,
    isSoundLoaded,
    
    // Convenience methods for common game sounds
    playCardPlay: () => play('cardPlay'),
    playCardDraw: () => play('cardDraw'),
    playWhotPlay: () => play('whotPlay'),
    playGameStart: () => play('gameStart'),
    playGameEnd: () => play('gameEnd'),
    playGameWin: () => play('gameWin'),
    playGameLose: () => play('gameLose'),
    playButtonClick: () => play('buttonClick'),
    playNotification: () => play('notification'),
    playError: () => play('error'),
    playHoldOn: () => play('holdOn'),
    playPickTwo: () => play('pickTwo'),
    playGeneralMarket: () => play('generalMarket'),
    playLastCard: () => play('lastCard'),
    playGameShow: () => play('gameShow'),
  };
}; 