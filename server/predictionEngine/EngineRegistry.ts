import { IPredictionEngine, EngineMetadata } from "./types";

/**
 * EngineRegistry
 * 
 * Singleton registry for managing prediction engines and their metadata.
 * Implements the Registry pattern for extensibility.
 * 
 * Features:
 * - Extensible: add engines without modifying existing code
 * - No hardcoding: engines registered dynamically
 * - Open/Closed Principle: open for extension, closed for modification
 * - Supports unlimited engines (no architectural limits)
 * - Manages engine metadata separately from contract
 * - Preserves Contract Freeze on IPredictionEngine
 */
export class EngineRegistry {
  private static instance: EngineRegistry;
  private engines: Map<string, IPredictionEngine> = new Map();
  private metadata: Map<string, EngineMetadata> = new Map();

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
   * Register an engine with metadata
   * 
   * @param engineId Unique identifier for the engine
   * @param engine IPredictionEngine implementation
   * @param metadata Engine metadata (name, category, role, description, etc.)
   * @remarks Idempotent: if engine is already registered, it will be skipped (not re-registered)
   */
  register(engineId: string, engine: IPredictionEngine, metadata: EngineMetadata): void {
    if (this.engines.has(engineId)) {
      // Idempotent: allow re-registration (useful for testing)
      // If engine is already registered, skip silently
      return;
    }
    this.engines.set(engineId, engine);
    this.metadata.set(engineId, metadata);
  }

  /**
   * Unregister an engine
   * 
   * @param engineId Engine ID to unregister
   * @returns true if engine was unregistered, false if not found
   */
  unregister(engineId: string): boolean {
    this.metadata.delete(engineId);
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
   * Get engine metadata by ID
   * 
   * @param engineId Engine ID to retrieve metadata for
   * @returns The engine metadata
   * @throws Error if engine not found
   */
  getMetadata(engineId: string): EngineMetadata {
    const metadata = this.metadata.get(engineId);
    if (!metadata) {
      throw new Error(`Engine metadata not found: ${engineId}`);
    }
    return metadata;
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
   * List engines by category
   * 
   * @param category Engine category to filter by
   * @returns Array of engine IDs in the specified category
   */
  listByCategory(category: string): string[] {
    const result: string[] = [];
    for (const [engineId, metadata] of this.metadata.entries()) {
      if (metadata.category === category) {
        result.push(engineId);
      }
    }
    return result;
  }

  /**
   * Get all engine metadata
   * 
   * @returns Map of engine IDs to metadata
   */
  getAllMetadata(): Map<string, EngineMetadata> {
    return new Map(this.metadata);
  }

  /**
   * Clear all engines (useful for testing)
   */
  clear(): void {
    this.engines.clear();
    this.metadata.clear();
  }
}
