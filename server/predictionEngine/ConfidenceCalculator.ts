import { IConfidenceCalculator, RecipeExecutionResult, Evidence } from "./types";

export class ConfidenceCalculator implements IConfidenceCalculator {
  calculate(recipeResult: RecipeExecutionResult, evidence: Evidence): number {
    console.log("Calculating confidence...");
    
    // Base confidence calculation
    const baseConfidence = 0.75; // 75%
    
    // Adjust confidence based on query length (mock logic)
    let confidence = baseConfidence;
    if (evidence.query && typeof evidence.query === 'string') {
      confidence = Math.min(1.0, baseConfidence + (evidence.query.length % 10) * 0.01);
    }
    
    // Apply evidence weights if available
    if (evidence.standardizedEvidence && Array.isArray(evidence.standardizedEvidence)) {
      const evidenceWeights = evidence.standardizedEvidence
        .map(e => e.weight || 1.0)
        .filter(w => w > 0);
      
      if (evidenceWeights.length > 0) {
        const averageWeight = evidenceWeights.reduce((a, b) => a + b, 0) / evidenceWeights.length;
        // Apply weight factor: confidence is adjusted by the average weight
        // Weight > 1.0 increases confidence, Weight < 1.0 decreases confidence
        confidence = Math.min(1.0, confidence * averageWeight);
        console.log(`Applied evidence weights. Average weight: ${averageWeight}, Adjusted confidence: ${confidence}`);
      }
    }
    
    return confidence;
  }
}
