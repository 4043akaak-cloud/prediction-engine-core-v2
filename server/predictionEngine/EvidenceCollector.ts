import { IEvidenceCollector, Evidence } from "./types";
import { StandardizedEvidence } from "./types";
import { IEvidenceSource } from "./sources/IEvidenceSource";
import { MockEvidenceSource } from "./sources/MockEvidenceSource";
import { StaticDatasetEvidenceSource } from "./sources/StaticDatasetEvidenceSource";

export class EvidenceCollector implements IEvidenceCollector {
  private sources: IEvidenceSource[];

  constructor(sources?: IEvidenceSource[]) {
    // Use provided sources or default to mock + static dataset
    this.sources = sources || [
      new MockEvidenceSource(),
      new StaticDatasetEvidenceSource(),
    ];
  }

  async collect(query: string): Promise<Evidence & { standardizedEvidence?: StandardizedEvidence[] }> {
    console.log(`Collecting evidence for query: ${query}`);
    console.log(`Using ${this.sources.length} evidence sources`);
    
    // Collect evidence from all sources
    const allEvidence: StandardizedEvidence[] = [];
    for (const source of this.sources) {
      try {
        const evidence = await source.getEvidence(query);
        console.log(`Evidence from ${source.getName()}: ${evidence.length} items`);
        allEvidence.push(...evidence);
      } catch (error) {
        console.error(`Error collecting from ${source.getName()}:`, error);
      }
    }

    // Return both legacy format (for backward compatibility) and standardized evidence
    return {
      query: query,
      mockData: "This is some mock evidence related to the query.",
      timestamp: Date.now(),
      standardizedEvidence: allEvidence,
    };
  }
}
