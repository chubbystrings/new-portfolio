/**
 * Represents a single log entry with timestamp, action, and details.
 * Used for tracking game events and debugging purposes.
 */
export interface GameLogEntry {
    timestamp: string;
    action: string;
    details: any;
  }
  
  /**
   * Centralized logging system for the Whot game.
   * Provides both in-memory storage and console output for game events.
   * Useful for debugging, game analysis, and tracking player actions.
   */
  class GameLogger {
    private logs: GameLogEntry[] = [];
  
    /**
     * Logs a game event with timestamp and optional details.
     * Stores the entry in memory and outputs to console for immediate visibility.
     * @param action - The type of action or event being logged
     * @param details - Optional additional information about the event
     */
    log(action: string, details: any = {}) {
      const entry: GameLogEntry = {
        timestamp: new Date().toISOString(),
        action,
        details,
      };
      this.logs.push(entry);
      // Log to console as well for immediate debugging
    //   console.log(`[${entry.timestamp}] ${action}`, details);
    }
  
    /**
     * Retrieves all logged entries for analysis or debugging.
     * @returns Array of all logged game events
     */
    getLogs(): GameLogEntry[] {
      return this.logs;
    }
  
    /**
     * Clears all stored log entries.
     * Useful for starting fresh or managing memory usage.
     */
    clear() {
      this.logs = [];
    }
  }
  
  // Export a singleton instance for use throughout the application
  export const gameLogger = new GameLogger(); 