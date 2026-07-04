import { IEvidenceCollector, Evidence } from "./types";
import { StandardizedEvidence } from "./types";
import { v4 as uuidv4 } from 'uuid';

export class EvidenceCollector implements IEvidenceCollector {
  collect(query: string): Evidence & { standardizedEvidence?: StandardizedEvidence[] } {
    console.log(`Collecting evidence for query: ${query}`);
    
    // Create standardized evidence objects
    const standardizedEvidence: StandardizedEvidence[] = [
      {
        id: uuidv4(),
        source: "mock-data-source",
        title: "Query Analysis",
        summary: `Analysis of query: "${query}"`,
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

    // Return both legacy format (for backward compatibility) and standardized evidence
    return {
      query: query,
      mockData: "This is some mock evidence related to the query.",
      timestamp: Date.now(),
      standardizedEvidence,
    };
  }
}
