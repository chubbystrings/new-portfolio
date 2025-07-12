export enum SoundTypes {
    'game-start' = 'game-start',
    'game-over' = 'game-over',
    'special-card' = 'special-card',
  }

export type Nullable<T> = T | null | undefined;
export interface SoundConfig {
  assetId: Sound;
  assetPath: string;
  audioChannelNum?: number;
}

export type Sound = keyof typeof SoundTypes
export type SoundConfigMap = Record<Sound, SoundConfig>;
