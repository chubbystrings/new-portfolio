import { CardShape, CardNumber, GameConfig } from './types';

/**
 * Core game configuration settings.
 * Defines the rules and limits for the Whot game.
 */
export const GAME_CONFIG: GameConfig = {
  initialCardsPerPlayer: 5,
  maxPlayers: 6,
  minPlayers: 2,
};

/**
 * All valid card shapes in the Whot game.
 * Excludes 'WHOT' which is a special shape.
 */
export const CARD_SHAPES: CardShape[] = ['circle', 'cross', 'star', 'triangle', 'square'];

/**
 * All valid card numbers for regular cards.
 * Excludes 20 which is reserved for WHOT cards.
 */
export const CARD_NUMBERS: CardNumber[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

/**
 * Valid card numbers for star-shaped cards.
 * Star cards only use numbers 1-7, unlike other shapes.
 */
export const STAR_NUMBERS: CardNumber[] = [1, 2, 3, 4, 5, 6, 7];

/**
 * The WHOT card definition.
 * WHOT cards have special properties and can represent any shape.
 */
export const WHOT_CARD = {
  shape: 'WHOT' as CardShape,
  number: 20 as CardNumber,
  isWhot: true,
};

/**
 * Special card rules mapping card numbers to their effects.
 * Each number triggers a specific game rule when played.
 */
export const SPECIAL_CARD_RULES = {
  HOLD_ON: 1, // Player can play again
  PICK_TWO: 2, // Next player picks 2 cards
  GENERAL_MARKET: 14, // Everyone except current player picks 1 card
} as const;

/**
 * Point values for each card number.
 * Used for calculating scores when the draw pile is empty.
 */
export const CARD_VALUES: Record<CardNumber, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 11,
  12: 12,
  13: 13,
  14: 14,
  20: 20, // WHOT card
}; 