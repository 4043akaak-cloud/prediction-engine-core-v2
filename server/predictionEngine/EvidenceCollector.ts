import { IEvidenceCollector, Evidence } from "./types";

export class EvidenceCollector implements IEvidenceCollector {
  collect(query: string): Evidence {
    console.log(`Collecting evidence for query: ${query}`);
    // Simulate evidence collection based on the query
    return {
      query: query,
      mockData: "This is some mock evidence related to the query.",
      timestamp: Date.now(),
    };
  }
}
