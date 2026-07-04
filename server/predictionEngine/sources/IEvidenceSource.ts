import { StandardizedEvidence } from "../types";

/**
 * Interface for evidence sources.
 * Each source provides evidence data for predictions.
 */
export interface IEvidenceSource {
  /**
   * Get evidence for a given query.
   * @param query - The prediction query
   * @returns Array of standardized evidence
   */
  getEvidence(query: string): Promise<StandardizedEvidence[]>;

  /**
   * Get the source name for identification.
   */
  getName(): string;
}

