import { WhotGame } from './WhotGame';
import { AIPlayer } from './AIPlayer';
import { Card, CardShape, Player } from './types';

/**
 * Event structure for game state changes and player actions.
 * Used by the event system to communicate game updates to the UI.
 */
export interface GameEvent {
  type: 'card_played' | 'card_drawn' | 'turn_changed' | 'game_over' | 'special_rule';
  player: string;
  card?: Card;
  newShape?: CardShape;
  message: string;
}

/**
 * Two-player Whot game wrapper that manages human vs AI gameplay.
 * Provides a simplified interface for 2-player games with event-driven updates.
 * Handles turn management, AI moves, and game state synchronization.
 */
export class TwoPlayerGame {
  private game: WhotGame;
  private aiPlayer: AIPlayer;
  private humanPlayerId: string;
  private aiPlayerId: string;
  private eventListeners: ((event: GameEvent) => void)[] = [];

  /**
   * Creates a new two-player game with a human player and AI opponent.
   * @param humanPlayerName - Display name for the human player (default: 'Player')
   * @throws Error if player creation fails
   */
  constructor(humanPlayerName: string = 'Player') {
    this.game = new WhotGame();
    this.humanPlayerId = this.game.addPlayer(humanPlayerName) ? 
      this.game.getGameState().players[0].id : '';
    this.aiPlayerId = this.game.addPlayer('Computer') ? 
      this.game.getGameState().players[1].id : '';
    
    if (!this.humanPlayerId || !this.aiPlayerId) {
      throw new Error('Failed to create players');
    }

    this.aiPlayer = new AIPlayer(this.game, this.aiPlayerId);
  }

  /**
   * Starts the 2-player game and emits initial game state.
   * @returns true if game started successfully, false otherwise
   */
  public startGame(): boolean {
    const success = this.game.startGame();
    if (success) {
      this.emitEvent({
        type: 'turn_changed',
        player: this.getCurrentPlayerName(),
        message: `Game started! ${this.getCurrentPlayerName()} goes first.`
      });
    }
    return success;
  }

  /**
   * Makes a move for the human player by playing a card from their hand.
   * Validates the move and handles turn transitions.
   * @param cardIndex - Index of the card to play in the player's hand
   * @param newShape - Optional shape declaration for WHOT cards
   * @returns true if the move was successful, false otherwise
   */
  public humanPlayCard(cardIndex: number, newShape?: CardShape): boolean {
    if (!this.isHumanTurn()) {
      this.emitEvent({
        type: 'turn_changed',
        player: this.getCurrentPlayerName(),
        message: "It's not your turn!"
      });
      return false;
    }

    const player = this.game.getPlayer(this.humanPlayerId);
    if (!player || cardIndex >= player.hand.length) {
      this.emitEvent({
        type: 'turn_changed',
        player: this.getCurrentPlayerName(),
        message: "Invalid card selection!"
      });
      return false;
    }

    const card = player.hand[cardIndex];
    const result = this.game.playCard(this.humanPlayerId, cardIndex, newShape);

    if (result.success) {
      this.emitEvent({
        type: 'card_played',
        player: this.getCurrentPlayerName(),
        card,
        newShape,
        message: `You played ${this.formatCard(card)}${newShape ? ` and declared ${newShape}` : ''}`
      });

      // Check if game is over
      if (this.game.isGameOver()) {
        this.handleGameOver();
        return true;
      }

      // If it's still human's turn (e.g., Hold On), don't switch
      if (this.isHumanTurn()) {
        this.emitEvent({
          type: 'turn_changed',
          player: this.getCurrentPlayerName(),
          message: "You can play again!"
        });
        return true;
      }

      // Switch to AI turn
      this.switchToAITurn();
    } else {
      this.emitEvent({
        type: 'turn_changed',
        player: this.getCurrentPlayerName(),
        message: "Invalid play! Try again."
      });
    }

    return result.success;
  }

  /**
   * Makes the human player draw a card from the draw pile.
   * Handles turn transitions and checks if the drawn card can be played.
   * @returns true if the draw was successful, false otherwise
   */
  public humanDrawCard(): boolean {
    if (!this.isHumanTurn()) {
      this.emitEvent({
        type: 'turn_changed',
        player: this.getCurrentPlayerName(),
        message: "It's not your turn!"
      });
      return false;
    }

    const drawnCard = this.game.drawCard(this.humanPlayerId);
    
    if (drawnCard) {
      this.emitEvent({
        type: 'card_drawn',
        player: this.getCurrentPlayerName(),
        card: drawnCard,
        message: `You drew ${this.formatCard(drawnCard)}`
      });

      // Check if human can play the drawn card
      const validPlays = this.game.getValidPlays(this.humanPlayerId);
      if (validPlays.length > 0) {
        this.emitEvent({
          type: 'turn_changed',
          player: this.getCurrentPlayerName(),
          message: "You can play the drawn card or end your turn."
        });
        return true;
      }

      // Human cannot play, switch to AI
      this.switchToAITurn();
    } else {
      this.emitEvent({
        type: 'turn_changed',
        player: this.getCurrentPlayerName(),
        message: "Cannot draw card!"
      });
    }

    return !!drawnCard;
  }

