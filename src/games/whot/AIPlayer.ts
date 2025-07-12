import { Card, CardShape, Player } from './types';
import { WhotGame } from './WhotGame';
import { SPECIAL_CARD_RULES, CARD_VALUES } from './constants';
import { AIStrategy } from './ai/AIStrategy';

/**
 * AI player implementation for the Whot game.
 * Provides intelligent decision-making for computer-controlled players,
 * including card selection strategies and shape declaration logic.
 */
export class AIPlayer {
  private game: WhotGame;
  private playerId: string;
  private strategy: AIStrategy;

  constructor(game: WhotGame, playerId: string, strategy: AIStrategy) {
    this.game = game;
    this.playerId = playerId;
    this.strategy = strategy;
  }

  /**
   * Makes a move for the AI player based on current game state.
   * Analyzes valid plays and selects the best action (play card or draw).
   * @returns Object describing the action taken and any additional parameters
   * @throws Error if AI player is not the current player
   */
  public makeMove(): { action: 'play' | 'draw'; cardIndex?: number; newShape?: CardShape, cardNumber?: number } {
    const player = this.game.getPlayer(this.playerId);
    if (!player || !player.isCurrentTurn) {
      throw new Error('AI player is not the current player');
    }

    const validPlays = this.game.getValidPlays(this.playerId);
    
    if (validPlays.length === 0) {
      // No valid plays available, must draw a card
      this.game.drawCard(this.playerId);
      return { action: 'draw' };
    }

    // Use strategy to decide whether to play or draw
    if (!this.strategy.shouldPlayCard(validPlays, player.hand, this.game)) {
      this.game.drawCard(this.playerId);
      return { action: 'draw' };
    }

    // Find the best card to play from available options
    const bestCardIndex = this.strategy.selectBestCard(validPlays, player.hand, this.game);
    const selectedCard = player.hand[bestCardIndex];

    // Handle WHOT card shape declaration (unless it's the last card)
    if (selectedCard.isWhot && player.hand.length > 1) {
      const bestShape = this.strategy.selectBestShape(player.hand, this.game);
      this.game.playCard(this.playerId, bestCardIndex, bestShape);
      return { action: 'play', cardIndex: bestCardIndex, newShape: bestShape, cardNumber: selectedCard.number };
    } else {
      // Play regular card or WHOT as last card (no shape selection needed)
      this.game.playCard(this.playerId, bestCardIndex);
      return { action: 'play', cardIndex: bestCardIndex, cardNumber: selectedCard.number };
    }
  }

  /**
   * Gets the name of the current AI strategy.
   * @returns The strategy name
   */
  public getStrategyName(): string {
    return this.strategy.getName();
  }

  /**
   * Gets the description of the current AI strategy.
   * @returns The strategy description
   */
  public getStrategyDescription(): string {
    return this.strategy.getDescription();
  }

  /**
   * Selects the best shape to declare when playing a WHOT card.
   * Delegates to the current strategy.
   * @param hand - The player's current hand
   * @returns The best shape to declare
   */
  public selectBestShape(hand: Card[]): CardShape {
    return this.strategy.selectBestShape(hand, this.game);
  }



  /**
   * Gets the AI player's current hand.
   * @returns Array of cards in the AI player's hand
   */
  public getHand(): Card[] {
    const player = this.game.getPlayer(this.playerId);
    return player ? player.hand : [];
  }

  /**
   * Gets the AI player's display name.
   * @returns The AI player's name, or 'AI Player' if not found
   */
  public getName(): string {
    const player = this.game.getPlayer(this.playerId);
    return player ? player.name : 'AI Player';
  }

  /**
   * Checks if it's currently the AI player's turn.
   * @returns true if it's the AI player's turn, false otherwise
   */
  public isMyTurn(): boolean {
    const player = this.game.getPlayer(this.playerId);
    return player ? player.isCurrentTurn : false;
  }
} 