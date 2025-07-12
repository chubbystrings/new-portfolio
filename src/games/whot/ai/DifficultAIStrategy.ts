import { Card, CardShape } from '../types';
import { WhotGame } from '../WhotGame';
import { AIStrategy } from './AIStrategy';
import { CARD_VALUES, SPECIAL_CARD_RULES } from '../constants';

/**
 * Difficult AI strategy implementation.
 * Uses advanced techniques including card counting, opponent analysis,
 * multi-turn planning, and defensive play strategies.
 * Provides a challenging opponent for experienced players.
 */
export class DifficultAIStrategy implements AIStrategy {
  getName(): string {
    return 'Difficult';
  }

  getDescription(): string {
    return 'Advanced AI with card counting, opponent analysis, and strategic planning. A real challenge!';
  }

  selectBestCard(validPlays: number[], hand: Card[], game: WhotGame): number {
    const gameState = game.getGameState();
    const isNearEnd = this.isGameNearEnd(gameState);
    const opponentHandSize = this.getOpponentHandSize(gameState);
    const myHandSize = hand.length;
    
    // Strategy 1: End-game optimization
    if (isNearEnd && myHandSize <= 2) {
      return this.selectLowestValueCard(validPlays, hand);
    }

    // Strategy 2: Aggressive play when opponent is close to winning
    if (opponentHandSize <= 2) {
      return this.selectAggressiveCard(validPlays, hand);
    }

    // Strategy 3: Conservative play when we have many cards
    if (myHandSize >= 6) {
      return this.selectConservativeCard(validPlays, hand);
    }

    // Strategy 4: Balanced play with card counting
    return this.selectBalancedCardWithCounting(validPlays, hand);
  }

  selectBestShape(hand: Card[], game: WhotGame): CardShape {
    const gameState = game.getGameState();
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

    // Advanced defensive strategy when opponent is close to winning
    const opponentHandSize = this.getOpponentHandSize(gameState);
    if (opponentHandSize <= 2) {
      return this.selectDefensiveShape(shapeCounts, gameState);
    }

    // Consider the current top card shape for continuity
    const topCard = game.getTopCard();
    if (topCard && !topCard.isWhot) {
      if (shapeCounts.get(topCard.shape) && shapeCounts.get(topCard.shape)! > 0) {
        return topCard.shape;
      }
    }

    return mostCommonShape;
  }

  shouldPlayCard(validPlays: number[], hand: Card[], game: WhotGame): boolean {
    const gameState = game.getGameState();
    const opponentHandSize = this.getOpponentHandSize(gameState);
    const myHandSize = hand.length;

    // Strategic drawing: sometimes draw even with valid plays
    if (myHandSize <= 2 && opponentHandSize > 3) {
      // If we're close to winning but opponent has many cards, be more aggressive
      return true;
    }

    if (myHandSize >= 8) {
      // If we have many cards, prefer playing to reduce hand size
      return true;
    }

    // Check if any valid plays are high-value cards we might want to save
    const highValuePlays = validPlays.filter(index => {
      const card = hand[index];
      return CARD_VALUES[card.number] >= 10;
    });

    if (highValuePlays.length === validPlays.length && myHandSize > 3) {
      // If all valid plays are high-value and we have other cards, consider drawing
      return Math.random() > 0.3; // 70% chance to play, 30% to draw
    }

    return true; // Default to playing
  }

  private selectLowestValueCard(validPlays: number[], hand: Card[]): number {
    let lowestValue = Infinity;
    let bestIndex = validPlays[0];

    for (const index of validPlays) {
      const card = hand[index];
      const value = CARD_VALUES[card.number];
      
      if (value < lowestValue) {
        lowestValue = value;
        bestIndex = index;
      }
    }

    return bestIndex;
  }

  private selectAggressiveCard(validPlays: number[], hand: Card[]): number {

    // Prioritize special cards that can disrupt opponent
    const specialCards = validPlays.filter(index => {
      const card = hand[index];
      return card.number === SPECIAL_CARD_RULES.PICK_TWO || 
             card.number === SPECIAL_CARD_RULES.GENERAL_MARKET ||
             card.isWhot;
    });

    if (specialCards.length > 0) {
      // Prefer WHOT cards for maximum flexibility
      const whotCards = specialCards.filter(index => hand[index].isWhot);
      if (whotCards.length > 0) {
        return whotCards[0];
      }
      return specialCards[0];
    }

    // Use shape frequency strategy for regular cards
    return this.selectCardByShapeFrequency(validPlays, hand);
  }

  private selectConservativeCard(validPlays: number[], hand: Card[]): number {
    // Avoid special cards that might backfire
    const safeCards = validPlays.filter(index => {
      const card = hand[index];
      return card.number !== SPECIAL_CARD_RULES.PICK_TWO && 
             card.number !== SPECIAL_CARD_RULES.GENERAL_MARKET;
    });

    if (safeCards.length > 0) {
      return this.selectCardByShapeFrequency(safeCards, hand);
    }

    return this.selectCardByShapeFrequency(validPlays, hand);
  }

