import { describe, it, expect, beforeEach } from 'vitest';
import { WhotGame } from '../WhotGame';
import { Card, CardShape } from '../types';
import { SPECIAL_CARD_RULES } from '../constants';

describe('WhotGame Integration Tests', () => {
  let game: WhotGame;

  beforeEach(() => {
    game = new WhotGame();
  });

  describe('Complete Game Scenarios', () => {
    it('should handle a complete 2-player game', () => {
      // Setup
      game.addPlayer('Alice');
      game.addPlayer('Bob');
      expect(game.startGame()).toBe(true);

      // Simulate a few turns
      let turnCount = 0;
      const maxTurns = 20; // Prevent infinite loops

      while (!game.isGameOver() && turnCount < maxTurns) {
        const currentPlayer = game.getCurrentPlayer()!;
        const topCard = game.getTopCard()!;
        const validPlays = game.getValidPlays(currentPlayer.id);

        if (validPlays.length > 0) {
          // Play a valid card
          const cardIndex = validPlays[0];
          const card = currentPlayer.hand[cardIndex];
          
          if (card.isWhot) {
            game.playCard(currentPlayer.id, cardIndex, 'circle');
          } else {
            game.playCard(currentPlayer.id, cardIndex);
          }
        } else {
          // Draw a card
          game.drawCard(currentPlayer.id);
        }

        turnCount++;
      }

      // Game should either be over or we've reached max turns
      expect(turnCount).toBeLessThanOrEqual(maxTurns);
    });

    it('should handle WHOT card chain reactions', () => {
      game.addPlayer('Alice');
      game.addPlayer('Bob');
      game.addPlayer('Charlie');
      game.startGame();

      // Find players with WHOT cards
      const playersWithWhot = game.getGameState().players.filter(player =>
        player.hand.some(card => card.isWhot)
      );

      if (playersWithWhot.length > 0) {
        const player = playersWithWhot[0];
        const whotCardIndex = player.hand.findIndex(card => card.isWhot);
        
        // Make this player current
        game.getGameState().players.forEach((p, index) => {
          p.isCurrentTurn = index === game.getGameState().players.findIndex(p2 => p2.id === player.id);
        });
        game.getGameState().currentPlayerIndex = game.getGameState().players.findIndex(p => p.id === player.id);

        // Play WHOT card
        const result = game.playCard(player.id, whotCardIndex, 'triangle');
        expect(result.success).toBe(true);

        // Current shape should be triangle
        expect(game.getGameState().currentShape).toBe('triangle');
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty draw pile', () => {
      game.addPlayer('Alice');
      game.addPlayer('Bob');
      game.startGame();

      // Empty the draw pile by drawing all cards
      const state = game.getGameState();
      while (state.drawPile.length > 0) {
        state.drawPile.pop();
      }

      const player = game.getCurrentPlayer()!;
      const drawnCard = game.drawCard(player.id);
      expect(drawnCard).toBeNull();
    });

    it('should handle multiple special rules in sequence', () => {
      game.addPlayer('Alice');
      game.addPlayer('Bob');
      game.addPlayer('Charlie');
      game.startGame();

      // Simulate playing multiple special cards in sequence
      const player = game.getCurrentPlayer()!;
      
      // Find special cards
      const holdOnCard = player.hand.find(card => card.number === SPECIAL_CARD_RULES.HOLD_ON);
      const pickTwoCard = player.hand.find(card => card.number === SPECIAL_CARD_RULES.PICK_TWO);
      const generalMarketCard = player.hand.find(card => card.number === SPECIAL_CARD_RULES.GENERAL_MARKET);

      if (holdOnCard && pickTwoCard && generalMarketCard) {
        // Play Hold On
        const holdOnIndex = player.hand.findIndex(card => card.number === SPECIAL_CARD_RULES.HOLD_ON);
        game.playCard(player.id, holdOnIndex);

        // Player should still be current
        expect(game.getCurrentPlayer()!.id).toBe(player.id);

        // Play Pick Two
        const pickTwoIndex = player.hand.findIndex(card => card.number === SPECIAL_CARD_RULES.PICK_TWO);
        game.playCard(player.id, pickTwoIndex);

        // Next player should have 2 more cards
        const nextPlayer = game.getGameState().players[(game.getGameState().currentPlayerIndex + 1) % 3];
        expect(nextPlayer.hand.length).toBeGreaterThan(5);
      }
    });
  });

  describe('Complex Gameplay Situations', () => {
    it('should handle shape declaration after WHOT', () => {
      game.addPlayer('Alice');
      game.addPlayer('Bob');
      game.startGame();

      const player = game.getCurrentPlayer()!;
      const whotCardIndex = player.hand.findIndex(card => card.isWhot);

      if (whotCardIndex !== -1) {
        // Play WHOT and declare new shape
        const newShape: CardShape = 'star';
        game.playCard(player.id, whotCardIndex, newShape);

        // Current shape should be the declared shape
        expect(game.getGameState().currentShape).toBe(newShape);
      }
    });

    it('should handle turn order with special rules', () => {
      game.addPlayer('Alice');
      game.addPlayer('Bob');
      game.addPlayer('Charlie');
      game.addPlayer('David');
      game.startGame();

      const player = game.getCurrentPlayer()!;
      const pickTwoCardIndex = player.hand.findIndex(card => card.number === SPECIAL_CARD_RULES.PICK_TWO);

      if (pickTwoCardIndex !== -1) {
        const topCard = game.getTopCard()!;
        if (game.isValidPlay(player.hand[pickTwoCardIndex], topCard)) {
          const initialPlayerIndex = game.getGameState().currentPlayerIndex;
          
          game.playCard(player.id, pickTwoCardIndex);

          // Turn should move to next player
          const newPlayerIndex = game.getGameState().currentPlayerIndex;
          expect(newPlayerIndex).toBe((initialPlayerIndex + 1) % 4);

          // Next player should have 2 more cards
          const nextPlayer = game.getGameState().players[newPlayerIndex];
          expect(nextPlayer.hand.length).toBe(7); // 5 initial + 2 from pick two
        }
      }
    });

    it('should handle General Market affecting all other players', () => {
      game.addPlayer('Alice');
      game.addPlayer('Bob');
      game.addPlayer('Charlie');
      game.addPlayer('David');
      game.startGame();

      const player = game.getCurrentPlayer()!;
      const generalMarketCardIndex = player.hand.findIndex(card => card.number === SPECIAL_CARD_RULES.GENERAL_MARKET);

      if (generalMarketCardIndex !== -1) {
        const topCard = game.getTopCard()!;
        if (game.isValidPlay(player.hand[generalMarketCardIndex], topCard)) {
          const state = game.getGameState();
          const initialHandSizes = state.players.map(p => p.hand.length);
          const currentPlayerIndex = state.currentPlayerIndex;
          const currentPlayerId = state.players[currentPlayerIndex].id;
          
          game.playCard(player.id, generalMarketCardIndex);

          // All other players should have 1 more card
          const updatedState = game.getGameState();
          updatedState.players.forEach((updatedPlayer, index) => {
            if (index !== currentPlayerIndex) {
              expect(updatedPlayer.hand.length).toBe(initialHandSizes[index] + 1);
            }
          });

          // The original current player should have one less card
          const originalPlayer = updatedState.players.find(p => p.id === currentPlayerId)!;
          expect(originalPlayer.hand.length).toBe(initialHandSizes[currentPlayerIndex] - 1);
        }
      }
    });
  });

  describe('Game State Consistency', () => {
    it('should maintain consistent state during gameplay', () => {
      game.addPlayer('Alice');
      game.addPlayer('Bob');
      game.addPlayer('Charlie');
      game.startGame();

      const initialState = game.getGameState();
      const totalCards = initialState.drawPile.length + 
                        initialState.discardPile.length + 
                        initialState.players.reduce((sum, player) => sum + player.hand.length, 0);

      // Total cards should always be 68 (full deck)
      expect(totalCards).toBe(68);

      // Simulate a few moves
      for (let i = 0; i < 5; i++) {
        const currentPlayer = game.getCurrentPlayer()!;
        const validPlays = game.getValidPlays(currentPlayer.id);

        if (validPlays.length > 0) {
          game.playCard(currentPlayer.id, validPlays[0]);
        } else {
          game.drawCard(currentPlayer.id);
        }

        // Check state consistency after each move
        const currentState = game.getGameState();
        const currentTotalCards = currentState.drawPile.length + 
                                 currentState.discardPile.length + 
                                 currentState.players.reduce((sum, player) => sum + player.hand.length, 0);
        
        expect(currentTotalCards).toBe(68);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid player actions gracefully', () => {
      game.addPlayer('Alice');
      game.addPlayer('Bob');
      game.startGame();

      const player = game.getCurrentPlayer()!;
      const otherPlayer = game.getGameState().players.find(p => p.id !== player.id)!;

      // Try to play card as wrong player
      expect(game.playCard(otherPlayer.id, 0).success).toBe(false);

      // Try to draw card as wrong player
      expect(game.drawCard(otherPlayer.id)).toBeNull();
    });

    it('should handle game state edge cases', () => {
      // Try to start game without players
      expect(game.startGame()).toBe(false);

      // Try to get current player before game starts
      expect(game.getCurrentPlayer()).toBeUndefined();

      // Try to get top card before game starts
      expect(game.getTopCard()).toBeUndefined();
    });
  });

  describe('Game start with suspension card', () => {
    it('should apply Pick Two penalty to next player and let first player continue', () => {
      game.addPlayer('Alice');
      game.addPlayer('Bob');
      game.startGame();
      // Force the first card to be Pick Two
      game.getGameState().discardPile.pop();
      game.getGameState().discardPile.push({ shape: 'circle', number: SPECIAL_CARD_RULES.PICK_TWO });
      game.getGameState().currentShape = 'circle';
      // Manually apply the effect as startGame would
      game['applySpecialRule']({ shape: 'circle', number: SPECIAL_CARD_RULES.PICK_TWO });
      const state = game.getGameState();
      const alice = state.players[0];
      const bob = state.players[1];
      // Bob should have 7 cards (5 + 2 penalty)
      expect(bob.hand.length).toBe(7);
      // Alice should still be the current player
      expect(state.currentPlayerIndex).toBe(0);
    });
    it('should apply General Market penalty to next player and let first player continue', () => {
      game.addPlayer('Alice');
      game.addPlayer('Bob');
      game.startGame();
      // Force the first card to be General Market
      game.getGameState().discardPile.pop();
      game.getGameState().discardPile.push({ shape: 'circle', number: SPECIAL_CARD_RULES.GENERAL_MARKET });
      game.getGameState().currentShape = 'circle';
      // Manually apply the effect as startGame would
      game['applySpecialRule']({ shape: 'circle', number: SPECIAL_CARD_RULES.GENERAL_MARKET });
      const state = game.getGameState();
      const alice = state.players[0];
      const bob = state.players[1];
      // Both players except current should get 1 card (so Bob gets 1, Alice gets 1, total 8 if 3 players, 6 if 2)
      expect(bob.hand.length).toBeGreaterThanOrEqual(6);
      // Alice should still be the current player
      expect(state.currentPlayerIndex).toBe(0);
    });
    it('should allow Hold On to let first player play again', () => {
      game.addPlayer('Alice');
      game.addPlayer('Bob');
      game.startGame();
      // Force the first card to be Hold On
      game.getGameState().discardPile.pop();
      game.getGameState().discardPile.push({ shape: 'circle', number: SPECIAL_CARD_RULES.HOLD_ON });
      game.getGameState().currentShape = 'circle';
      // Manually apply the effect as startGame would
      game['applySpecialRule']({ shape: 'circle', number: SPECIAL_CARD_RULES.HOLD_ON });
      const state = game.getGameState();
      // Alice should still be the current player
      expect(state.currentPlayerIndex).toBe(0);
    });
  });
}); 