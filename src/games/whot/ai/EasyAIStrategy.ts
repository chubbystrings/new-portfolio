import { Card, CardShape } from '../types';
import { WhotGame } from '../WhotGame';
import { AIStrategy } from './AIStrategy';
import { CARD_VALUES, SPECIAL_CARD_RULES } from '../constants';

/**
 * Easy AI strategy implementation.
 * Makes basic decisions with some randomness and limited strategic thinking.
 * Suitable for beginners and casual players.
 */
export class EasyAIStrategy implements AIStrategy {
  getName(): string {
    return 'Easy';
  }

  getDescription(): string {
    return 'Basic AI that makes simple decisions with some randomness. Good for beginners!';
  }

  selectBestCard(validPlays: number[], hand: Card[], game: WhotGame): number {
    // Simple strategy: prefer regular cards over special cards
    const regularCards = validPlays.filter(index => {
      const card = hand[index];
      return !card.isWhot && 
             card.number !== SPECIAL_CARD_RULES.PICK_TWO && 
             card.number !== SPECIAL_CARD_RULES.GENERAL_MARKET;
    });

    if (regularCards.length > 0) {
      // Choose a random regular card
      return regularCards[Math.floor(Math.random() * regularCards.length)];
    }

    // If only special cards available, choose randomly
    return validPlays[Math.floor(Math.random() * validPlays.length)];
  }

  selectBestShape(hand: Card[], game: WhotGame): CardShape {
    const shapeCounts = new Map<CardShape, number>();
    
    // Count non-WHOT cards by shape
    hand.forEach(card => {
      if (!card.isWhot) {
        shapeCounts.set(card.shape, (shapeCounts.get(card.shape) || 0) + 1);
      }
    });

    // Find the most common shape
    let mostCommonShape: CardShape = 'circle';
    let maxCount = 0;

    shapeCounts.forEach((count, shape) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonShape = shape;
      }
    });

    // Add some randomness - 30% chance to choose a random shape
    if (Math.random() < 0.3) {
      const allShapes: CardShape[] = ['circle', 'cross', 'star', 'triangle', 'square'];
      return allShapes[Math.floor(Math.random() * allShapes.length)];
    }

    return mostCommonShape;
  }

  shouldPlayCard(validPlays: number[], hand: Card[], game: WhotGame): boolean {
    // Always play if we have valid plays (no strategic thinking)
    return validPlays.length > 0;
  }
} 