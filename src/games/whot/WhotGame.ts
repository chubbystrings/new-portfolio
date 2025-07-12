import { Card, Player, GameState, CardShape, SpecialRuleEffect } from "./types";
import {
  GAME_CONFIG,
  CARD_SHAPES,
  CARD_NUMBERS,
  STAR_NUMBERS,
  WHOT_CARD,
  SPECIAL_CARD_RULES,
  CARD_VALUES,
} from "./constants";
import { gameLogger } from "./GameLogger";

/**
 * Main Whot game engine that handles game logic, state management, and player interactions.
 * Supports multiple players, special card rules, and comprehensive game state tracking.
 */
export class WhotGame {
  private state: GameState & { awaitingShapeDeclaration?: boolean };

  constructor() {
    this.state = this.initializeGameState();
  }

  /**
   * Initializes a fresh game state with default values.
   * @returns A new GameState object with empty collections and default settings.
   */
  private initializeGameState(): GameState {
    return {
      players: [],
      drawPile: [],
      discardPile: [],
      currentShape: null,
      currentPlayerIndex: 0,
      gameStarted: false,
      gameEnded: false,
      winner: null,
      specialRuleActive: {
        pickTwo: false,
        generalMarket: false,
        holdOn: false,
      },
    };
  }

  /**
   * Creates a complete WHOT deck with all cards and shuffles them.
   * Includes regular cards for each shape and 5 WHOT cards.
   * @returns A shuffled array of Card objects representing the full deck.
   */
  public createDeck(): Card[] {
    const deck: Card[] = [];

    // Add regular cards for each shape
    CARD_SHAPES.forEach((shape) => {
      const numbers = shape === "star" ? STAR_NUMBERS : CARD_NUMBERS;
      numbers.forEach((number) => {
        deck.push({ shape, number });
      });
    });

    // Add WHOT cards (5 of them)
    for (let i = 0; i < 5; i++) {
      deck.push({ ...WHOT_CARD });
    }

    return this.shuffleDeck(deck);
  }

