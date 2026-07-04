import { StandardizedEvidence } from "../types";
import { IEvidenceSource } from "./IEvidenceSource";
import { v4 as uuidv4 } from 'uuid';

/**
 * Mock evidence source for testing and development.
 */
export class MockEvidenceSource implements IEvidenceSource {
  async getEvidence(query: string): Promise<StandardizedEvidence[]> {
    return [
      {
        id: uuidv4(),
        source: "mock-data-source",
        title: "Query Analysis",
        summary: `Mock analysis of query: "${query}"`,
        confidence: 0.85,
        timestamp: Date.now(),
        type: "query_analysis",
      },
      {
        id: uuidv4(),
        source: "mock-context",
        title: "Contextual Information",
        summary: "Mock contextual data related to the prediction",
        confidence: 0.75,
        timestamp: Date.now(),
        type: "context",
      },
    ];
  }

  getName(): string {
    return "MockEvidenceSource";
  }
}

