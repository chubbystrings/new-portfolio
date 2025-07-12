import { Sound, SoundConfig } from "../types";

export class SoundService {
  private static instance: SoundService;
  private readonly initialized: Set<string> = new Set();
  private readonly webAudio: Map<string, HTMLAudioElement> = new Map();
  private readonly volume = 1.0; // Default volume (0.0 to 1.0)
  public static disableSound = false;

  private constructor() {
    //
  }

  public static setDisableSound(disable: boolean): void {
    SoundService.disableSound = disable;
  }

  public static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }

  async initialize(sounds: SoundConfig[]): Promise<void> {
    await Promise.all(
      sounds.map(async (sound) => {
        // Skip if already initialized
        if (this.initialized.has(sound.assetId)) {
        //   console.log(`Sound ${sound.assetId} already initialized`);
          return;
        }

        const audio = new Audio(sound.assetPath.replace("public", ""));
        this.webAudio.set(sound.assetId, audio);
        this.initialized.add(sound.assetId);
        // console.log(`Web audio ${sound.assetId} initialized`);
      })
    );
  }

  async play(assetId: Sound): Promise<void> {
    if (!this.initialized.has(assetId)) {
      throw new Error(`Sound ${assetId} not initialized`);
    }

    if (SoundService.disableSound) {
    //   console.log("Sound disabled");
      return;
    }

    try {
    //   console.log(`Playing sound ${assetId} on web with volume ${this.volume}`);
      const audio = this.webAudio.get(assetId);
      if (audio) {
        audio.volume = this.volume;
        audio.currentTime = 0;
        await audio.play();
      }
    } catch (error) {
      console.error(`Failed to play sound ${assetId}:`, error);
      throw error;
    }
  }

  // TODO Method to set volume on native device

  unloadSound(assetId: Sound): void {
    this.webAudio.delete(assetId);
    this.initialized.delete(assetId);
  }

  dispose(): void {
    this.webAudio.clear();
    this.initialized.clear();
  }

  // Add method to force reinitialization of specific sounds
  async reinitialize(sounds: SoundConfig[]): Promise<void> {
    sounds.forEach((sound) => this.unloadSound(sound.assetId));
    await this.initialize(sounds);
  }
}
