import { describe, it, expect, beforeEach } from 'vitest';
import { WhotGame } from '../WhotGame';
import { AIPlayer } from '../AIPlayer';
import { SPECIAL_CARD_RULES } from '../constants';
import { AIFactory } from '../ai/AIFactory';

describe('AIPlayer', () => {
  let game: WhotGame;
  let aiPlayer: AIPlayer;

  beforeEach(() => {
    game = new WhotGame();
    game.addPlayer('Human');
    game.addPlayer('Computer');
    game.startGame();
    
    const aiStrategy = AIFactory.createStrategy('easy');
    
    aiPlayer = new AIPlayer(game, (game as any).state.players[1].id, aiStrategy);
  });

  describe('Basic AI Functionality', () => {
    it('should make a move when it is AI turn', () => {
      // Make human draw to switch to AI turn
      const humanId = (game as any).state.players[0].id;
      game.drawCard(humanId);
      // Set AI hand and top card to guarantee a valid play
      const aiPlayerId = (game as any).state.players[1].id;
      const aiPlayerState = game.getPlayer(aiPlayerId)!;
      aiPlayerState.hand = [
        { shape: 'circle', number: 5 },
        { shape: 'triangle', number: 10 }
      ];
      (game as any).state.discardPile = [{ shape: 'circle', number: 3 }];
      (game as any).state.currentShape = 'circle';
      (game as any).state.players.forEach((p: any, idx: number) => p.isCurrentTurn = idx === 1);
      (game as any).state.currentPlayerIndex = 1;
      expect(aiPlayer.isMyTurn()).toBe(true);
      const result = aiPlayer.makeMove();
      expect(result.action).toBe('play');
      expect(result.cardIndex).toBeDefined();
    });

    it('should draw a card when no valid plays are available', () => {
      // Give AI only invalid cards
      const aiPlayerId = (game as any).state.players[1].id;
      const aiPlayerState = game.getPlayer(aiPlayerId)!;
      aiPlayerState.hand = [
        { shape: 'circle', number: 5 },
        { shape: 'triangle', number: 10 }
      ];
      (game as any).state.discardPile = [{ shape: 'square', number: 7 }];
      (game as any).state.currentShape = 'square';
      // Set AI as current player
      (game as any).state.players.forEach((p: any, idx: number) => p.isCurrentTurn = idx === 1);
      (game as any).state.currentPlayerIndex = 1;
      
      // Make human draw to switch to AI turn
      const humanId = (game as any).state.players[0].id;
      game.drawCard(humanId);
      
      const result = aiPlayer.makeMove();
      expect(result.action).toBe('draw');
    });

    it('should throw error when not AI turn', () => {
      expect(() => aiPlayer.makeMove()).toThrow('AI player is not the current player');
    });
  });

  describe('AI Strategy - Avoiding Draw Cards', () => {
    it('should prefer non-draw cards over Pick Two (2)', () => {
      const aiPlayerId = (game as any).state.players[1].id;
      const aiPlayerState = game.getPlayer(aiPlayerId)!;
      aiPlayerState.hand = [
        { shape: 'circle', number: 5 },
        { shape: 'circle', number: SPECIAL_CARD_RULES.PICK_TWO }
      ];
      
      // Set top card to circle so both cards are valid
      (game as any).state.discardPile = [{ shape: 'circle', number: 3 }];
      (game as any).state.currentShape = 'circle';
      // Set AI as current player
      (game as any).state.players.forEach((p: any, idx: number) => p.isCurrentTurn = idx === 1);
      (game as any).state.currentPlayerIndex = 1;
      
      // Make human draw to switch to AI turn
      const humanId = (game as any).state.players[0].id;
      game.drawCard(humanId);
      
      const result = aiPlayer.makeMove();
      expect(result.action).toBe('play');
      expect(result.cardIndex).toBe(0); // Should choose circle 5, not Pick Two
    });

    it('should prefer non-draw cards over General Market (14)', () => {
      const aiPlayerId = (game as any).state.players[1].id;
      const aiPlayerState = game.getPlayer(aiPlayerId)!;
      aiPlayerState.hand = [
        { shape: 'triangle', number: 8 },
        { shape: 'triangle', number: SPECIAL_CARD_RULES.GENERAL_MARKET }
      ];
      
      // Set top card to triangle so both cards are valid
      (game as any).state.discardPile = [{ shape: 'triangle', number: 3 }];
      (game as any).state.currentShape = 'triangle';
      // Set AI as current player
      (game as any).state.players.forEach((p: any, idx: number) => p.isCurrentTurn = idx === 1);
      (game as any).state.currentPlayerIndex = 1;
      
      // Make human draw to switch to AI turn
      const humanId = (game as any).state.players[0].id;
      game.drawCard(humanId);
      
      const result = aiPlayer.makeMove();
      expect(result.action).toBe('play');
      expect(result.cardIndex).toBe(0); // Should choose triangle 8, not General Market
    });

    it('should play draw cards if no other options available', () => {
      const aiPlayerId = (game as any).state.players[1].id;
      const aiPlayerState = game.getPlayer(aiPlayerId)!;
      aiPlayerState.hand = [
        { shape: 'circle', number: SPECIAL_CARD_RULES.PICK_TWO }
      ];
      
      // Set top card to circle so the card is valid
      (game as any).state.discardPile = [{ shape: 'circle', number: 3 }];
      (game as any).state.currentShape = 'circle';
      // Set AI as current player
      (game as any).state.players.forEach((p: any, idx: number) => p.isCurrentTurn = idx === 1);
      (game as any).state.currentPlayerIndex = 1;
      
      // Make human draw to switch to AI turn
      const humanId = (game as any).state.players[0].id;
      game.drawCard(humanId);
      
      const result = aiPlayer.makeMove();
      expect(result.action).toBe('play');
      expect(result.cardIndex).toBe(0); // Should play Pick Two since it's the only option
    });
  });

  describe('AI Strategy - Shape Frequency', () => {
    it('should prefer cards of the most common shape', () => {
      const aiPlayerId = (game as any).state.players[1].id;
      const aiPlayerState = game.getPlayer(aiPlayerId)!;
      aiPlayerState.hand = [
        { shape: 'circle', number: 5 },
        { shape: 'triangle', number: 8 },
        { shape: 'circle', number: 10 },
        { shape: 'square', number: 3 }
      ];
      (game as any).state.discardPile = [{ shape: 'circle', number: 7 }];
      (game as any).state.currentShape = 'circle';
      (game as any).state.players.forEach((p: any, idx: number) => p.isCurrentTurn = idx === 1);
      (game as any).state.currentPlayerIndex = 1;
      
      const result = aiPlayer.makeMove();
      
      expect(result.action).toBe('play');
      // Should choose a circle card (most common shape)
      // Get the card that was actually played by checking the discard pile
      const topCard = game.getTopCard()!;
      expect(topCard.shape).toBe('circle');
    });

    it('should choose first valid card if no shape preference', () => {
      const aiPlayerId = (game as any).state.players[1].id;
      const aiPlayerState = game.getPlayer(aiPlayerId)!;
      aiPlayerState.hand = [
        { shape: 'circle', number: 5 },
        { shape: 'triangle', number: 8 }
      ];
      (game as any).state.discardPile = [{ shape: 'circle', number: 7 }];
      (game as any).state.currentShape = 'circle';
      (game as any).state.players.forEach((p: any, idx: number) => p.isCurrentTurn = idx === 1);
      (game as any).state.currentPlayerIndex = 1;
      const result = aiPlayer.makeMove();
      expect(result.action).toBe('play');
      expect(result.cardIndex).toBe(0); // Should choose first card
    });
  });

  describe('AI Strategy - WHOT Card Shape Selection', () => {
    it('should declare the most common shape when playing WHOT', () => {
      const aiPlayerId = (game as any).state.players[1].id;
      const aiPlayerState = game.getPlayer(aiPlayerId)!;
      aiPlayerState.hand = [
        { shape: 'WHOT', number: 20, isWhot: true },
        { shape: 'circle', number: 5 },
        { shape: 'triangle', number: 8 },
        { shape: 'circle', number: 10 },
        { shape: 'square', number: 3 }
      ];
      
      // Set top card to anything so WHOT is valid
      (game as any).state.discardPile = [{ shape: 'star', number: 7 }];
      (game as any).state.currentShape = 'star';
      // Set AI as current player
      (game as any).state.players.forEach((p: any, idx: number) => p.isCurrentTurn = idx === 1);
      (game as any).state.currentPlayerIndex = 1;
      
      // Make human draw to switch to AI turn
      const humanId = (game as any).state.players[0].id;
      game.drawCard(humanId);
      
      const result = aiPlayer.makeMove();
      expect(result.action).toBe('play');
      expect(result.cardIndex).toBe(0); // Should play WHOT card
      expect(result.newShape).toBe('circle'); // Should declare circle (most common)
    });

    it('should default to circle if no non-WHOT cards in hand', () => {
      const aiPlayerId = (game as any).state.players[1].id;
      const aiPlayerState = game.getPlayer(aiPlayerId)!;
      aiPlayerState.hand = [
        { shape: 'WHOT', number: 20, isWhot: true }
      ];
      
      // Set top card to anything so WHOT is valid
      (game as any).state.discardPile = [{ shape: 'star', number: 7 }];
      (game as any).state.currentShape = 'star';
      // Set AI as current player
      (game as any).state.players.forEach((p: any, idx: number) => p.isCurrentTurn = idx === 1);
      (game as any).state.currentPlayerIndex = 1;
      
      // Make human draw to switch to AI turn
      const humanId = (game as any).state.players[0].id;
      game.drawCard(humanId);
      
      const result = aiPlayer.makeMove();
      expect(result.action).toBe('play');
      expect(result.newShape).toBe('circle'); // Should default to circle
    });
  });

  describe('AI Player Information', () => {
    it('should return correct hand', () => {
      const hand = aiPlayer.getHand();
      expect(Array.isArray(hand)).toBe(true);
      expect(hand.length).toBe(5); // Initial hand size
    });

    it('should return correct name', () => {
      expect(aiPlayer.getName()).toBe('Computer');
    });

    it('should correctly identify turn status', () => {
      expect(aiPlayer.isMyTurn()).toBe(false); // Human goes first
      // Make human draw to switch to AI turn
      const humanId = (game as any).state.players[0].id;
      game.drawCard(humanId);
      // Set AI as current player
      (game as any).state.players.forEach((p: any, idx: number) => p.isCurrentTurn = idx === 1);
      (game as any).state.currentPlayerIndex = 1;
      expect(aiPlayer.isMyTurn()).toBe(true);
    });
  });
}); 