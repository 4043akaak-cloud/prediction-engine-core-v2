/**
 * LLMPredictionEngine
 *
 * The ninth specialist engine: "The Strategist"
 *
 * Specializes in:
 * - Text understanding
 * - Reasoning and inference
 * - Opportunity identification
 * - Risk assessment
 * - Evidence generation
 *
 * Depends ONLY on ILLMProvider (abstracted).
 * Future providers can be swapped through DI.
 */

import { IPredictionEngine, PredictionResult, PredictionRequest } from '../types';
import { ILLMProvider, LLMResponse } from '../providers/ILLMProvider';

export class LLMPredictionEngine implements IPredictionEngine {
  constructor(private llmProvider: ILLMProvider) {}

  async predict(request: PredictionRequest): Promise<PredictionResult> {
    try {
      // Analyze the query using LLM
      const llmResponse = await this.llmProvider.analyzeText({
        text: request.query,
        context: request.context,
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
        prediction,
        confidence,
        reason,
        evidence,
        factors,
        explanation,
        metadata: {
          engine: 'llm-engine',
          timestamp: new Date().toISOString(),
          provider: this.llmProvider.getName(),
          evidenceCount: evidence.length,
        },
      };
    } catch (error) {
      // Graceful error handling
      return {
        prediction: 'Unable to generate prediction',
        confidence: 0,
        reason: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        evidence: [],
        factors: [],
        explanation: 'LLM analysis failed',
        metadata: {
          engine: 'llm-engine',
          timestamp: new Date().toISOString(),
          provider: this.llmProvider.getName(),
          error: true,
        },
      };
    }
  }

  private extractEvidence(response: LLMResponse): string[] {
    const evidence: string[] = [];

    // Add summary
    if (response.summary) {
      evidence.push(`Summary: ${response.summary}`);
    }

    // Add key facts
    if (response.keyFacts && response.keyFacts.length > 0) {
      evidence.push(`Key Facts: ${response.keyFacts.join(', ')}`);
    }

    // Add opportunities
    if (response.opportunities && response.opportunities.length > 0) {
      evidence.push(`Opportunities: ${response.opportunities.join(', ')}`);
    }

    // Add risks
    if (response.risks && response.risks.length > 0) {
      evidence.push(`Risks: ${response.risks.join(', ')}`);
    }

    // Add reasoning
    if (response.reasoning) {
      evidence.push(`Reasoning: ${response.reasoning}`);
    }

    return evidence;
  }

  private calculateConfidence(response: LLMResponse, evidence: string[]): number {
    // Base confidence from LLM response
    let confidence = response.confidence || 0.5;

    // Adjust based on evidence quality
    const evidenceCount = evidence.length;
    if (evidenceCount < 2) {
      confidence *= 0.7; // Reduce if limited evidence
    } else if (evidenceCount >= 5) {
      confidence = Math.min(confidence * 1.1, 0.95); // Boost with strong evidence
    }

    // Ensure within valid range
    return Math.max(0.0, Math.min(1.0, confidence));
  }

  private generatePrediction(response: LLMResponse): string {
    // Extract prediction from reasoning
    const reasoning = response.reasoning || '';

    if (reasoning.toLowerCase().includes('positive') || reasoning.toLowerCase().includes('favorable')) {
      return 'Positive outlook';
    }
    if (reasoning.toLowerCase().includes('negative') || reasoning.toLowerCase().includes('unfavorable')) {
      return 'Negative outlook';
    }
    if (reasoning.toLowerCase().includes('mixed') || reasoning.toLowerCase().includes('uncertain')) {
      return 'Mixed signals';
    }

    return 'Neutral outlook';
  }

  private identifyFactors(response: LLMResponse): string[] {
    const factors: string[] = [];

    // Add key facts as factors
    if (response.keyFacts && response.keyFacts.length > 0) {
      factors.push(...response.keyFacts.slice(0, 3));
    }

    // Add opportunities as factors
    if (response.opportunities && response.opportunities.length > 0) {
      factors.push(...response.opportunities.slice(0, 2));
    }

    // Add risks as factors
    if (response.risks && response.risks.length > 0) {
      factors.push(...response.risks.slice(0, 2));
    }

    return factors.slice(0, 7); // Limit to 7 factors
  }

  private generateReason(response: LLMResponse, factors: string[]): string {
    let reason = 'LLM Analysis: ';

    // Add summary
    if (response.summary) {
      reason += response.summary + '. ';
    }

    // Add key factors
    if (factors.length > 0) {
      reason += `Key factors: ${factors.slice(0, 3).join(', ')}. `;
    }

    // Add reasoning
    if (response.reasoning) {
      reason += `Reasoning: ${response.reasoning}`;
    }

    return reason;
  }

  private generateExplanation(response: LLMResponse, evidence: string[]): string {
    let explanation = 'LLM-based analysis with the following evidence:\n\n';

    // Add summary
    if (response.summary) {
      explanation += `**Summary:** ${response.summary}\n\n`;
    }

    // Add key facts
    if (response.keyFacts && response.keyFacts.length > 0) {
      explanation += `**Key Facts:**\n`;
      response.keyFacts.forEach(fact => {
        explanation += `- ${fact}\n`;
      });
      explanation += '\n';
    }

    // Add opportunities
    if (response.opportunities && response.opportunities.length > 0) {
      explanation += `**Opportunities:**\n`;
      response.opportunities.forEach(opp => {
        explanation += `- ${opp}\n`;
      });
      explanation += '\n';
    }

    // Add risks
    if (response.risks && response.risks.length > 0) {
      explanation += `**Risks:**\n`;
      response.risks.forEach(risk => {
        explanation += `- ${risk}\n`;
      });
      explanation += '\n';
    }

    // Add reasoning
    if (response.reasoning) {
      explanation += `**Reasoning:** ${response.reasoning}\n`;
    }

    // Add confidence
    explanation += `\n**Confidence:** ${(response.confidence * 100).toFixed(1)}%`;

    return explanation;
  }
}
