import { publicProcedure, router } from "../_core/trpc";
import { EngineRegistry } from "../predictionEngine/EngineRegistry";
import { z } from "zod";

/**
 * Engine Library Router
 *
 * Phase 1A: Engine Library Foundation
 *
 * Responsibility: Expose engine metadata for discovery and browsing
 * Scope: Engine Library, Category Pages, Engine Detail Pages only
 *
 * NOT included: Recipe Builder, Strategy Analyst, Recommendations, Personalization
 */

/**
 * Engine DTO - Data Transfer Object for Engine Library
 * Contains all 12 approved metadata fields
 */
interface EngineDTO {
  id: string;
  name: string;
  family: string;
  category: string;
  role: string;
  coreQuestion: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  input: string;
  output: string;
  version: string;
  status: "stable" | "beta" | "experimental";
  knowledgeSource?: {
    type: "People" | "Theories & Laws" | "Philosophy" | "Art & Culture" | "Natural Systems";
    value: string;
  };
}

/**
 * Category DTO - Data Transfer Object for Category Pages
 */
interface CategoryDTO {
  name: string;
  description: string;
}

/**
 * Category descriptions - sourced from ENGINE_CATEGORY_SYSTEM.md
 */
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Temporal Reasoning":
    "Reasons through changes over time, sequences, trends, cycles, and temporal behavior. Analyzes how phenomena evolve through time and predicts future states based on temporal patterns.",
  "Statistical Reasoning":
    "Reasons through probability, statistical inference, distributions, variance, confidence, and quantitative analysis. Uses mathematical statistics to estimate parameters, test hypotheses, and quantify uncertainty.",
  "Pattern Reasoning":
    "Reasons by discovering recurring structures, similarities, symmetry, repetition, and hidden patterns. Identifies regularities and structures in data that may not be obvious from individual observations.",
  "Causal Reasoning":
    "Reasons through cause-and-effect relationships, dependency chains, and explanatory inference. Models how changes in one variable affect others and predicts outcomes of interventions.",
  "Semantic Reasoning":
    "Reasons through meaning, concepts, language understanding, contextual interpretation, and semantic relationships. Extracts meaning from text and other symbolic representations for reasoning.",
  "Metric Reasoning":
    "Reasons through quantitative measurements, indicators, state evaluation, monitoring, and observable metrics. Assesses current state based on real-time measurements and observable indicators.",
  "Evidence Synthesis":
    "Reasons by collecting, combining, validating, and synthesizing multiple heterogeneous sources of evidence. Gathers information from multiple sources and integrates findings into coherent conclusions.",
  "Learning Family":
    "Improves predictions through adaptation and learning from feedback. Engines in this family enhance their predictions by adapting to historical data or discovering relationships.",
};

export const engineLibraryRouter = router({
  /**
   * List all engines with their metadata
   * Used by: Engine Library page
   */
  listEngines: publicProcedure.query((): EngineDTO[] => {
    const registry = EngineRegistry.getInstance();
    const engineIds = registry.list();
    const allMetadata = registry.getAllMetadata();

    return engineIds.map((id) => {
      const metadata = allMetadata.get(id);
      if (!metadata) {
        throw new Error(`Metadata not found for engine: ${id}`);
      }
      return {
        id,
        name: metadata.name,
        family: metadata.family || "Unknown",
        category: metadata.category,
        role: metadata.role,
        coreQuestion: metadata.coreQuestion || "",
        description: metadata.description,
        strengths: metadata.strengths || [],
        weaknesses: metadata.weaknesses || [],
        input: metadata.input,
        output: metadata.output,
        version: metadata.version,
        status: metadata.status || "stable",
        ...(metadata.knowledgeSource && { knowledgeSource: metadata.knowledgeSource }),
      };
    });
  }),

  /**
   * Get a single engine by ID
   * Used by: Engine Detail page
   */
  getEngine: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }): EngineDTO => {
      const registry = EngineRegistry.getInstance();
      const metadata = registry.getMetadata(input.id);

      return {
        id: input.id,
        name: metadata.name,
        family: metadata.family || "Unknown",
        category: metadata.category,
        role: metadata.role,
        coreQuestion: metadata.coreQuestion || "",
        description: metadata.description,
        strengths: metadata.strengths || [],
        weaknesses: metadata.weaknesses || [],
        input: metadata.input,
        output: metadata.output,
        version: metadata.version,
        status: metadata.status || "stable",
        ...(metadata.knowledgeSource && { knowledgeSource: metadata.knowledgeSource }),
      };
    }),

  /**
   * List engines by category
   * Used by: Category pages
   */
  listByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(({ input }): EngineDTO[] => {
      const registry = EngineRegistry.getInstance();
      const engineIds = registry.listByCategory(input.category);
      const allMetadata = registry.getAllMetadata();

      return engineIds.map((id) => {
        const metadata = allMetadata.get(id);
        if (!metadata) {
          throw new Error(`Metadata not found for engine: ${id}`);
        }
        return {
          id,
          name: metadata.name,
          family: metadata.family || "Unknown",
          category: metadata.category,
          role: metadata.role,
          coreQuestion: metadata.coreQuestion || "",
          description: metadata.description,
          ...(metadata.knowledgeSource && { knowledgeSource: metadata.knowledgeSource }),
          strengths: metadata.strengths || [],
          weaknesses: metadata.weaknesses || [],
          input: metadata.input,
          output: metadata.output,
          version: metadata.version,
          status: metadata.status || "stable",
        };
      });
    }),

  /**
   * List all categories
   * Used by: Engine Library page (category navigation)
   */
  listCategories: publicProcedure.query((): CategoryDTO[] => {
    const registry = EngineRegistry.getInstance();
    const allMetadata = registry.getAllMetadata();

    // Collect unique categories
    const categoriesSet = new Set<string>();
    for (const metadata of Array.from(allMetadata.values())) {
      categoriesSet.add(metadata.category);
    }

    // Convert to sorted array with descriptions
    return Array.from(categoriesSet)
      .sort()
      .map((category) => ({
        name: category,
        description: CATEGORY_DESCRIPTIONS[category] || "Category description not available",
      }));
  }),

  /**
   * Get a single category by name
   * Used by: Category detail page
   */
  getCategory: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }): CategoryDTO => {
      return {
        name: input.name,
        description: CATEGORY_DESCRIPTIONS[input.name] || "Category description not available",
      };
    }),
});