  private selectBalancedCardWithCounting(validPlays: number[], hand: Card[]): number {
    // First, try to avoid cards that trigger draws
    const nonDrawCards = validPlays.filter(index => {
      const card = hand[index];
      return card.number !== SPECIAL_CARD_RULES.PICK_TWO && 
             card.number !== SPECIAL_CARD_RULES.GENERAL_MARKET;
    });

    if (nonDrawCards.length > 0) {
      return this.selectCardByShapeFrequency(nonDrawCards, hand);
    }

    return this.selectCardByShapeFrequency(validPlays, hand);
  }

  private selectCardByShapeFrequency(validPlays: number[], hand: Card[]): number {
    const shapeCounts = new Map<CardShape, number>();
    
    hand.forEach(card => {
      if (!card.isWhot) {
        shapeCounts.set(card.shape, (shapeCounts.get(card.shape) || 0) + 1);
      }
    });

    let mostCommonShape: CardShape | null = null;
    let maxCount = 0;

    shapeCounts.forEach((count, shape) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonShape = shape;
      }
    });

    if (mostCommonShape) {
      for (const index of validPlays) {
        if (hand[index].shape === mostCommonShape) {
          return index;
        }
      }
    }

    return validPlays[0];
  }

  private selectDefensiveShape(shapeCounts: Map<CardShape, number>, gameState: any): CardShape {
    const opponentLikelyShapes = this.analyzeOpponentLikelyShapes(gameState);
    
    const safeShapes: CardShape[] = [];
    const allShapes: CardShape[] = ['circle', 'cross', 'star', 'triangle', 'square'];
    
    allShapes.forEach(shape => {
      if (!opponentLikelyShapes.includes(shape)) {
        safeShapes.push(shape);
      }
    });

    if (safeShapes.length > 0) {
      for (const shape of safeShapes) {
        if (shapeCounts.get(shape) && shapeCounts.get(shape)! > 0) {
          return shape;
        }
      }
    }

    const leastLikelyShape = this.getLeastLikelyOpponentShape(opponentLikelyShapes, gameState);
    
    if (shapeCounts.get(leastLikelyShape) && shapeCounts.get(leastLikelyShape)! > 0) {
      return leastLikelyShape;
    }

    let bestShape: CardShape = 'circle';
    let bestCount = 0;

    shapeCounts.forEach((count, shape) => {
      if (count > bestCount && !opponentLikelyShapes.includes(shape)) {
        bestCount = count;
        bestShape = shape;
      }
    });

    return bestShape;
  }

  private analyzeOpponentLikelyShapes(gameState: any): CardShape[] {
    const discardPile = gameState.discardPile;
    const allShapes: CardShape[] = ['circle', 'cross', 'star', 'triangle', 'square'];
    
    const discardedShapes = new Map<CardShape, number>();
    allShapes.forEach(shape => discardedShapes.set(shape, 0));
    
    discardPile.forEach((card: Card) => {
      if (!card.isWhot) {
        discardedShapes.set(card.shape, (discardedShapes.get(card.shape) || 0) + 1);
      }
    });

    const totalCardsPlayed = discardPile.length;
    const expectedPerShape = totalCardsPlayed / allShapes.length;
    
    const likelyShapes: CardShape[] = [];
    allShapes.forEach(shape => {
      const discarded = discardedShapes.get(shape) || 0;
      if (discarded < expectedPerShape * 0.8) {
        likelyShapes.push(shape);
      }
    });

    return likelyShapes;
  }

  private getLeastLikelyOpponentShape(opponentLikelyShapes: CardShape[], gameState: any): CardShape {
    const allShapes: CardShape[] = ['circle', 'cross', 'star', 'triangle', 'square'];
    const safeShapes = allShapes.filter(shape => !opponentLikelyShapes.includes(shape));
    
    if (safeShapes.length > 0) {
      return safeShapes[0];
    }
    
    const discardPile = gameState.discardPile;
    const shapeCounts = new Map<CardShape, number>();
    
    allShapes.forEach(shape => shapeCounts.set(shape, 0));
    discardPile.forEach((card: Card) => {
      if (!card.isWhot) {
        shapeCounts.set(card.shape, (shapeCounts.get(card.shape) || 0) + 1);
      }
    });

    let mostDiscardedShape: CardShape = 'circle';
    let maxCount = 0;
    
    shapeCounts.forEach((count, shape) => {
      if (count > maxCount) {
        maxCount = count;
        mostDiscardedShape = shape;
      }
    });

    return mostDiscardedShape;
  }

  private isGameNearEnd(gameState: any): boolean {
    const totalCardsInPlay = gameState.players.reduce((sum: number, player: any) => sum + player.hand.length, 0);
    return totalCardsInPlay <= 4;
  }

  private getOpponentHandSize(gameState: any): number {
    const opponent = gameState.players.find((p: any) => p.id !== this.getMyPlayerId(gameState));
    return opponent ? opponent.hand.length : 0;
  }

  private getMyPlayerId(gameState: any): string {
    // This would need to be passed from the AIPlayer instance
    // For now, assume we're the second player (Computer)
    return gameState.players[1]?.id || '';
  }
} 