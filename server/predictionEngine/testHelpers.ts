import { EngineRegistry } from "./EngineRegistry";
import { initializeEngines } from "./EngineInitializer";

/**
 * setupTestPredictionEngines
 * 
 * Shared test helper that initializes the prediction engine registry for tests.
 * 
 * Usage in tests:
 * ```
 * import { setupTestPredictionEngines } from "./testHelpers";
 * 
 * describe("MyTest", () => {
 *   beforeEach(() => {
 *     setupTestPredictionEngines();
 *   });
 * });
 * ```
 * 
 * This ensures:
 * - Registry is cleared before each test
 * - All engines are registered
 * - No duplication across test files
 * - DRY principle maintained
 */
export function setupTestPredictionEngines(): void {
  const registry = EngineRegistry.getInstance();
  registry.clear();
  initializeEngines();
}
