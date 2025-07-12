import { AIStrategy } from './AIStrategy';
import { EasyAIStrategy } from './EasyAIStrategy';
import { DifficultAIStrategy } from './DifficultAIStrategy';
import { ExpertAIStrategy } from './ExpertAIStrategy';

/**
 * Available AI difficulty levels.
 */
export type AIDifficulty = 'easy' | 'difficult' | 'expert';

/**
 * AI Factory for creating AI strategies with different difficulty levels.
 * Provides a centralized way to manage and create AI opponents.
 */
export class AIFactory {
  /**
   * Creates an AI strategy based on the specified difficulty level.
   * @param difficulty - The desired difficulty level
   * @returns An AI strategy instance
   * @throws Error if an invalid difficulty level is provided
   */
  static createStrategy(difficulty: AIDifficulty): AIStrategy {
    switch (difficulty) {
      case 'easy':
        return new EasyAIStrategy();
      case 'difficult':
        return new DifficultAIStrategy();
      case 'expert':
        return new ExpertAIStrategy();
      default:
        throw new Error(`Invalid AI difficulty level: ${difficulty}`);
    }
  }

  /**
   * Gets all available difficulty levels with their descriptions.
   * @returns Array of difficulty information
   */
  static getAvailableDifficulties(): Array<{
    value: AIDifficulty;
    name: string;
    description: string;
  }> {
    return [
      {
        value: 'easy',
        name: 'Easy',
        description: 'Basic AI that makes simple decisions with some randomness. Good for beginners!'
      },
      {
        value: 'difficult',
        name: 'Difficult',
        description: 'Advanced AI with card counting, opponent analysis, and strategic planning. A real challenge!'
      },
      {
        value: 'expert',
        name: 'Expert',
        description: 'Master-level AI using Monte Carlo Tree Search, Minimax algorithms, and advanced pattern recognition. Extremely challenging!'
      }
    ];
  }

  /**
   * Gets the default difficulty level.
   * @returns The default difficulty
   */
  static getDefaultDifficulty(): AIDifficulty {
    return 'easy';
  }
} 