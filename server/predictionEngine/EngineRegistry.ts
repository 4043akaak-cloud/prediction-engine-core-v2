import { IPredictionEngine } from "./types";

/**
 * EngineRegistry
 * 
 * Singleton registry for managing prediction engines.
 * Implements the Registry pattern for extensibility.
 * 
 * Features:
 * - Extensible: add engines without modifying existing code
 * - No hardcoding: engines registered dynamically
 * - Open/Closed Principle: open for extension, closed for modification
 * - Supports unlimited engines (no architectural limits)
 */
export class EngineRegistry {
  private static instance: EngineRegistry;
  private engines: Map<string, IPredictionEngine> = new Map();

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): EngineRegistry {
    if (!EngineRegistry.instance) {
      EngineRegistry.instance = new EngineRegistry();
    }
    return EngineRegistry.instance;
  }

  /**
   * Register an engine
   * 
   * @param engineId Unique identifier for the engine
   * @param engine IPredictionEngine implementation
   * @remarks Idempotent: if engine is already registered, it will be skipped (not re-registered)
   */
  register(engineId: string, engine: IPredictionEngine): void {
    if (this.engines.has(engineId)) {
      // Idempotent: allow re-registration (useful for testing)
      // If engine is already registered, skip silently
      return;
    }
    this.engines.set(engineId, engine);
  }

  /**
   * Unregister an engine
   * 
   * @param engineId Engine ID to unregister
   * @returns true if engine was unregistered, false if not found
   */
  unregister(engineId: string): boolean {
    return this.engines.delete(engineId);
  }

  /**
   * Get an engine by ID
   * 
   * @param engineId Engine ID to retrieve
   * @returns The engine instance
   * @throws Error if engine not found
   */
  get(engineId: string): IPredictionEngine {
    const engine = this.engines.get(engineId);
    if (!engine) {
      throw new Error(`Engine not found: ${engineId}`);
    }
    return engine;
  }

  /**
   * Check if an engine exists
   * 
   * @param engineId Engine ID to check
   * @returns true if engine exists
   */
  exists(engineId: string): boolean {
    return this.engines.has(engineId);
  }

  /**
   * List all registered engine IDs
   * 
   * @returns Array of engine IDs
   */
  list(): string[] {
    return Array.from(this.engines.keys());
  }

  /**
   * Clear all engines (useful for testing)
   */
  clear(): void {
    this.engines.clear();
  }
}