  /**
   * Executes the AI player's turn with intelligent decision making.
   * Handles both card playing and drawing actions.
   */
  public aiTurn(): void {
    if (!this.isAITurn()) {
      return;
    }

    try {
      const result = this.aiPlayer.makeMove();
      
      if (result.action === 'play') {
        const card = this.aiPlayer.getHand()[result.cardIndex!];
        this.emitEvent({
          type: 'card_played',
          player: this.aiPlayer.getName(),
          card,
          newShape: result.newShape,
          message: `Computer played ${this.formatCard(card)}${result.newShape ? ` and declared ${result.newShape}` : ''}`
        });
      } else {
        this.emitEvent({
          type: 'card_drawn',
          player: this.aiPlayer.getName(),
          message: "Computer drew a card"
        });
      }

      // Check if game is over
      if (this.game.isGameOver()) {
        this.handleGameOver();
        return;
      }

      // If it's still AI's turn (e.g., Hold On), continue
      if (this.isAITurn()) {
        this.emitEvent({
          type: 'turn_changed',
          player: this.aiPlayer.getName(),
          message: "Computer plays again!"
        });
        // Continue AI turn with a delay for better UX
        setTimeout(() => this.aiTurn(), 1000);
        return;
      }

      // Switch to human turn
      this.switchToHumanTurn();

    } catch (error) {
      this.emitEvent({
        type: 'turn_changed',
        player: this.getCurrentPlayerName(),
        message: "AI encountered an error!"
      });
    }
  }

  /**
   * Switches to AI turn and starts the AI move sequence.
   * Includes a small delay for better user experience.
   */
  private switchToAITurn(): void {
    this.emitEvent({
      type: 'turn_changed',
      player: this.aiPlayer.getName(),
      message: "Computer's turn..."
    });

    // Add a small delay for better UX
    setTimeout(() => this.aiTurn(), 500);
  }

  /**
   * Switches to human turn and notifies the player.
   */
  private switchToHumanTurn(): void {
    this.emitEvent({
      type: 'turn_changed',
      player: this.getCurrentPlayerName(),
      message: "Your turn!"
    });
  }

  /**
   * Handles game over state and announces the winner.
   */
  private handleGameOver(): void {
    const winner = this.game.getWinner();
    if (winner) {
      this.emitEvent({
        type: 'game_over',
        player: winner.name,
        message: `${winner.name} wins the game!`
      });
    }
  }

  /**
   * Gets all valid card indices that the human player can play.
   * @returns Array of valid card indices in the human player's hand
   */
  public getHumanValidPlays(): number[] {
    return this.game.getValidPlays(this.humanPlayerId);
  }

  /**
   * Gets the human player's current hand.
   * @returns Array of cards in the human player's hand
   */
  public getHumanHand(): Card[] {
    const player = this.game.getPlayer(this.humanPlayerId);
    return player ? player.hand : [];
  }

  /**
   * Gets the AI player's hand (for debugging/display purposes).
   * @returns Array of cards in the AI player's hand
   */
  public getAIHand(): Card[] {
    return this.aiPlayer.getHand();
  }

  /**
   * Gets the top card of the discard pile.
   * @returns The top card, or undefined if discard pile is empty
   */
  public getTopCard(): Card | undefined {
    return this.game.getTopCard();
  }

  /**
   * Gets the currently active shape (set by WHOT card or last played card).
   * @returns The current shape, or null if no shape is set
   */
  public getCurrentShape(): CardShape | null {
    return this.game.getGameState().currentShape;
  }

  /**
   * Checks if it's currently the human player's turn.
   * @returns true if it's the human player's turn, false otherwise
   */
  public isHumanTurn(): boolean {
    return this.game.getCurrentPlayer()?.id === this.humanPlayerId;
  }

  /**
   * Checks if it's currently the AI player's turn.
   * @returns true if it's the AI player's turn, false otherwise
   */
  public isAITurn(): boolean {
    return this.game.getCurrentPlayer()?.id === this.aiPlayerId;
  }

  /**
   * Gets the name of the player whose turn it currently is.
   * @returns The current player's name, or 'Unknown' if no current player
   */
  public getCurrentPlayerName(): string {
    const currentPlayer = this.game.getCurrentPlayer();
    return currentPlayer ? currentPlayer.name : 'Unknown';
  }

  /**
   * Checks if the game has ended.
   * @returns true if the game is over, false otherwise
   */
  public isGameOver(): boolean {
    return this.game.isGameOver();
  }

  /**
   * Gets the winner of the game.
   * @returns The winning player, or null if no winner yet
   */
  public getWinner(): Player | null {
    return this.game.getWinner();
  }

  /**
   * Gets the current game state for external use.
   * @returns The complete game state object
   */
  public getGameState() {
    return this.game.getGameState();
  }

  /**
   * Formats a card for display purposes.
   * @param card - The card to format
   * @returns Formatted string representation of the card
   */
  private formatCard(card: Card): string {
    if (card.isWhot) {
      return 'WHOT';
    }
    return `${card.shape} ${card.number}`;
  }

  /**
   * Adds an event listener to receive game events.
   * @param listener - Function to call when events occur
   */
  public addEventListener(listener: (event: GameEvent) => void): void {
    this.eventListeners.push(listener);
  }

  /**
   * Removes an event listener from the game.
   * @param listener - The listener function to remove
   */
  public removeEventListener(listener: (event: GameEvent) => void): void {
    const index = this.eventListeners.indexOf(listener);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  /**
   * Emits an event to all registered listeners.
   * @param event - The event to emit
   */
  private emitEvent(event: GameEvent): void {
    this.eventListeners.forEach(listener => listener(event));
  }

  /**
   * Resets the game to its initial state and recreates players.
   * Useful for starting a new game without creating a new instance.
   */
  public resetGame(): void {
    this.game.resetGame();
    this.humanPlayerId = this.game.addPlayer('Player') ? 
      this.game.getGameState().players[0].id : '';
    this.aiPlayerId = this.game.addPlayer('Computer') ? 
      this.game.getGameState().players[1].id : '';
    
    if (this.aiPlayerId) {
      this.aiPlayer = new AIPlayer(this.game, this.aiPlayerId);
    }
  }
} 