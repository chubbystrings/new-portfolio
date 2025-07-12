/**
 * Valid card shapes in the Whot game.
 * WHOT is a special shape that can represent any other shape.
 */
export type CardShape = 'circle' | 'cross' | 'star' | 'triangle' | 'square' | 'WHOT';

/**
 * Valid card numbers in the Whot game.
 * Numbers 1-14 are regular cards, 20 is the WHOT card.
 */
export type CardNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 20;

/**
 * Represents a single card in the Whot game.
 * Contains shape, number, and optional WHOT flag.
 */
export interface Card {
  shape: CardShape;
  number: CardNumber;
  isWhot?: boolean;
}

/**
 * Represents a player in the Whot game.
 * Contains player identification, hand, and turn status.
 */
export interface Player {
  id: string;
  name: string;
  hand: Card[];
  isCurrentTurn: boolean;
}

/**
 * Represents the complete state of a Whot game.
 * Contains all players, piles, current state, and game status.
 */
export interface GameState {
  players: Player[];
  drawPile: Card[];
  discardPile: Card[];
  currentShape: CardShape | null;
  currentPlayerIndex: number;
  gameStarted: boolean;
  gameEnded: boolean;
  winner: Player | null;
  specialRuleActive: {
    pickTwo: boolean;
    generalMarket: boolean;
    holdOn: boolean;
  };
  awaitingShapeDeclaration?: boolean;
}

/**
 * Configuration settings for the Whot game.
 * Defines game rules and player limits.
 */
export interface GameConfig {
  initialCardsPerPlayer: number;
  maxPlayers: number;
  minPlayers: number;
}

/**
 * Types of special rules that can be triggered by certain cards.
 * Each rule has different effects on gameplay.
 */
export type SpecialRule = 'HOLD_ON' | 'PICK_TWO' | 'GENERAL_MARKET';

/**
 * Represents the effect of a special card when played.
 * Contains information about the rule type and any additional parameters.
 */
export interface SpecialRuleEffect {
  type: SpecialRule;
  targetPlayerIndex?: number;
  cardsToPick?: number;
  canPlayAgain?: boolean;
} 