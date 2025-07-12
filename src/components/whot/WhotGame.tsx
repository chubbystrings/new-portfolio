import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { WhotGame as WhotGameLogic } from '../../games/whot/WhotGame';
import { AIPlayer } from '../../games/whot/AIPlayer';
import { CardShape } from '../../games/whot/types';
import { AIFactory, AIDifficulty } from '../../games/whot/ai/AIFactory';
import GameBoard from './GameBoard';
import PlayerHand from './PlayerHand';
import GameControls from './GameControls';
import ShapeSelector from './ShapeSelector';
import GameTimer from './GameTimer';
import { AIAvatar, HumanAvatar } from '../../assets';
import { WhotGameWrapper } from './WhotGameWrapper';
import { SPECIAL_CARD_RULES } from '../../games/whot';
import { toast } from 'react-toastify';
import { useSound } from '../../hooks/useSound';

/**
 * Main Whot game React component that manages the game UI and player interactions.
 * Handles game state, AI turns, and user interface updates for a 2-player Whot game.
 */
const WhotGame: React.FC = () => {
  // Game state management
  const [game, setGame] = useState<WhotGameLogic | null>(null);
  const [aiPlayer, setAiPlayer] = useState<AIPlayer | null>(null);

  const context = useOutletContext<{ handleBackToLists: () => void }>();

  // UI state management
  const [showStartGame, setShowStartGame] = useState(true);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | undefined>();
  const [showShapeSelector, setShowShapeSelector] = useState(false);
  const [pendingWhotCard, setPendingWhotCard] = useState<number | undefined>();
  const [gameStatus, setGameStatus] = useState('Starting game...');
  const [isHumanTurn, setIsHumanTurn] = useState(true);
  const [gameUpdateTrigger, setGameUpdateTrigger] = useState(0);
  const [aiActions, setAiActions] = useState<string>('');
  const [playerActions, setPlayerActions] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('easy');
  const [isGameRunning, setIsGameRunning] = useState(false);
  const shapeSelectorTimeoutRef = useRef<number | null>(null);
  const aiTurnRunningRef = useRef(false);

  // Sound service
  const {
    playCardPlay,
    playCardDraw,
    playWhotPlay,
    playGameStart,
    playGameWin,
    playGameLose,

    stopAll,
    stop,
    playHoldOn,
    playPickTwo,
    playGeneralMarket,
    playLastCard
  } = useSound();

  /**
   * Helper function to trigger game state updates and force re-renders.
   * Used when the game state changes but React doesn't detect the update.
   */
  const updateGameState = useCallback(() => {
    setGameUpdateTrigger(prev => prev + 1);
    // Reset AI turn running flag when game state updates
    aiTurnRunningRef.current = false;
  }, []);

  const handleAiAction = useCallback((action: string) => {
    setAiActions(action);
    setTimeout(() => {
      setAiActions('');
    }, 3000);
  }, []);

  const handlePlayerAction = useCallback((action: string) => {
    setPlayerActions(action);
    setTimeout(() => {
      setPlayerActions('');
    }, 1000);
  }, []);

  const handleTimerReset = useCallback(() => {
    setIsGameRunning(false);
  }, []);

  // Force re-render when game state changes
  useEffect(() => {
    // This effect runs when gameUpdateTrigger changes, forcing a re-render
  }, [gameUpdateTrigger]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (shapeSelectorTimeoutRef.current) {
        clearTimeout(shapeSelectorTimeoutRef.current);
        shapeSelectorTimeoutRef.current = null;
      }
    };
  }, []);

  /**
   * Initializes the game with human and AI players.
   * Sets up the initial game state and starts the first turn.
   */
  useEffect(() => {
    if (isInitialized) return; // Only run once for initial setup

    // Reset AI turn running flag
    aiTurnRunningRef.current = false;

    const newGame = new WhotGameLogic();
    newGame.addPlayer('Human');
    newGame.addPlayer('Computer');
    newGame.startGame();

    const aiPlayerId = (newGame as any).state.players[1].id;
    const aiStrategy = AIFactory.createStrategy(aiDifficulty);
    const newAiPlayer = new AIPlayer(newGame, aiPlayerId, aiStrategy);

    setGame(newGame);
    setAiPlayer(newAiPlayer);
    setIsInitialized(true);
    setIsGameRunning(true); // Start the timer

    // Check if the first card is a WHOT card and requires shape declaration
    const gameState = newGame.getGameState();
    if (gameState.awaitingShapeDeclaration && gameState.players[0].isCurrentTurn) {
      setGameStatus("First card is a WHOT! Choose a shape to start the game.");
      // Show shape selector after a short delay for better UX
      shapeSelectorTimeoutRef.current = setTimeout(() => {
        setShowShapeSelector(true);
      }, 1000);
    } else {
      setGameStatus("! Select a card to play or draw a card.");
    }
    // Play game start sound
  }, [isInitialized, aiDifficulty]);

  /**
   * Handles difficulty changes by recreating the AI player with the new strategy.
   * Only runs when difficulty changes and game is already initialized.
   */
  useEffect(() => {
    if (!isInitialized || !game) return; // Only run when game is already initialized

    const aiPlayerId = (game as any).state.players[1].id;
    const aiStrategy = AIFactory.createStrategy(aiDifficulty);
    const newAiPlayer = new AIPlayer(game, aiPlayerId, aiStrategy);

    setAiPlayer(newAiPlayer);
  }, [aiDifficulty, isInitialized, game]);

  /**
   * Handles AI turns automatically when it's the computer's turn.
   * Executes AI moves with delays for better user experience.
   */
  useEffect(() => {
    if (!game || !aiPlayer || game.isGameOver() || aiTurnRunningRef.current) return;

    // const gameState = game.getGameState();
    const currentPlayer = game.getCurrentPlayer();

    // If it's the computer's turn, trigger the AI
    if (currentPlayer && currentPlayer.name === 'Computer') {
      aiTurnRunningRef.current = true;
      setIsHumanTurn(false);
      handleAiAction('Computer is thinking...');

      const handleAITurn = async () => {
        setGameStatus("");
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
          // Double-check that it's still the computer's turn
          const currentGameState = game.getGameState();
          const currentPlayerCheck = game.getCurrentPlayer();
          if (!currentPlayerCheck || currentPlayerCheck.name !== 'Computer') {
            console.warn('AI turn cancelled - not computer turn anymore');
            aiTurnRunningRef.current = false;
            return;
          }

          // Check if AI needs to declare initial shape (first card is WHOT)
          if (currentGameState.awaitingShapeDeclaration) {
            // Clear any pending shape selector timeout
            if (shapeSelectorTimeoutRef.current) {
              clearTimeout(shapeSelectorTimeoutRef.current);
              shapeSelectorTimeoutRef.current = null;
            }

            const bestShape = aiPlayer.selectBestShape(aiPlayer.getHand());
            const success = game.declareInitialShape(bestShape);
            if (success) {
              playWhotPlay(); // Play WHOT sound for initial shape declaration
              setGameStatus(`Computer chose ${bestShape} as starting shape!`);
              handleAiAction(`Computer chose ${bestShape} as starting shape!`);
              updateGameState();

              // Switch to human turn
              setIsHumanTurn(true);
              setGameStatus("Your turn!");
              aiTurnRunningRef.current = false;
              return;
            }
          }

          const result = aiPlayer.makeMove();
          if (result.action === 'play') {
            // Check if this was the AI's last card before playing
            const computerPlayerBefore = game.getGameState().players.find(p => p.name === 'Computer');
            const wasLastCard = computerPlayerBefore && computerPlayerBefore.hand.length === 1;

            // Play appropriate sound based on card type
            if (result.cardNumber === 20) { // WHOT card
              playWhotPlay();
            } else {
              playCardPlay();
            }

            setGameStatus(`Computer played a card!`);
            handleAiAction(`Computer played a card!`);

            // Play last card sound if this was the last card
            if (wasLastCard) {
              playLastCard();
              handleAiAction(`Computer has last card!`);
              toast.info(`Computer has last card! 🤙`, {
                position: 'bottom-left',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
              });
            }

            if (isSpecialCard(result.cardNumber || 0)) {
              const message = specialCardMessage(result.cardNumber || 0);

              // Play appropriate special card sound
              const cardNumber = result.cardNumber || 0;
              if (cardNumber === SPECIAL_CARD_RULES.HOLD_ON) {
                playHoldOn();
              } else if (cardNumber === SPECIAL_CARD_RULES.PICK_TWO) {
                playPickTwo();
              } else if (cardNumber === SPECIAL_CARD_RULES.GENERAL_MARKET) {
                playGeneralMarket();
              }

              toast.info(message, {
                position: 'bottom-left',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
              });
            }
          } else {
            playCardDraw();
            setGameStatus(`Computer drew a card!`);
            handleAiAction(`Computer drew a card!`);

            // Check if draw pile is empty after computer draws
            if (game.getGameState().drawPile.length === 0) {
              game.endGameByEmptyDrawPile();
              setIsGameRunning(false);
              const winner = game.getWinner();
              setGameStatus(winner ? `${winner.name} wins!` : 'Game over!');
              handlePlayerAction(`Game over! ${winner?.name} wins!`);
              handleAiAction(`Game over! ${winner?.name} wins!`);
              toast.success(`Game over! ${winner?.name} wins!`, {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
              });
              if (winner?.name === 'Human') {
                playGameWin();
              } else {
                playGameLose();
              }
              aiTurnRunningRef.current = false;
              return;
            }
          }
          updateGameState();


          if (game.isGameOver()) {
            const winner = game.getWinner();
            setGameStatus(winner ? `${winner.name} wins!` : 'Game over!');
            setIsGameRunning(false); // Stop the timer
            if (winner?.name === 'Human') {
              playGameLose(); // Computer loses
              handlePlayerAction(`Check up, you won!`);
              toast.success(`Check up, you win!!!`, {
                position: 'bottom-right',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
              });
            } else {
              // Computer wins - this means AI played their last card
              playGameWin(); // Computer wins
              handleAiAction(`Check up, you lost!`);
              toast.error(`Check up, you lost!!!`, {
                position: 'bottom-right',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
              });
            }
            aiTurnRunningRef.current = false;
            return;
          }

          // Switch to human turn if it's now human's turn
          const nextPlayer = game.getCurrentPlayer();
          if (nextPlayer && nextPlayer.name === 'Human') {
            setIsHumanTurn(true);
            setGameStatus("Your turn!");
          }

          aiTurnRunningRef.current = false;
        } catch (error) {
          console.error('AI turn error:', error);
          setGameStatus("Error during AI turn");
          aiTurnRunningRef.current = false;
        }
      };
      handleAITurn();
    }
  }, [gameUpdateTrigger, game, aiPlayer]);


  /**
   * Handles card selection when a player clicks on a card in their hand.
   * Only allows selection of valid cards during the player's turn.
   * @param index - Index of the clicked card in the player's hand
   */
  const handleCardClick = useCallback((index: number) => {
    if (!game || !isHumanTurn) return;

    const humanPlayer = (game as any).state.players[0];
    const validPlays = game.getValidPlays(humanPlayer.id);

    if (validPlays.includes(index)) {
      setSelectedCardIndex(index);
    }
  }, [game, isHumanTurn]);

  /**
   * Handles the draw card action for the human player.
   * Draws a card and checks if the player can continue their turn.
   */
  const handleDrawCard = useCallback(() => {
    if (!game || !isHumanTurn) return;

    const humanPlayer = (game as any).state.players[0];
    const drawnCard = game.drawCard(humanPlayer.id);

    // when card is drawn check if dockpile is empty, if so, end game and declare winner as the player with the lowest hand
    if (game.getGameState().drawPile.length === 0) {
      game.endGameByEmptyDrawPile();
      const winner = game.getWinner();
      setGameStatus(winner ? `${winner.name} wins!` : 'Game over!');
      setIsGameRunning(false); // Stop the timer
      handlePlayerAction(`Game over! ${winner?.name} wins!`);
      handleAiAction(`Game over! ${winner?.name} wins!`);
      toast.success(`Game over! ${winner?.name} wins!`, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
      if (winner?.name === 'Human') {
        playGameWin();
      } else {
        playGameLose();
      }
      return;
    }

    if (drawnCard) {
      playCardDraw();
      setGameStatus("You drew a card!");
      handlePlayerAction(`You drew a card!`);
    } else {
      setGameStatus("Cannot draw card!");
      return;
    }

    // Update game state
    updateGameState();

    // Check if human can play the drawn card
    const validPlays = game.getValidPlays(humanPlayer.id);
    if (validPlays.length === 0) {
      // Human cannot play, switch to AI turn
      setIsHumanTurn(false);
    } else {
      setGameStatus("You can play the drawn card or end your turn.");
    }
  }, [game, isHumanTurn, updateGameState, handlePlayerAction, handleAiAction, playCardDraw, playGameWin, playGameLose]);

  const isSpecialCard = (cardNumber: number) => {
    return cardNumber === SPECIAL_CARD_RULES.HOLD_ON ||
      cardNumber === SPECIAL_CARD_RULES.PICK_TWO ||
      cardNumber === SPECIAL_CARD_RULES.GENERAL_MARKET;
  };

  const specialCardMessage = (cardNumber: number) => {
    if (cardNumber === SPECIAL_CARD_RULES.HOLD_ON) {
      return `Nice shot! hold on!! 😊`;
    } else if (cardNumber === SPECIAL_CARD_RULES.PICK_TWO) {
      return "Whoa double deck!! pick two!! play again 🤔";
    } else if (cardNumber === SPECIAL_CARD_RULES.GENERAL_MARKET) {
      return `Pick a card from the market!! 🤝`;
    }
    return "";
  };

  /**
   * Handles playing a selected card from the player's hand.
   * Shows shape selector for WHOT cards or plays the card directly.
   */
  const handlePlayCard = useCallback(() => {
    if (!game || !isHumanTurn || selectedCardIndex === undefined) return;

    const humanPlayer = (game as any).state.players[0];
    const card = humanPlayer.hand[selectedCardIndex];

    if (card.isWhot && humanPlayer.hand.length > 1) {
      // Show shape selector for WHOT card (only if it's not the last card)
      setPendingWhotCard(selectedCardIndex);
      setShowShapeSelector(true);
    } else {
      // Play regular card or WHOT as last card (no shape selection needed)
      const { success, canPlayAgain, cardNumber: cardNumberPlayed } = game.playCard(humanPlayer.id, selectedCardIndex);
      if (success) {
        // Play appropriate sound based on card type
        if (card.isWhot) {
          playWhotPlay();
        } else {
          playCardPlay();
        }

        // setGameStatus("Card played successfully!");
        handlePlayerAction(`You played a card!`);
        if (humanPlayer.hand.length === 1) {
          playLastCard();
          handlePlayerAction(`Last Card!!!`);
          toast.info(`Last Card!!! 🤙`, {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
          });
        }
        setSelectedCardIndex(undefined);
        updateGameState();

        // Check if draw pile is empty after playing a special card
        if (game.getGameState().drawPile.length === 0) {
          game.endGameByEmptyDrawPile();
          const winner = game.getWinner();
          setGameStatus(winner ? `${winner.name} wins!` : 'Game over!');
          setIsGameRunning(false); // Stop the timer
          handlePlayerAction(`Game over! ${winner?.name} wins!`);
          handleAiAction(`Game over! ${winner?.name} wins!`);
          toast.success(`Game over! ${winner?.name} wins!`, {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
          });
          if (winner?.name === 'Human') {
            playGameWin();
          } else {
            playGameLose();
          }
          return;
        }

        if (game.isGameOver()) {
          const winner = game.getWinner();
          setGameStatus(winner ? `${winner.name} wins!` : 'Game over!');
          setIsGameRunning(false); // Stop the timer
          if (winner?.name === 'Human') {
            playGameWin();
            handlePlayerAction(`Check up, you won!`);
            toast.success(`Check up, you win!!!`, {
              position: 'bottom-right',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
            });
          } else {
            playGameLose();
            handleAiAction(`Check up, you lost!`);
            toast.error(`Check up, you lost!!!`, {
              position: 'bottom-right',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
            });
          }
          return;
        }

        if (!canPlayAgain) {
          setIsHumanTurn(false); // Switch to AI turn
        } else {
          setGameStatus("You played a special card! Play again.");
          handlePlayerAction(`You played a special card! Play again.`);
          if (isSpecialCard(cardNumberPlayed || 0)) {
            const message = specialCardMessage(cardNumberPlayed || 0);

            // Play appropriate special card sound
            const cardNumber = cardNumberPlayed || 0;
            if (cardNumber === SPECIAL_CARD_RULES.HOLD_ON) {
              playHoldOn();
            } else if (cardNumber === SPECIAL_CARD_RULES.PICK_TWO) {
              playPickTwo();
            } else if (cardNumber === SPECIAL_CARD_RULES.GENERAL_MARKET) {
              playGeneralMarket();
            }

            toast.info(message, {
              position: 'bottom-right',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
            });
          }
        }
      } else {
        setGameStatus("Invalid play! Try again.");
      }
    }
  }, [game, isHumanTurn, selectedCardIndex, handlePlayerAction, updateGameState, playWhotPlay, playCardPlay, playLastCard, playGameWin, playGameLose, handleAiAction, playHoldOn, playPickTwo, playGeneralMarket]);

  /**
   * Handles shape selection for WHOT cards.
   * Handles both initial shape declaration and regular WHOT card shape selection.
   * @param shape - The shape selected for the WHOT card
   */
  const handleShapeSelect = useCallback((shape: CardShape) => {
    if (!game) return;

    const gameState = game.getGameState();

    // Check if this is an initial shape declaration (first card is WHOT)
    if (gameState.awaitingShapeDeclaration) {
      // Clear any pending shape selector timeout
      if (shapeSelectorTimeoutRef.current) {
        clearTimeout(shapeSelectorTimeoutRef.current);
        shapeSelectorTimeoutRef.current = null;
      }

      const success = game.declareInitialShape(shape);
      if (success) {
        setGameStatus(`Game started with ${shape} shape!`);
        setShowShapeSelector(false);
        updateGameState();
        handlePlayerAction(`Game started with ${shape} shape!`);

        // Check if it's now the computer's turn
        const updatedGameState = game.getGameState();
        if (updatedGameState.players[1].isCurrentTurn) {
          setIsHumanTurn(false);
          setGameStatus("Computer's turn!");
        } else {
          setGameStatus("Your turn!");
        }
        return;
      } else {
        setGameStatus("Error declaring initial shape. Try again.");
        return;
      }
    }

    // Regular WHOT card shape selection
    if (pendingWhotCard === undefined) return;

    const humanPlayer = (game as any).state.players[0];
    const { success, canPlayAgain, cardNumber: cardNumberPlayed } = game.playCard(humanPlayer.id, pendingWhotCard, shape);

    if (success) {
      // Play WHOT sound for human player
      playWhotPlay();

      setGameStatus(`WHOT card played with ${shape} shape!`);
      setSelectedCardIndex(undefined);
      setPendingWhotCard(undefined);
      setShowShapeSelector(false);
      updateGameState();
      if (game.getCurrentPlayer()?.name === 'Computer') {
        handleAiAction(`WHOT card played with ${shape} shape!`);
      } else {
        handlePlayerAction(`WHOT card played with ${shape} shape!`);
      }

      // Check if draw pile is empty after playing a WHOT card
      if (game.getGameState().drawPile.length === 0) {
        game.endGameByEmptyDrawPile();
        const winner = game.getWinner();
        setGameStatus(winner ? `${winner.name} wins!` : 'Game over!');
        setIsGameRunning(false); // Stop the timer
        handlePlayerAction(`Game over! ${winner?.name} wins!`);
        handleAiAction(`Game over! ${winner?.name} wins!`);
        toast.success(`Game over! ${winner?.name} wins!`, {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
        });
        if (winner?.name === 'Human') {
          playGameWin();
        } else {
          playGameLose();
        }
        return;
      }

      if (game.isGameOver()) {
        const winner = game.getWinner();
        setGameStatus(winner ? `${winner.name} wins!` : 'Game over!');
        setIsGameRunning(false); // Stop the timer
        if (winner?.name === 'Human') {
          handlePlayerAction(`I won!`);
        } else {
          handleAiAction(`I won!`);
        }
        return;
      }

      // check if card is remaining only one in the hand, if so, play last card
      if (humanPlayer.hand.length === 1) {
        playLastCard();
        handlePlayerAction(`Last Card!!!`);
        toast.info(`Last Card!!! 🤙`, {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }

      if (!canPlayAgain) {
        setIsHumanTurn(false); // Switch to AI turn
      } else {
        setGameStatus("You played a special card! Play again.");
        handlePlayerAction(`You played a special card! Play again.`);
        if (isSpecialCard(cardNumberPlayed || 0)) {
          const message = specialCardMessage(cardNumberPlayed || 0);
          toast.info(message, {
            position: isHumanTurn ? 'bottom-left' : 'bottom-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
          });
        }
      }
    } else {
      setGameStatus("Invalid play! Try again.");
      setShowShapeSelector(false);
    }
  }, [game, pendingWhotCard, isHumanTurn, updateGameState, handlePlayerAction, handleAiAction, playWhotPlay, playLastCard]);

  /**
 * Starts a new game by resetting all state and creating new game instances.
 */
  const handleNewGame = useCallback(() => {
    // Clear any pending shape selector timeout
    if (shapeSelectorTimeoutRef.current) {
      clearTimeout(shapeSelectorTimeoutRef.current);
      shapeSelectorTimeoutRef.current = null;
    }

    // Reset AI turn running flag
    aiTurnRunningRef.current = false;

    // Ensure timer is stopped before starting new game
    setIsGameRunning(false);

    const newGame = new WhotGameLogic();
    newGame.addPlayer('Human');
    newGame.addPlayer('Computer');
    newGame.startGame();

    const aiPlayerId = (newGame as any).state.players[1].id;
    const aiStrategy = AIFactory.createStrategy(aiDifficulty);
    const newAiPlayer = new AIPlayer(newGame, aiPlayerId, aiStrategy);

    setGame(newGame);
    setAiPlayer(newAiPlayer);
    setSelectedCardIndex(undefined);
    setShowShapeSelector(false);
    setPendingWhotCard(undefined);
    setIsHumanTurn(true);
    setIsInitialized(true); // Keep initialized state for new game

    // Start the timer for new game with a small delay to ensure reset
    setTimeout(() => {
      setIsGameRunning(true);
    }, 50);

    // Check if the first card is a WHOT card and requires shape declaration
    const gameState = newGame.getGameState();
    if (gameState.awaitingShapeDeclaration && gameState.players[0].isCurrentTurn) {
      setGameStatus("First card is a WHOT! Choose a shape to start the game.");
      // Show shape selector after a short delay for better UX
      shapeSelectorTimeoutRef.current = setTimeout(() => {
        setShowShapeSelector(true);
      }, 1000);
    } else {
      setGameStatus("New game started! Your turn!");
    }
  }, [aiDifficulty]);

  // Show loading state while game initializes
  if (!game) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading game...</div>
      </div>
    );
  }

  // Get current game state for rendering
  const gameState = game.getGameState();
  const humanPlayer = gameState.players[0];
  const computerPlayer = gameState.players[1];
  const topCard = game.getTopCard();
  const currentPlayer = game.getCurrentPlayer();

  return (
    <WhotGameWrapper>

      {
        showStartGame && (
          <div className="flex w-full justify-center h-full my-auto" >
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="text-center">
                <h2 className="text-2xl game-text-font font-bold mb-4">Choose AI Difficulty</h2>
                <div className="flex flex-col gap-3 justify-center items-center">
                  {AIFactory.getAvailableDifficulties().map((difficulty) => (
                    <button
                      key={difficulty.value}
                      className={`p-4 rounded-lg border-2 transition-all max-w-[450px] ${aiDifficulty === difficulty.value
                        ? 'border-game bg-light text-game'
                        : 'border-gray-300 hover:border-gray-400'
                        }`}
                      onClick={() => setAiDifficulty(difficulty.value)}
                    >
                      <div className="font-semibold game-text-font">{difficulty.name}</div>
                      <div className="text-xs game-text-font">{difficulty.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-class lg" onClick={() => {
                  context.handleBackToLists();
                }}>
                  Back to Lists
                </button>

              <button
                className="btn-class lg w-[250px] lg:w-auto success"
                onClick={() => {
                  setShowStartGame(false);
                  playGameStart();
                }}
              >
                Start Game
              </button>
              </div>
            </div>
          </div>
        )
      }
      {
        !showStartGame && (
          <>
            <div className="flex w-full justify-center flex-col items-center gap-4">
              <GameTimer
                isRunning={isGameRunning}
                onReset={handleTimerReset}
              />
              <GameControls
                onDrawCard={handleDrawCard}
                onPlayCard={handlePlayCard}
                canDraw={isHumanTurn && !game.isGameOver()}
                canPlay={isHumanTurn && !game.isGameOver()}
                selectedCardIndex={selectedCardIndex}
                drawPileCount={gameState.drawPile.length}
                aiActions={aiActions}
                playerActions={playerActions}
              />
            </div>
            <div className="board-container">
              {/* Computer's Hand (left) */}
              <div className="board-item">
                <div className="w-full flex flex-col items-center gap-2">
                  <AIAvatar />
                  <div className="text-center">
                    {/* <div className="text-sm font-semibold">Computer</div> */}
                    <div className="text-xs text-gray-500">{aiPlayer?.getStrategyName()} AI</div>
                  </div>
                  <PlayerHand
                    cards={computerPlayer.hand.map(() => ({ shape: 'WHOT', number: 20, isWhot: true }))}
                    disabled
                    title={`Computer's Hand (${computerPlayer.hand.length} cards)`}
                    className="opacity-75"
                    vertical
                    showTitle={false}
                  />
                </div>
              </div>

              {/* Game Board and Controls (center) */}
              <div className="board-item-center">
                <GameBoard
                  topCard={topCard}
                  drawPileCount={gameState.drawPile.length}
                  currentShape={gameState.currentShape || undefined}
                  currentPlayer={currentPlayer?.name || 'Unknown'}
                  gameStatus={gameStatus}
                />

                {/* New Game Button */}
                {game.isGameOver() && (
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        game.resetGame();
                        setShowStartGame(true);
                        setIsInitialized(false);
                        setGame(null);
                        setAiPlayer(null);
                        setSelectedCardIndex(undefined);
                        setShowShapeSelector(false);
                        setPendingWhotCard(undefined);
                        setIsHumanTurn(true);
                        setIsGameRunning(false); // Stop the timer
                        stopAll();
                        stop('gameStart'); // Specifically stop game start music
                      }}
                      className="btn-class"
                    >
                      Go to Start Game
                    </button>
                    <button
                      onClick={handleNewGame}
                      className="btn-class"
                    >
                      New Game
                    </button>
                  </div>
                )}
                {
                  !game.isGameOver() && (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          game.resetGame();
                          setShowStartGame(true);
                          setIsInitialized(false);
                          setGame(null);
                          setAiPlayer(null);
                          setSelectedCardIndex(undefined);
                          setShowShapeSelector(false);
                          setPendingWhotCard(undefined);
                          setIsHumanTurn(true);
                          setIsGameRunning(false); // Stop the timer
                          stopAll();
                          stop('gameStart'); // Specifically stop game start music
                        }}
                        className="btn-class"
                      >
                        End Game
                      </button>
                      <button
                        onClick={() => {
                          game.resetGame();
                          setIsGameRunning(false); // Stop the timer
                          stopAll();
                          stop('gameStart');
                          handleNewGame();
                        }}
                        className="btn-class"
                      >
                        Restart Game
                      </button>
                    </div>
                  )
                }
              </div>

              {/* Human's Hand (right) */}
              <div className="board-item">
                <div className="w-full flex flex-col items-center gap-2">
                  <HumanAvatar />
                  <div className="text-center">
                    {/* <div className="text-sm font-semibold">Computer</div> */}
                    <div className="text-xs text-gray-500">Human</div>
                  </div>
                  <PlayerHand
                    cards={humanPlayer.hand}
                    onCardClick={handleCardClick}
                    disabled={!isHumanTurn || game.isGameOver()}
                    selectedCardIndex={selectedCardIndex}
                    title="Your Hand"
                    vertical
                  />
                </div>
              </div>

              {/* Shape Selector Modal (overlay) */}
              <ShapeSelector
                onShapeSelect={handleShapeSelect}
                isVisible={showShapeSelector}
                isInitialDeclaration={gameState.awaitingShapeDeclaration}
              />
            </div>
          </>
        )
      }
    </WhotGameWrapper>
  );
};

export default WhotGame; 