/**
 * Sound Service - Singleton pattern for managing audio throughout the application
 * Provides centralized audio management with volume control, mute functionality, and sound effects
 */

export interface SoundConfig {
  volume: number;
  muted: boolean;
  enabled: boolean;
}

export interface SoundEffect {
  id: string;
  url: string;
  volume?: number;
  loop?: boolean;
}

class SoundService {
  private static instance: SoundService;
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private playingSounds: Set<HTMLAudioElement> = new Set();
  private config: SoundConfig = {
    volume: 0.7,
    muted: false,
    enabled: true
  };
  private isInitialized = false;

  // Predefined sound effects
  private readonly soundEffects: Record<string, SoundEffect> = {
    // Game sounds
    cardPlay: { id: 'cardPlay', url: '/sounds/card-play.mp3' },
    cardDraw: { id: 'cardDraw', url: '/sounds/card-draw.mp3' },
    whotPlay: { id: 'whotPlay', url: '/sounds/whot-play.mp3' },
    gameStart: { id: 'gameStart', url: '/sounds/game-start.mp3' },
    gameEnd: { id: 'gameEnd', url: '/sounds/game-end.mp3' },
    gameWin: { id: 'gameWin', url: '/sounds/game-win.mp3' },
    gameLose: { id: 'gameLose', url: '/sounds/game-lose.mp3' },
    gameShow: { id: 'gameShow', url: '/sounds/game-show.mp3' },
    
    // UI sounds
    // buttonClick: { id: 'buttonClick', url: '/sounds/button-click.mp3' },
    // notification: { id: 'notification', url: '/sounds/notification.mp3' },
    // error: { id: 'error', url: '/sounds/error.mp3' },
    
    // Special card sounds
    holdOn: { id: 'holdOn', url: '/sounds/hold-on.mp3' },
    pickTwo: { id: 'pickTwo', url: '/sounds/pick-two.mp3' },
    generalMarket: { id: 'generalMarket', url: '/sounds/general-market.mp3' },
    lastCard: { id: 'lastCard', url: '/sounds/last-card.mp3' }
  };

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get the singleton instance of SoundService
   */
  public static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }

  /**
   * Initialize the sound service
   * Must be called before using any sound functionality
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Load all sound effects
      await this.preloadSounds();
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize SoundService:', error);
      this.config.enabled = false;
    }
  }

  /**
   * Preload all sound effects for better performance
   */
  private async preloadSounds(): Promise<void> {
    const loadPromises = Object.values(this.soundEffects).map(async (effect) => {
      try {
        const audio = new Audio(effect.url);
        audio.preload = 'auto';
        
        // Wait for the audio to be loaded
        await new Promise((resolve, reject) => {
          audio.addEventListener('canplaythrough', resolve, { once: true });
          audio.addEventListener('error', reject, { once: true });
          audio.load();
        });
        
        this.sounds.set(effect.id, audio);
      } catch (error) {
        console.warn(`Failed to load sound: ${effect.id}`, error);
      }
    });

    await Promise.allSettled(loadPromises);
  }

  /**
   * Play a sound effect by ID
   */
  public play(soundId: string, options?: { volume?: number; loop?: boolean }): void {
    if (!this.isInitialized || !this.config.enabled || this.config.muted) {
      return;
    }

    const audio = this.sounds.get(soundId);
    if (!audio) {
      console.warn(`Sound not found: ${soundId}`);
      return;
    }

    try {
      // Clone the audio element to allow overlapping sounds
      const audioClone = audio.cloneNode() as HTMLAudioElement;
      
      // Set volume (use provided volume, then config volume, then default)
      const volume = options?.volume ?? this.config.volume;
      audioClone.volume = Math.max(0, Math.min(1, volume));
      
      // Set loop if specified
      if (options?.loop) {
        audioClone.loop = true;
      }
      
      // Track the playing sound
      this.playingSounds.add(audioClone);
      
      // Remove from tracking when sound ends
      audioClone.addEventListener('ended', () => {
        this.playingSounds.delete(audioClone);
      }, { once: true });
      
      // Play the sound
      audioClone.play().catch(error => {
        console.warn(`Failed to play sound ${soundId}:`, error);
        this.playingSounds.delete(audioClone);
      });
    } catch (error) {
      console.error(`Error playing sound ${soundId}:`, error);
    }
  }

  /**
   * Play a custom sound by URL
   */
  public playCustom(url: string, options?: { volume?: number; loop?: boolean }): void {
    if (!this.isInitialized || !this.config.enabled || this.config.muted) {
      return;
    }

    try {
      const audio = new Audio(url);
      const volume = options?.volume ?? this.config.volume;
      audio.volume = Math.max(0, Math.min(1, volume));
      
      if (options?.loop) {
        audio.loop = true;
      }
      
      // Track the playing sound
      this.playingSounds.add(audio);
      
      // Remove from tracking when sound ends
      audio.addEventListener('ended', () => {
        this.playingSounds.delete(audio);
      }, { once: true });
      
      audio.play().catch(error => {
        console.warn(`Failed to play custom sound:`, error);
        this.playingSounds.delete(audio);
      });
    } catch (error) {
      console.error('Error playing custom sound:', error);
    }
  }

  /**
   * Stop all currently playing sounds
   */
  public stopAll(): void {
    // Stop all tracked playing sounds
    this.playingSounds.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.playingSounds.clear();
    
    // Also stop the original sounds
    this.sounds.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  /**
   * Stop a specific sound by ID
   */
  public stop(soundId: string): void {
    // Stop all playing instances of this sound
    this.playingSounds.forEach(audio => {
      if (audio.src.includes(soundId) || audio.src.includes(this.soundEffects[soundId]?.url.split('/').pop() || '')) {
        audio.pause();
        audio.currentTime = 0;
        this.playingSounds.delete(audio);
      }
    });
    
    // Also stop the original sound
    const audio = this.sounds.get(soundId);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  /**
   * Set the master volume (0.0 to 1.0)
   */
  public setVolume(volume: number): void {
    this.config.volume = Math.max(0, Math.min(1, volume));
    
    // Update volume for all loaded sounds
    this.sounds.forEach(audio => {
      audio.volume = this.config.volume;
    });
  }

  /**
   * Get the current volume
   */
  public getVolume(): number {
    return this.config.volume;
  }

  /**
   * Mute/unmute all sounds
   */
  public setMuted(muted: boolean): void {
    this.config.muted = muted;
  }

  /**
   * Check if sounds are muted
   */
  public isMuted(): boolean {
    return this.config.muted;
  }

  /**
   * Enable/disable the sound service
   */
  public setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
  }

  /**
   * Check if the sound service is enabled
   */
  public isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Get the current configuration
   */
  public getConfig(): SoundConfig {
    return { ...this.config };
  }

  /**
   * Save configuration to localStorage
   */
  public saveConfig(): void {
    try {
      localStorage.setItem('soundConfig', JSON.stringify(this.config));
    } catch (error) {
      console.warn('Failed to save sound config:', error);
    }
  }

  /**
   * Load configuration from localStorage
   */
  public loadConfig(): void {
    try {
      const saved = localStorage.getItem('soundConfig');
      if (saved) {
        const config = JSON.parse(saved);
        this.config = { ...this.config, ...config };
      }
    } catch (error) {
      console.warn('Failed to load sound config:', error);
    }
  }

  /**
   * Get available sound effect IDs
   */
  public getAvailableSounds(): string[] {
    return Object.keys(this.soundEffects);
  }

  /**
   * Check if a sound is loaded
   */
  public isSoundLoaded(soundId: string): boolean {
    return this.sounds.has(soundId);
  }

  /**
   * Get loading status
   */
  public getLoadingStatus(): { loaded: number; total: number } {
    const total = Object.keys(this.soundEffects).length;
    const loaded = this.sounds.size;
    return { loaded, total };
  }
  // stop and remove all sounds from the audio context
  public unloadAllSounds(): void {
    this.stopAll();
    this.audioContext?.close();
    this.audioContext = null;
    this.sounds.clear();
    this.playingSounds.clear();
  }
}


// Export the singleton instance
export const soundService = SoundService.getInstance();

// Export the class for type checking
export default SoundService; 