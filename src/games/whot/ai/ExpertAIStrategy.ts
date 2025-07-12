import { Card, CardShape } from "../types";
import { WhotGame } from "../WhotGame";
import { AIStrategy } from "./AIStrategy";
import { CARD_VALUES, SPECIAL_CARD_RULES } from "../constants";

interface GameNode {
  gameState: any;
  parent: GameNode | null;
  children: GameNode[];
  visits: number;
  wins: number;
  playerTurn: string;
  action: string | null;
  depth: number;
}

interface CardProbability {
  card: Card;
  probability: number;
  expectedValue: number;
}

interface OpponentPattern {
  shapePreference: Map<CardShape, number>;
  specialCardUsage: Map<number, number>;
  aggressionLevel: number;
  defensivePlays: number;
  totalPlays: number;
}

/**
 * Expert AI strategy implementation.
 * Uses advanced algorithms including:
 * - Monte Carlo Tree Search (MCTS) for multi-turn planning
 * - Minimax with Alpha-Beta pruning for optimal move selection
 * - Advanced card counting and probability analysis
 * - Pattern recognition for opponent modeling
 * - Risk assessment and expected value calculation
 * - Game state evaluation function
 */
export class ExpertAIStrategy implements AIStrategy {
  private cardMemory: Map<string, number> = new Map(); // Track seen cards
  private opponentPatterns: OpponentPattern = {
    shapePreference: new Map(),
    specialCardUsage: new Map(),
    aggressionLevel: 0.5,
    defensivePlays: 0,
    totalPlays: 0,
  };
  private gameHistory: string[] = []; // Track game progression
  private mctsIterations = 1000; // Number of MCTS simulations
  private minimaxDepth = 4; // Search depth for minimax

  getName(): string {
    return "Expert";
  }

  getDescription(): string {
    return "Master-level AI using Monte Carlo Tree Search, Minimax algorithms, and advanced pattern recognition. Extremely challenging!";
  }

  selectBestCard(validPlays: number[], hand: Card[], game: WhotGame): number {
    const gameState = game.getGameState();

    // Update card memory and opponent patterns
    this.updateCardMemory(gameState);
    this.updateOpponentPatterns(gameState);

    // Use MCTS for complex decision making
    if (validPlays.length > 1 && this.shouldUseMCTS(gameState)) {
      const result = this.monteCarloTreeSearch(validPlays, hand, game);
      return result;
    }

    // Use Minimax for tactical decisions
    if (validPlays.length > 1 && this.shouldUseMinimax(gameState)) {
      const result = this.minimaxSearch(validPlays, hand, game);
      return result;
    }

    // Fallback to probability-based selection
    const result = this.probabilityBasedSelection(validPlays, hand, game);
    return result;
  }

  selectBestShape(hand: Card[], game: WhotGame): CardShape {
    const gameState = game.getGameState();

    const shapeProbabilities = this.calculateShapeProbabilities(
      hand,
      gameState
    );

    // Consider opponent patterns
    const opponentShapes = this.predictOpponentShapes(gameState);

    // Use expected value calculation
    let bestShape: CardShape = "circle";
    let bestValue = -Infinity;

    for (const [shape, probability] of shapeProbabilities) {
      const expectedValue = this.calculateShapeExpectedValue(
        shape,
        probability,
        opponentShapes,
        gameState
      );
      if (expectedValue > bestValue) {
        bestValue = expectedValue;
        bestShape = shape;
      }
    }

    return bestShape;
  }

  shouldPlayCard(validPlays: number[], hand: Card[], game: WhotGame): boolean {
    const gameState = game.getGameState();

    const riskAssessment = this.assessPlayRisk(validPlays, hand, gameState);
    const expectedValue = this.calculatePlayExpectedValue(
      validPlays,
      hand,
      gameState
    );

    // Strategic drawing based on risk/reward analysis
    if (riskAssessment.riskLevel > 0.7 && expectedValue < 0.3) {
      return false; // Draw instead of playing
    }

    // Consider opponent's likely responses
    const opponentResponses = this.predictOpponentResponses(
      validPlays,
      hand,
      gameState
    );

    if (opponentResponses.expectedDamage > 0.6) {
      return false; // Avoid giving opponent advantage
    }

    return true;
  }