  /**
   * Shuffles the deck using the Fisher-Yates algorithm for unbiased randomization.
   * @param deck - The deck to shuffle
   * @returns A new array with the cards in random order
   */
  private shuffleDeck(deck: Card[]): Card[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Adds a new player to the game if the maximum player limit hasn't been reached.
   * @param name - The player's display name
   * @returns true if player was added successfully, false if game is full
   */
  public addPlayer(name: string): boolean {
    if (this.state.players.length >= GAME_CONFIG.maxPlayers) {
      return false;
    }

    const player: Player = {
      id: `player_${Date.now()}_${Math.random()}`,
      name,
      hand: [],
      isCurrentTurn: false,
    };

    this.state.players.push(player);
    return true;
  }

  /**
   * Starts the game by dealing cards and setting up the initial game state.
   * Requires minimum number of players to be present.
   * @returns true if game started successfully, false if insufficient players
   */
  public startGame(): boolean {
    if (this.state.players.length < GAME_CONFIG.minPlayers) {
      return false;
    }

    // Create and shuffle deck
    this.state.drawPile = this.createDeck();

    // Deal initial cards to all players
    this.dealCards();

    // Set first card on discard pile and handle special cases
    const firstCard = this.state.drawPile.pop()!;
    this.state.discardPile.push(firstCard);

    if (firstCard.isWhot) {
      // WHOT card requires shape declaration
      this.state.currentShape = null;
      this.state.awaitingShapeDeclaration = true;
    } else {
      this.state.currentShape = firstCard.shape;
      this.state.awaitingShapeDeclaration = false;

      // Apply special rule effects for the first card if applicable
      if (this.isSpecialCard(firstCard)) {
        this.applySpecialRule(firstCard);
        // First player continues their turn after special card
      }
    }

    // Set first player's turn
    this.state.players[0].isCurrentTurn = true;
    this.state.currentPlayerIndex = 0;
    this.state.gameStarted = true;

    gameLogger.log("game_start", { playerCount: this.state.players.length });
    return true;
  }

  /**
   * Deals the initial set of cards to all players.
   * Each player receives GAME_CONFIG.initialCardsPerPlayer cards.
   */
  private dealCards(): void {
    for (let i = 0; i < GAME_CONFIG.initialCardsPerPlayer; i++) {
      this.state.players.forEach((player) => {
        const card = this.state.drawPile.pop()!;
        player.hand.push(card);
      });
    }
  }

  /**
   * Deals a specified number of cards to a specific player.
   * @param playerId - The ID of the player to deal cards to
   * @param count - Number of cards to deal (default: 1)
   * @returns Array of cards that were dealt, empty if player not found or insufficient cards
   */
  public dealCardsToPlayer(playerId: string, count = 1): Card[] {
    const player = this.state.players.find((p) => p.id === playerId);
    if (!player || this.state.drawPile.length < count) {
      // If we can't deal the required number of cards, end the game
      if (this.state.drawPile.length === 0) {
        this.endGameByEmptyDrawPile();
      }
      return [];
    }

    const dealtCards: Card[] = [];
    for (let i = 0; i < count; i++) {
      const card = this.state.drawPile.pop()!;
      player.hand.push(card);
      dealtCards.push(card);
    }

    // Check if draw pile became empty after dealing cards
    if (this.state.drawPile.length === 0) {
      this.endGameByEmptyDrawPile();
    }

    return dealtCards;
  }

  /**
   * Checks if a card can be played on the current top card of the discard pile.
   * @param card - The card to check
   * @param topCard - The current top card on the discard pile
   * @returns true if the card can be played, false otherwise
   */
  public isValidPlay(card: Card, topCard: Card): boolean {
    // WHOT card can always be played
    if (card.isWhot) {
      return true;
    }

    // Check if shapes match
    if (card.shape === topCard.shape) {
      return true;
    }

    // Check if numbers match
    if (card.number === topCard.number) {
      return true;
    }

    // Check if current shape is set (after WHOT was played)
    if (this.state.currentShape && card.shape === this.state.currentShape) {
      return true;
    }

    return false;
  }

  /**
   * Plays a card from a player's hand onto the discard pile.
   * Handles special card effects and turn transitions.
   * @param playerId - The ID of the player making the move
   * @param cardIndex - Index of the card in the player's hand
   * @param newShape - Optional shape declaration for WHOT cards
   * @returns Object with success status and whether player can play again
   */
  public playCard(
    playerId: string,
    cardIndex: number,
    newShape?: CardShape
  ): { success: boolean; canPlayAgain: boolean; cardNumber: number | null } {
    const player = this.state.players.find((p) => p.id === playerId);
    if (!player || !player.isCurrentTurn || cardIndex >= player.hand.length) {
      return { success: false, canPlayAgain: false, cardNumber: null };
    }

    const card = player.hand[cardIndex];
    const topCard = this.state.discardPile[this.state.discardPile.length - 1];

    // Validate the play
    if (!this.isValidPlay(card, topCard)) {
      return { success: false, canPlayAgain: false, cardNumber: null };
    }

    // WHOT cards require shape declaration unless it's the last card
    if (card.isWhot && !newShape && player.hand.length > 1) {
      return { success: false, canPlayAgain: false, cardNumber: null };
    }

    // Remove card from player's hand and add to discard pile
    player.hand.splice(cardIndex, 1);
    this.state.discardPile.push(card);

    // Log the card play
    gameLogger.log("play_card", { player: player.name, card, newShape });

    // Update current shape based on played card
    if (card.isWhot && newShape) {
      this.state.currentShape = newShape;
    } else if (!card.isWhot) {
      this.state.currentShape = card.shape;
    }

    // Apply special card effects
    const specialEffect = this.applySpecialRule(card);

    // Check for winner (player with no cards left)
    if (this.checkWinner(player)) {
      this.state.gameEnded = true;
      this.state.winner = player;
      gameLogger.log("game_end", {
        winner: player.name,
        reason: "no cards left",
      });
      return { success: true, canPlayAgain: false, cardNumber: card.number };
    }

    // Handle turn transition based on special effects
    if (specialEffect.canPlayAgain) {
      // Player can play again (Hold On, Pick Two, General Market)
      return { success: true, canPlayAgain: true, cardNumber: card.number };
    } else {
      this.moveToNextPlayer();
    }

    return { success: true, canPlayAgain: false, cardNumber: card.number };
  }

  /**
   * Checks if a card triggers special game rules.
   * @param card - The card to check
   * @returns true if the card has special effects, false otherwise
   */
  private isSpecialCard(card: Card): boolean {
    return (
      card.number === SPECIAL_CARD_RULES.HOLD_ON ||
      card.number === SPECIAL_CARD_RULES.PICK_TWO ||
      card.number === SPECIAL_CARD_RULES.GENERAL_MARKET
    );
  }

  /**
   * Applies special card effects when a special card is played.
   * @param card - The special card that was played
   * @returns SpecialRuleEffect object describing the effect applied
   */
  private applySpecialRule(card: Card): SpecialRuleEffect {
    const effect: SpecialRuleEffect = { type: "HOLD_ON" };

    switch (card.number) {
      case SPECIAL_CARD_RULES.HOLD_ON:
        this.state.specialRuleActive.holdOn = true;
        effect.canPlayAgain = true;
        gameLogger.log("special_rule", {
          rule: "HOLD_ON",
          player: this.state.players[this.state.currentPlayerIndex].name,
        });
        break;

      case SPECIAL_CARD_RULES.PICK_TWO:
        this.state.specialRuleActive.pickTwo = true;
        effect.type = "PICK_TWO";
        effect.targetPlayerIndex =
          (this.state.currentPlayerIndex + 1) % this.state.players.length;
        effect.cardsToPick = 2;
        // Next player picks 2 cards
        this.dealCardsToPlayer(
          this.state.players[effect.targetPlayerIndex].id,
          2
        );
        effect.canPlayAgain = true;
        gameLogger.log("special_rule", {
          rule: "PICK_TWO",
          player: this.state.players[this.state.currentPlayerIndex].name,
          target: this.state.players[effect.targetPlayerIndex].name,
        });
        break;

      case SPECIAL_CARD_RULES.GENERAL_MARKET:
        this.state.specialRuleActive.generalMarket = true;
        effect.type = "GENERAL_MARKET";
        // All players except current player pick 1 card
        this.state.players.forEach((player, index) => {
          if (index !== this.state.currentPlayerIndex) {
            this.dealCardsToPlayer(player.id, 1);
          }
        });
        effect.canPlayAgain = true;
        gameLogger.log("special_rule", {
          rule: "GENERAL_MARKET",
          player: this.state.players[this.state.currentPlayerIndex].name,
        });
        break;
    }

    return effect;
  }

  /**
   * Moves the turn to the next player in the rotation.
   * Clears special rule states and logs the turn change.
   */
  private moveToNextPlayer(): void {
    const prevPlayer = this.state.players[this.state.currentPlayerIndex];

    // Clear current player's turn
    this.state.players[this.state.currentPlayerIndex].isCurrentTurn = false;

    // Move to next player
    this.state.currentPlayerIndex =
      (this.state.currentPlayerIndex + 1) % this.state.players.length;

    // Set new current player's turn
    const newPlayer = this.state.players[this.state.currentPlayerIndex];
    this.state.players[this.state.currentPlayerIndex].isCurrentTurn = true;

    // Log turn change
    gameLogger.log("turn_change", {
      from: prevPlayer.name,
      to: newPlayer.name,
    });

    // Clear special rules
    this.state.specialRuleActive = {
      pickTwo: false,
      generalMarket: false,
      holdOn: false,
    };
  }

  /**
   * Ends the game and calculates the winner by lowest hand sum.
   */
  public endGameByEmptyDrawPile(): void {
    this.state.gameEnded = true;
    this.state.winner = this.calculateWinnerByLowestHand();
    gameLogger.log("game_end", {
      winner: this.state.winner?.name,
      reason: "draw pile empty",
    }); 
  }

  /**
   * Draws a card for the current player and moves to the next player.
   * Ends the game if the draw pile is empty, with winner determined by lowest hand sum.
   * @param playerId - The ID of the player drawing the card
   * @returns The drawn card, or null if draw pile is empty
   */
  public drawCard(playerId: string): Card | null {
    const player = this.state.players.find((p) => p.id === playerId);
    if (!player || !player.isCurrentTurn) {
      return null;
    }

    // Check if draw pile is empty
    if (this.state.drawPile.length === 0) {
      // End the game and calculate winner by lowest hand sum
      this.endGameByEmptyDrawPile();
      return null;
    }

    const card = this.state.drawPile.pop()!;
    player.hand.push(card);

    // Log the draw action
    gameLogger.log("draw_card", { player: player.name, card });

    // Always move to next player after drawing
    this.moveToNextPlayer();
    return card;
  }

  /**
   * Checks if a player has won by having no cards left in their hand.
   * @param player - The player to check
   * @returns true if the player has won, false otherwise
   */
  public checkWinner(player: Player): boolean {
    return player.hand.length === 0;
  }

  /**
   * Calculates scores for all players based on the sum of card values in their hands.
   * Used for determining winner when draw pile is empty.
   * @returns Object mapping player IDs to their hand scores
   */
  public calculateScores(): Record<string, number> {
    const scores: Record<string, number> = {};

    this.state.players.forEach((player) => {
      if (player.hand.length > 0) {
        scores[player.id] = player.hand.reduce((total, card) => {
          return total + CARD_VALUES[card.number];
        }, 0);
      } else {
        scores[player.id] = 0;
      }
    });

    return scores;
  }

  /**
   * Gets a copy of the current game state.
   * @returns Current GameState object
   */
  public getGameState(): GameState {
    return { 
      ...this.state,
      awaitingShapeDeclaration: this.state.awaitingShapeDeclaration || false
    };
  }

  /**
   * Finds a player by their ID.
   * @param playerId - The ID of the player to find
   * @returns The player object if found, undefined otherwise
   */
  public getPlayer(playerId: string): Player | undefined {
    return this.state.players.find((p) => p.id === playerId);
  }

  /**
   * Gets the player whose turn it currently is.
   * @returns The current player object, or undefined if no current player
   */
  public getCurrentPlayer(): Player | undefined {
    return this.state.players[this.state.currentPlayerIndex];
  }

  /**
   * Gets the top card of the discard pile.
   * @returns The top card, or undefined if discard pile is empty
   */
  public getTopCard(): Card | undefined {
    return this.state.discardPile[this.state.discardPile.length - 1];
  }

  /**
   * Gets all valid card indices that a player can play from their hand.
   * @param playerId - The ID of the player
   * @returns Array of valid card indices in the player's hand
   */
  public getValidPlays(playerId: string): number[] {
    const player = this.state.players.find((p) => p.id === playerId);
    if (!player || !player.isCurrentTurn) {
      return [];
    }

    const topCard = this.getTopCard();
    if (!topCard) {
      return [];
    }

    const validPlays: number[] = [];
    player.hand.forEach((card, index) => {
      if (this.isValidPlay(card, topCard)) {
        validPlays.push(index);
      }
    });

    return validPlays;
  }

  /**
   * Resets the game to its initial state, clearing all players and game data.
   */
  public resetGame(): void {
    this.state = this.initializeGameState();
    gameLogger.log("game_reset");
  }

  /**
   * Checks if the game has ended.
   * @returns true if the game is over, false otherwise
   */
  public isGameOver(): boolean {
    return this.state.gameEnded;
  }

  /**
   * Gets the winner of the game.
   * @returns The winning player, or null if no winner yet
   */
  public getWinner(): Player | null {
    return this.state.winner;
  }

  /**
   * Declares the initial shape when the first card is a WHOT card.
   * This is called when the game starts with a WHOT card on the discard pile.
   * @param shape - The shape to declare for the WHOT card
   * @returns true if the shape was successfully declared, false otherwise
   */
  public declareInitialShape(shape: CardShape): boolean {
    if (!this.state.awaitingShapeDeclaration) {
      return false;
    }

    this.state.currentShape = shape;
    this.state.awaitingShapeDeclaration = false;
    
    // Move to the next player after declaring the initial shape
    this.moveToNextPlayer();
    
    gameLogger.log("initial_shape_declaration", { shape });
    return true;
  }

  /**
   * Calculates the winner when the draw pile is empty.
   * Winner is the player with the lowest sum of card numbers in their hand.
   * @returns The player with the lowest hand sum, or null if no players
   */
  private calculateWinnerByLowestHand(): Player | null {
    let minSum = Infinity;
    let winner: Player | null = null;

    for (const player of this.state.players) {
      const sum = player.hand.reduce((acc, card) => acc + card.number, 0);
      if (sum < minSum) {
        minSum = sum;
        winner = player;
      }
    }

    return winner;
  }
}
