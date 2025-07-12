import { Card, CardShape } from '../types';
import { WhotGame } from '../WhotGame';

/**
 * Base interface for AI strategies.
 * Different difficulty levels will implement this interface with varying levels of intelligence.
 */
export interface AIStrategy {
  /**
   * Selects the best card to play from valid options.
   * @param validPlays - Array of valid card indices in hand
   * @param hand - The player's current hand
   * @param game - The current game instance
   * @returns Index of the best card to play
   */
  selectBestCard(validPlays: number[], hand: Card[], game: WhotGame): number;

  /**
   * Selects the best shape to declare when playing a WHOT card.
   * @param hand - The player's current hand
   * @param game - The current game instance
   * @returns The best shape to declare
   */
  selectBestShape(hand: Card[], game: WhotGame): CardShape;

  /**
   * Determines whether to play a card or draw when both options are available.
   * @param validPlays - Array of valid card indices in hand
   * @param hand - The player's current hand
   * @param game - The current game instance
   * @returns true if should play a card, false if should draw
   */
  shouldPlayCard(validPlays: number[], hand: Card[], game: WhotGame): boolean;

  /**
   * Gets the strategy name for display purposes.
   * @returns The strategy name
   */
  getName(): string;

  /**
   * Gets the strategy description for UI display.
   * @returns The strategy description
   */
  getDescription(): string;
} 