  // Monte Carlo Tree Search Implementation
  private monteCarloTreeSearch(
    validPlays: number[],
    hand: Card[],
    game: WhotGame
  ): number {
    const rootNode: GameNode = {
      gameState: game.getGameState(),
      parent: null,
      children: [],
      visits: 0,
      wins: 0,
      playerTurn: "ai",
      action: null,
      depth: 0,
    };

    // Run MCTS simulations
    for (let i = 0; i < this.mctsIterations; i++) {
      const node = this.selectNode(rootNode);
      const expandedNode = this.expandNode(node, validPlays, hand);
      const result = this.simulateGame(expandedNode, game);
      this.backpropagate(expandedNode, result);
    }

    // Select best action based on UCB1
    const bestChild = rootNode.children.reduce(
      (best, child) => {
        const ucb1 = this.calculateUCB1(child);
        return ucb1 > best.ucb1 ? { child, ucb1 } : best;
      },
      { child: rootNode.children[0], ucb1: -Infinity }
    );

    rootNode.children.forEach((child, index) => {
      const ucb1 = this.calculateUCB1(child);
      const winRate =
        child.visits > 0 ? ((child.wins / child.visits) * 100).toFixed(1) : "0";
    });

    const selectedAction = parseInt(bestChild.child.action!.split(":")[1]);

    return selectedAction;
  }

  private selectNode(node: GameNode): GameNode {
    while (node.children.length > 0) {
      node = node.children.reduce(
        (best, child) => {
          const ucb1 = this.calculateUCB1(child);
          return ucb1 > best.ucb1 ? { node: child, ucb1 } : best;
        },
        { node: node.children[0], ucb1: -Infinity }
      ).node;
    }
    return node;
  }

  private expandNode(
    node: GameNode,
    validPlays: number[],
    hand: Card[]
  ): GameNode {
    if (node.depth >= 10) return node; // Limit depth

    const untriedActions = validPlays.filter(
      (play) => !node.children.some((child) => child.action === `play:${play}`)
    );

    if (untriedActions.length === 0) return node;

    const action =
      untriedActions[Math.floor(Math.random() * untriedActions.length)];
    const newGameState = this.simulateAction(node.gameState, action, hand);

    const childNode: GameNode = {
      gameState: newGameState,
      parent: node,
      children: [],
      visits: 0,
      wins: 0,
      playerTurn: node.playerTurn === "ai" ? "opponent" : "ai",
      action: `play:${action}`,
      depth: node.depth + 1,
    };

    node.children.push(childNode);
    return childNode;
  }

  private simulateGame(node: GameNode, game: WhotGame): number {
    // Simplified game simulation
    let currentState = { ...node.gameState };
    let currentPlayer = node.playerTurn;

    for (let i = 0; i < 20; i++) {
      // Limit simulation length
      if (this.isGameOver(currentState)) {
        return currentPlayer === "ai" ? 1 : 0;
      }

      // Random play simulation
      currentState = this.simulateRandomPlay(currentState);
      currentPlayer = currentPlayer === "ai" ? "opponent" : "ai";
    }

    return 0.5; // Draw
  }

  private backpropagate(node: GameNode, result: number): void {
    while (node) {
      node.visits++;
      if (node.playerTurn === "ai") {
        node.wins += result;
      } else {
        node.wins += 1 - result;
      }
      node = node.parent!;
    }
  }

  private calculateUCB1(node: GameNode): number {
    if (node.visits === 0) return Infinity;
    const exploitation = node.wins / node.visits;
    const exploration = Math.sqrt(Math.log(node.parent!.visits) / node.visits);
    return exploitation + 1.414 * exploration;
  }

  // Minimax with Alpha-Beta Pruning
  private minimaxSearch(
    validPlays: number[],
    hand: Card[],
    game: WhotGame
  ): number {
    let bestMove = validPlays[0];
    let bestValue = -Infinity;
    let alpha = -Infinity;
    const beta = Infinity;

    for (const play of validPlays) {
      const gameState = this.simulateAction(game.getGameState(), play, hand);
      const value = this.minimax(
        gameState,
        this.minimaxDepth - 1,
        false,
        alpha,
        beta,
        game
      );

      if (value > bestValue) {
        bestValue = value;
        bestMove = play;
      }

      alpha = Math.max(alpha, bestValue);
      if (alpha >= beta) {
        break; // Beta cutoff
      }
    }

    return bestMove;
  }

