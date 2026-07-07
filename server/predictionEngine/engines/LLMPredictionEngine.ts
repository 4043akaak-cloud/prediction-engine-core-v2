import { IPredictionEngine, PredictionRequest, PredictionResult } from "../types";
import { ILLMProvider } from "../providers/ILLMProvider";

/**
 * LLM Prediction Engine
 * Extracts meaning and contextual interpretation using language models
 * Role: The Sage
 */
export class LLMPredictionEngine implements IPredictionEngine {
  constructor(private llmProvider: ILLMProvider) {}

  async predict(request: PredictionRequest): Promise<PredictionResult> {
    try {
      // Analyze the query using LLM
      const llmResponse = await this.llmProvider.analyzeText({
        text: request.query,
      });

      // Extract evidence from LLM response
      const evidence = this.extractEvidence(llmResponse);

      // Calculate confidence
      const confidence = this.calculateConfidence(llmResponse, evidence);

      // Generate prediction based on reasoning
      const prediction = this.generatePrediction(llmResponse);

      // Identify factors
      const factors = this.identifyFactors(llmResponse);

      // Generate reason
      const reason = this.generateReason(llmResponse, factors);

      // Generate explanation
      const explanation = this.generateExplanation(llmResponse, evidence);

      return {
        id: `llm-${Date.now()}`,
        prediction,
        confidence,
        reason,
        recipeUsed: "llm-recipe",
        timestamp: Date.now(),
        metadata: {
          recipeId: "llm-recipe",
          recipeName: "LLM Semantic Recipe",
          executionTimestamp: Date.now(),
          confidenceScore: confidence,
          evidenceCount: evidence.length,
          predictionVersion: "1.0.0",
        },
        explanation,
      };
    } catch (error) {
      // Graceful error handling
      return {
        id: `llm-error-${Date.now()}`,
        prediction: "Unable to generate prediction",
        confidence: 0,
        reason: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        recipeUsed: "llm-recipe",
        timestamp: Date.now(),
        metadata: {
          recipeId: "llm-recipe",
          recipeName: "LLM Semantic Recipe",
          executionTimestamp: Date.now(),
          confidenceScore: 0,
          evidenceCount: 0,
          predictionVersion: "1.0.0",
        },
        explanation: "LLM analysis failed",
      };
    }
  }

  private extractEvidence(llmResponse: any): string[] {
    // Extract evidence from LLM response
    if (typeof llmResponse === "string") {
      return [llmResponse.substring(0, 200)];
    }
    return [];
  }

  private calculateConfidence(llmResponse: any, evidence: string[]): number {
    // Calculate confidence based on evidence quality
    const baseConfidence = 0.6 + evidence.length * 0.1;
    return Math.min(baseConfidence, 0.95);
  }

  private generatePrediction(llmResponse: any): string {
    if (typeof llmResponse === "string") {
      return llmResponse.substring(0, 300);
    }
    return "LLM-based prediction generated";
  }

  private identifyFactors(llmResponse: any): string[] {
    // Identify key factors from LLM response
    const factors: string[] = [];
    
    if (llmResponse.keyFacts && Array.isArray(llmResponse.keyFacts)) {
      factors.push(...llmResponse.keyFacts.slice(0, 3));
    }
    
    if (llmResponse.opportunities && Array.isArray(llmResponse.opportunities)) {
      factors.push(...llmResponse.opportunities.slice(0, 2));
    }
    
    if (llmResponse.risks && Array.isArray(llmResponse.risks)) {
      factors.push(...llmResponse.risks.slice(0, 2));
    }
    
    return factors.length > 0 ? factors : ["Semantic analysis", "Language patterns", "Contextual interpretation"];
  }

  private generateReason(llmResponse: any, factors: string[]): string {
    // Use provider reasoning if available
    if (llmResponse.reasoning) {
      return `The LLM identified ${factors.length} key factors in the query: ${factors.slice(0, 2).join(", ")}. Analysis indicates: ${llmResponse.reasoning}`;
    }
    return `The LLM identified ${factors.length} key factors in the query and generated a semantic prediction based on language analysis and contextual understanding.`;
  }

  private generateExplanation(llmResponse: any, evidence: string[]): string {
    return `This prediction was generated using LLM semantic analysis, extracting meaning from ${evidence.length} evidence sources with contextual interpretation.`;
  }
}
