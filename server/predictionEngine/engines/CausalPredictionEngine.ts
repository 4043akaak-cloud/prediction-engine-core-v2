import type { Evidence, IPredictionEngine, PredictionResult } from "../types";

/**
 * CausalPredictionEngine - "The Detective"
 *
 * Specialty: Cause-and-effect reasoning
 *
 * This engine analyzes causal relationships and answers:
 * "What is causing this prediction?"
 *
 * Algorithms:
 * 1. Dependency scoring - Identify which factors depend on others
 * 2. Cause ranking - Rank causes by strength and confidence
 * 3. Trigger detection - Identify trigger events that cause changes
 * 4. Influence weighting - Weight positive/negative influences
 * 5. Evidence aggregation - Aggregate evidence for causal claims
 */
export class CausalPredictionEngine implements IPredictionEngine {
  async predict(evidence: Evidence): Promise<RecipeExecutionResult> {
    const query = evidence.query || "";
    const timestamp = Date.now();
    const predictionId = `causal-${timestamp}-${Math.random().toString(36).slice(2, 9)}`;

    // Analyze causal relationships
    const causalAnalysis = this.analyzeCausalRelationships(query);
    const causes = causalAnalysis.causes;
    const triggers = causalAnalysis.triggers;
    const influences = causalAnalysis.influences;
    const confidence = causalAnalysis.confidence;

    // Generate prediction based on causal analysis
    const prediction = this.generateCausalPrediction(query, causes, triggers, influences);
    const reason = this.generateCausalReason(causes, triggers, influences, confidence);

    return {
      id: predictionId,
      prediction,
      confidence,
      reason,
      recipeUsed: evidence.recipeId || "causal-recipe",
      timestamp,
      metadata: {
        recipeId: evidence.recipeId || "causal-recipe",
        recipeName: "Causal Analysis Recipe",
        executionTimestamp: timestamp,
        confidenceScore: confidence,
        evidenceCount: causes.length + triggers.length,
        predictionVersion: "1.0.0",
      },
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  /**
   * Analyze causal relationships in the query
   */
  private analyzeCausalRelationships(query: string) {
    const words = query.toLowerCase().split(/\s+/);
    const causes: string[] = [];
    const triggers: string[] = [];
    const influences: { factor: string; weight: number; direction: "positive" | "negative" }[] = [];

    // Dependency scoring - identify causal keywords
    const causalKeywords = ["because", "caused", "due", "result", "effect", "impact", "lead", "trigger"];
    const hasCausalLanguage = causalKeywords.some(keyword => query.toLowerCase().includes(keyword));

    // Trigger detection - identify trigger events
    const triggerKeywords = ["when", "if", "after", "before", "during", "while", "then"];
    const hasTriggerLanguage = triggerKeywords.some(keyword => query.toLowerCase().includes(keyword));

    // Cause ranking - extract potential causes from query structure
    if (hasCausalLanguage) {
      // Extract words around causal keywords as potential causes
      for (let i = 0; i < words.length; i++) {
        for (const keyword of causalKeywords) {
          if (words[i].includes(keyword)) {
            // Add surrounding words as causes
            if (i > 0) causes.push(words[i - 1]);
            if (i + 1 < words.length) causes.push(words[i + 1]);
          }
        }
      }
    }

    // Trigger detection
    if (hasTriggerLanguage) {
      for (let i = 0; i < words.length; i++) {
        for (const keyword of triggerKeywords) {
          if (words[i].includes(keyword)) {
            // Add following words as triggers
            if (i + 1 < words.length) triggers.push(words[i + 1]);
            if (i + 2 < words.length) triggers.push(words[i + 2]);
          }
        }
      }
    }

    // Influence weighting - analyze sentiment and impact
    const positiveWords = ["increase", "grow", "improve", "enhance", "boost", "rise", "strengthen"];
    const negativeWords = ["decrease", "fall", "decline", "weaken", "reduce", "drop", "diminish"];

    for (const word of words) {
      if (positiveWords.some(pw => word.includes(pw))) {
        influences.push({ factor: word, weight: 0.7, direction: "positive" });
      }
      if (negativeWords.some(nw => word.includes(nw))) {
        influences.push({ factor: word, weight: 0.6, direction: "negative" });
      }
    }

    // Evidence aggregation - calculate overall confidence
    const evidenceCount = causes.length + triggers.length + influences.length;
    const confidence = Math.min(0.95, 0.5 + (evidenceCount * 0.1));

    return {
      causes: Array.from(new Set(causes)).slice(0, 3), // Unique causes, max 3
      triggers: Array.from(new Set(triggers)).slice(0, 3), // Unique triggers, max 3
      influences: influences.slice(0, 3), // Max 3 influences
      confidence,
      evidenceCount,
      rawPredictionData: {
        value: prediction || "",
        factors: [],
      },
    };
  }

  /**
   * Generate causal prediction based on analysis
   */
  private generateCausalPrediction(
    query: string,
    causes: string[],
    triggers: string[],
    influences: { factor: string; weight: number; direction: "positive" | "negative" }[],
  ): string {
    if (causes.length === 0 && triggers.length === 0) {
      return `No clear causal relationship detected for "${query}". The prediction depends on multiple independent factors.`;
    }

    let prediction = `The prediction for "${query}" is caused by:`;

    if (causes.length > 0) {
      prediction += ` Primary causes: ${causes.join(", ")}.`;
    }

    if (triggers.length > 0) {
      prediction += ` Trigger events: ${triggers.join(", ")}.`;
    }

    if (influences.length > 0) {
      const positiveInfluences = influences.filter(i => i.direction === "positive").map(i => i.factor);
      const negativeInfluences = influences.filter(i => i.direction === "negative").map(i => i.factor);

      if (positiveInfluences.length > 0) {
        prediction += ` Positive influences: ${positiveInfluences.join(", ")}.`;
      }
      if (negativeInfluences.length > 0) {
        prediction += ` Negative influences: ${negativeInfluences.join(", ")}.`;
      }
    }

    return prediction;
  }

  /**
   * Generate detailed causal reasoning explanation
   */
  private generateCausalReason(
    causes: string[],
    triggers: string[],
    influences: { factor: string; weight: number; direction: "positive" | "negative" }[],
    confidence: number,
  ): string {
    const confidencePercent = Math.round(confidence * 100);

    let reason = `Causal Analysis (${confidencePercent}% confidence): `;

    if (causes.length > 0) {
      reason += `The primary causes are ${causes.join(" and ")}. `;
    }

    if (triggers.length > 0) {
      reason += `These are triggered by ${triggers.join(" and ")}. `;
    }

    if (influences.length > 0) {
      const strongInfluences = influences.filter(i => i.weight > 0.6);
      if (strongInfluences.length > 0) {
        const factors = strongInfluences.map(i => `${i.factor} (${i.direction})`).join(", ");
        reason += `Strong influencing factors: ${factors}. `;
      }
    }

    reason += `This causal chain explains the predicted outcome with moderate to high confidence.`;

    return reason;
  }
}
