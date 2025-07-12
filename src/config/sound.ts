import { SoundConfigMap } from "../types";

export const SOUND_CONFIG: SoundConfigMap = {
    'game-start': {
      assetId: 'game-start',
      assetPath: 'public/assets/game-start.mp3',
      audioChannelNum: 1,
    },
    'game-over': {
      assetId: 'game-over',
      assetPath: 'public/assets/game-over.mp3',
      audioChannelNum: 1
    },
    'special-card': {
      assetId: 'special-card',
      assetPath: 'public/assets/special-card.mp3',
      audioChannelNum: 1
    }
  }
  export const SOUND_CONFIG_ARRAY = Object.keys(SOUND_CONFIG).map((key) => SOUND_CONFIG[key as keyof SoundConfigMap]);
  export const SOUND_CONFIG_KEYS = Object.keys(SOUND_CONFIG) as (keyof SoundConfigMap)[];