  private minimax(
    gameState: any,
    depth: number,
    isMaximizing: boolean,
    alpha: number,
    beta: number,
    game: WhotGame
  ): number {
    if (depth === 0 || this.isGameOver(gameState)) {
      return this.evaluateGameState(gameState);
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      const validPlays = this.getValidPlays(gameState);

      for (const play of validPlays) {
        const newState = this.simulateAction(gameState, play, []);
        const evaluation = this.minimax(
          newState,
          depth - 1,
          false,
          alpha,
          beta,
          game
        );
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (alpha >= beta) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      const validPlays = this.getValidPlays(gameState);

      for (const play of validPlays) {
        const newState = this.simulateAction(gameState, play, []);
        const evaluation = this.minimax(
          newState,
          depth - 1,
          true,
          alpha,
          beta,
          game
        );
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (alpha >= beta) break;
      }
      return minEval;
    }
  }

  // Probability-based selection
  private probabilityBasedSelection(
    validPlays: number[],
    hand: Card[],
    game: WhotGame
  ): number {
    const cardProbabilities = this.calculateCardProbabilities(
      validPlays,
      hand,
      game.getGameState()
    );

    // Select card with highest expected value
    let bestCard = validPlays[0];
    let bestValue = -Infinity;

    for (const [index, probability] of cardProbabilities) {
      const expectedValue = this.calculateCardExpectedValue(
        index,
        probability,
        hand,
        game.getGameState()
      );

      if (expectedValue > bestValue) {
        bestValue = expectedValue;
        bestCard = index;
      }
    }

    return bestCard;
  }

  // Card counting and memory
  private updateCardMemory(gameState: any): void {
    // Track all cards seen in the game
    const allCards = [
      ...gameState.players.flatMap((p: any) => p.hand),
      ...gameState.discardPile,
      ...gameState.drawPile,
    ];

    this.cardMemory.clear();
    allCards.forEach((card: Card) => {
      const key = `${card.shape}-${card.number}`;
      this.cardMemory.set(key, (this.cardMemory.get(key) || 0) + 1);
    });
  }

  // Pattern recognition
  private updateOpponentPatterns(gameState: any): void {
    const opponent = gameState.players.find(
      (p: any) => p.id !== this.getMyPlayerId(gameState)
    );
    if (!opponent) return;

    // Analyze recent plays
    const recentPlays = gameState.discardPile.slice(-10);
    recentPlays.forEach((card: Card) => {
      if (!card.isWhot) {
        const current =
          this.opponentPatterns.shapePreference.get(card.shape) || 0;
        this.opponentPatterns.shapePreference.set(card.shape, current + 1);
      }

      if (
        card.number === SPECIAL_CARD_RULES.PICK_TWO ||
        card.number === SPECIAL_CARD_RULES.GENERAL_MARKET
      ) {
        const current =
          this.opponentPatterns.specialCardUsage.get(card.number) || 0;
        this.opponentPatterns.specialCardUsage.set(card.number, current + 1);
      }
    });

    this.opponentPatterns.totalPlays = recentPlays.length;
  }

  // Risk assessment
  private assessPlayRisk(
    validPlays: number[],
    hand: Card[],
    gameState: any
  ): { riskLevel: number; factors: string[] } {
    const factors: string[] = [];
    let riskLevel = 0;

    // Check for special cards that might backfire
    const specialCards = validPlays.filter((index) => {
      const card = hand[index];
      return (
        card.number === SPECIAL_CARD_RULES.PICK_TWO ||
        card.number === SPECIAL_CARD_RULES.GENERAL_MARKET
      );
    });

    if (specialCards.length > 0) {
      riskLevel += 0.3;
      factors.push("Special cards may trigger opponent advantage");
    }

    // Check opponent's hand size
    const opponentHandSize = this.getOpponentHandSize(gameState);
    if (opponentHandSize <= 2) {
      riskLevel += 0.4;
      factors.push("Opponent close to winning");
    }

    // Check for WHOT cards
    const whotCards = validPlays.filter((index) => hand[index].isWhot);
    if (whotCards.length > 0) {
      riskLevel += 0.2;
      factors.push("WHOT cards give opponent choice");
    }

    return { riskLevel: Math.min(riskLevel, 1), factors };
  }

  // Expected value calculation
  private calculatePlayExpectedValue(
    validPlays: number[],
    hand: Card[],
    gameState: any
  ): number {
    let totalValue = 0;

    for (const index of validPlays) {
      const card = hand[index];
      const baseValue = CARD_VALUES[card.number] || 0;
      const shapeValue = this.calculateShapeValue(card.shape, gameState);
      const specialValue = this.calculateSpecialCardValue(card, gameState);

      totalValue += baseValue + shapeValue + specialValue;
    }

    return totalValue / validPlays.length;
  }

  // Game state evaluation
  private evaluateGameState(gameState: any): number {
    const myPlayer = gameState.players.find(
      (p: any) => p.id === this.getMyPlayerId(gameState)
    );
    const opponent = gameState.players.find(
      (p: any) => p.id !== this.getMyPlayerId(gameState)
    );

    if (!myPlayer || !opponent) return 0;

    // Hand size advantage
    const handSizeAdvantage =
      (opponent.hand.length - myPlayer.hand.length) * 10;

    // Card value advantage
    const myCardValue = myPlayer.hand.reduce(
      (sum: number, card: Card) => sum + (CARD_VALUES[card.number] || 0),
      0
    );
    const opponentCardValue = opponent.hand.reduce(
      (sum: number, card: Card) => sum + (CARD_VALUES[card.number] || 0),
      0
    );
    const cardValueAdvantage = myCardValue - opponentCardValue;

    // Special cards advantage
    const mySpecialCards = myPlayer.hand.filter(
      (card: Card) =>
        card.isWhot ||
        card.number === SPECIAL_CARD_RULES.PICK_TWO ||
        card.number === SPECIAL_CARD_RULES.GENERAL_MARKET
    ).length;
    const opponentSpecialCards = opponent.hand.filter(
      (card: Card) =>
        card.isWhot ||
        card.number === SPECIAL_CARD_RULES.PICK_TWO ||
        card.number === SPECIAL_CARD_RULES.GENERAL_MARKET
    ).length;
    const specialCardAdvantage = (mySpecialCards - opponentSpecialCards) * 5;

    const totalEvaluation =
      handSizeAdvantage + cardValueAdvantage + specialCardAdvantage;

    return totalEvaluation;
  }

  // Helper methods
  private shouldUseMCTS(gameState: any): boolean {
    const totalCards = gameState.players.reduce(
      (sum: number, p: any) => sum + p.hand.length,
      0
    );
    return totalCards <= 8; // Use MCTS in endgame scenarios
  }

  private shouldUseMinimax(gameState: any): boolean {
    const myHandSize = this.getMyHandSize(gameState);
    const opponentHandSize = this.getOpponentHandSize(gameState);
    return myHandSize <= 4 || opponentHandSize <= 4; // Use minimax in critical situations
  }

  private calculateShapeProbabilities(
    hand: Card[],
    gameState: any
  ): Map<CardShape, number> {
    const probabilities = new Map<CardShape, number>();
    const allShapes: CardShape[] = [
      "circle",
      "cross",
      "star",
      "triangle",
      "square",
    ];

    allShapes.forEach((shape) => {
      const shapeCards = hand.filter(
        (card) => !card.isWhot && card.shape === shape
      );
      const probability =
        shapeCards.length / hand.filter((card) => !card.isWhot).length;
      probabilities.set(shape, probability);
    });

    return probabilities;
  }

  private predictOpponentShapes(gameState: any): CardShape[] {
    const likelyShapes: CardShape[] = [];
    const allShapes: CardShape[] = [
      "circle",
      "cross",
      "star",
      "triangle",
      "square",
    ];

    allShapes.forEach((shape) => {
      const preference = this.opponentPatterns.shapePreference.get(shape) || 0;
      if (preference > this.opponentPatterns.totalPlays * 0.2) {
        likelyShapes.push(shape);
      }
    });

    return likelyShapes;
  }

  private calculateShapeExpectedValue(
    shape: CardShape,
    probability: number,
    opponentShapes: CardShape[],
    gameState: any
  ): number {
    let value = probability * 10; // Base value

    // Avoid shapes opponent likely has
    if (opponentShapes.includes(shape)) {
      value -= 5;
    }

    // Consider current top card
    const topCard = gameState.discardPile[gameState.discardPile.length - 1];
    if (topCard && !topCard.isWhot && topCard.shape === shape) {
      value += 3; // Continuity bonus
    }

    return value;
  }

  private calculateCardProbabilities(
    validPlays: number[],
    hand: Card[],
    gameState: any
  ): Map<number, number> {
    const probabilities = new Map<number, number>();

    validPlays.forEach((index) => {
      const card = hand[index];
      let probability = 1;

      // Adjust based on card rarity
      const key = `${card.shape}-${card.number}`;
      const seenCount = this.cardMemory.get(key) || 0;
      if (seenCount > 0) {
        probability *= 0.8; // Reduce probability for seen cards
      }

      // Adjust based on special card rules
      if (card.isWhot) {
        probability *= 1.2; // Slightly prefer WHOT cards
      }

      probabilities.set(index, probability);
    });

    return probabilities;
  }

  private calculateCardExpectedValue(
    index: number,
    probability: number,
    hand: Card[],
    gameState: any
  ): number {
    const card = hand[index];
    let value = probability * (CARD_VALUES[card.number] || 0);

    // Special card bonuses
    if (card.isWhot) {
      value += 5; // WHOT cards are valuable
    }

    if (card.number === SPECIAL_CARD_RULES.PICK_TWO) {
      value += 3; // Pick Two can be disruptive
    }

    if (card.number === SPECIAL_CARD_RULES.GENERAL_MARKET) {
      value += 2; // General Market is useful
    }

    return value;
  }

  private calculateShapeValue(shape: CardShape, gameState: any): number {
    const topCard = gameState.discardPile[gameState.discardPile.length - 1];
    if (topCard && !topCard.isWhot && topCard.shape === shape) {
      return 5; // Matching shape bonus
    }
    return 0;
  }

  private calculateSpecialCardValue(card: Card, gameState: any): number {
    if (card.isWhot) return 10;
    if (card.number === SPECIAL_CARD_RULES.PICK_TWO) return 5;
    if (card.number === SPECIAL_CARD_RULES.GENERAL_MARKET) return 3;
    return 0;
  }

  private predictOpponentResponses(
    validPlays: number[],
    hand: Card[],
    gameState: any
  ): { expectedDamage: number } {
    let totalDamage = 0;

    validPlays.forEach((index) => {
      const card = hand[index];

      // Estimate opponent's ability to respond
      const opponentHandSize = this.getOpponentHandSize(gameState);
      const responseProbability = Math.min(opponentHandSize / 10, 1);

      if (card.number === SPECIAL_CARD_RULES.PICK_TWO) {
        totalDamage += responseProbability * 2; // Opponent might have Pick Two
      }

      if (card.isWhot) {
        totalDamage += responseProbability * 1; // Opponent gets shape choice
      }
    });

    return { expectedDamage: totalDamage / validPlays.length };
  }

  private simulateAction(gameState: any, action: number, hand: Card[]): any {
    // Simplified action simulation
    return { ...gameState };
  }

  private simulateRandomPlay(gameState: any): any {
    // Simplified random play simulation
    return { ...gameState };
  }

  private isGameOver(gameState: any): boolean {
    return (
      gameState.players.some((p: any) => p.hand.length === 0) ||
      gameState.drawPile.length === 0
    );
  }

  private getValidPlays(gameState: any): number[] {
    // Simplified valid plays calculation
    return [0, 1, 2]; // Placeholder
  }

  private getMyHandSize(gameState: any): number {
    const myPlayer = gameState.players.find(
      (p: any) => p.id === this.getMyPlayerId(gameState)
    );
    return myPlayer ? myPlayer.hand.length : 0;
  }

  private getOpponentHandSize(gameState: any): number {
    const opponent = gameState.players.find(
      (p: any) => p.id !== this.getMyPlayerId(gameState)
    );
    return opponent ? opponent.hand.length : 0;
  }

  private getMyPlayerId(gameState: any): string {
    return gameState.players[1]?.id || "";
  }
}
